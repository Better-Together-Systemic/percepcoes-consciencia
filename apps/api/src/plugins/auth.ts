import cookie from '@fastify/cookie';
import jwt from '@fastify/jwt';
import type { CookieSerializeOptions } from '@fastify/cookie';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import type { PublicUser, Role } from '@percepcoes/shared';
import type { Env } from '../config/env';
import { Errors } from '../lib/errors';
import type { AuthService } from '../modules/auth/auth.service';

export const SESSION_COOKIE = 'pc_session';

interface SessionClaims {
  sub: string;
  role: Role;
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: SessionClaims;
    user: SessionClaims;
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    requireAdmin: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    sessionCookieOptions: CookieSerializeOptions;
  }
  interface FastifyRequest {
    currentUser: PublicUser;
  }
}

/**
 * Sessão via JWT em cookie httpOnly + SameSite=Strict: o token nunca fica
 * acessível ao JavaScript da página (mitiga roubo via XSS) e não é enviado em
 * requisições cross-site (mitiga CSRF).
 */
export async function registerAuth(app: FastifyInstance, env: Env, auth: AuthService) {
  const ttlSeconds = env.SESSION_TTL_HOURS * 3600;

  await app.register(cookie);
  await app.register(jwt, {
    secret: env.JWT_SECRET,
    cookie: { cookieName: SESSION_COOKIE, signed: false },
    sign: { expiresIn: ttlSeconds, algorithm: 'HS256' },
    verify: { algorithms: ['HS256'] },
  });

  app.decorate('sessionCookieOptions', {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: ttlSeconds,
  } satisfies CookieSerializeOptions);

  app.decorateRequest('currentUser', null as unknown as PublicUser);

  app.decorate('authenticate', async (request: FastifyRequest) => {
    try {
      await request.jwtVerify();
    } catch {
      throw Errors.unauthorized();
    }
    request.currentUser = auth.resolveSessionUser(request.user.sub);
  });

  app.decorate('requireAdmin', async (request: FastifyRequest, reply: FastifyReply) => {
    await app.authenticate(request, reply);
    if (request.currentUser.role !== 'admin') throw Errors.forbidden();
  });
}
