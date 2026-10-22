import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import type { FastifyInstance } from 'fastify';
import type { Env } from '../config/env';
import { Errors } from '../lib/errors';

const UNSAFE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

export async function registerSecurity(app: FastifyInstance, env: Env) {
  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'"],
        frameAncestors: ["'none'"],
        formAction: ["'self'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false,
    hsts: env.NODE_ENV === 'production',
  });

  // Limite global desligado; cada rota sensível declara o seu em `config.rateLimit`.
  await app.register(rateLimit, {
    global: false,
    errorResponseBuilder: (_req, ctx) => ({
      statusCode: ctx.statusCode,
      error: {
        code: 'RATE_LIMITED',
        message: 'Muitas tentativas. Aguarde um pouco e tente novamente.',
      },
    }),
  });

  // Defesa em profundidade contra CSRF, além do cookie SameSite=Strict.
  const allowedOrigin = new URL(env.APP_ORIGIN).origin;
  app.addHook('onRequest', async (request) => {
    if (!UNSAFE_METHODS.has(request.method)) return;
    const origin = request.headers.origin;
    if (origin && origin !== allowedOrigin) throw Errors.forbidden('Origem não permitida.');
  });
}
