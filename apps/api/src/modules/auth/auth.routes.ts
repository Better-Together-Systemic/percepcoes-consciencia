import type { FastifyPluginAsync } from 'fastify';
import { loginRequestSchema } from '@percepcoes/shared';
import { SESSION_COOKIE } from '../../plugins/auth';
import type { AuthService } from './auth.service';

export const authRoutes =
  (auth: AuthService): FastifyPluginAsync =>
  async (app) => {
    app.post(
      '/login',
      { config: { rateLimit: { max: 5, timeWindow: '1 minute' } } },
      async (request, reply) => {
        const credentials = loginRequestSchema.parse(request.body);
        try {
          const user = await auth.authenticate(credentials);
          const token = await reply.jwtSign({ sub: user.id, role: user.role });
          request.log.info({ userId: user.id }, 'login succeeded');
          return reply.setCookie(SESSION_COOKIE, token, app.sessionCookieOptions).send({ user });
        } catch (err) {
          request.log.warn('login failed');
          throw err;
        }
      },
    );

    app.post('/logout', async (_request, reply) =>
      reply.clearCookie(SESSION_COOKIE, app.sessionCookieOptions).code(204).send(),
    );

    app.get('/me', { preHandler: app.authenticate }, async (request) => ({
      user: request.currentUser,
    }));
  };
