import type { FastifyError, FastifyInstance } from 'fastify';
import type { ApiErrorBody } from '@percepcoes/shared';
import { ZodError } from 'zod';
import { AppError } from '../lib/errors';

const body = (code: string, message: string): ApiErrorBody => ({ error: { code, message } });

export function registerErrorHandler(app: FastifyInstance) {
  app.setErrorHandler((err: FastifyError | AppError | ZodError, request, reply) => {
    if (err instanceof ZodError) {
      const message = err.issues[0]?.message ?? 'Dados inválidos.';
      return reply.code(400).send(body('VALIDATION_ERROR', message));
    }
    if (err instanceof AppError) {
      if (err.statusCode >= 500) request.log.error({ err }, err.message);
      return reply.code(err.statusCode).send(body(err.code, err.message));
    }
    // Erros do próprio Fastify/plugins (415, 413, 429...) já trazem status seguro.
    const status = err.statusCode ?? 500;
    if (status < 500) {
      if (status === 429) return reply.code(429).send(err);
      return reply.code(status).send(body(err.code ?? 'BAD_REQUEST', err.message));
    }
    request.log.error({ err }, 'unhandled error');
    return reply.code(500).send(body('INTERNAL_ERROR', 'Erro interno. Tente novamente.'));
  });
}

/**
 * 404 único da aplicação. Com o SPA habilitado, GETs fora de /api devolvem o
 * index.html (rotas client-side como /admin); /api sempre responde 404 em JSON.
 */
export function registerNotFoundHandler(app: FastifyInstance, { spa }: { spa: boolean }) {
  app.setNotFoundHandler((request, reply) => {
    if (
      spa &&
      (request.method === 'GET' || request.method === 'HEAD') &&
      !request.url.startsWith('/api')
    ) {
      return reply.sendFile('index.html');
    }
    return reply
      .code(404)
      .send(body('NOT_FOUND', `Rota ${request.method} ${request.url} não encontrada.`));
  });
}
