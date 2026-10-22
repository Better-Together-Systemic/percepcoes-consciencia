import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import fastifyStatic from '@fastify/static';
import type { FastifyInstance } from 'fastify';

/**
 * Serve o build do frontend (SPA) a partir da mesma origem da API.
 * Retorna se o SPA foi habilitado (o fallback de rotas fica no not-found handler).
 */
export async function registerStatic(app: FastifyInstance, distPath: string): Promise<boolean> {
  const root = resolve(distPath);
  if (!existsSync(resolve(root, 'index.html'))) {
    app.log.warn({ root }, 'WEB_DIST_PATH sem index.html; frontend não será servido');
    return false;
  }

  await app.register(fastifyStatic, {
    root,
    setHeaders: (res, filePath) => {
      res.header(
        'Cache-Control',
        filePath.includes('/assets/') ? 'public, max-age=31536000, immutable' : 'no-cache',
      );
    },
  });

  return true;
}
