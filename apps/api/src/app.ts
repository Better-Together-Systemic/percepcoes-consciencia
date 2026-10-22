import Fastify, { type FastifyInstance } from 'fastify';
import type { Env } from './config/env';
import type { DB } from './db/database';
import type { AnalysisGenerator } from './modules/analysis/analysis.generator';
import { analysisRoutes } from './modules/analysis/analysis.routes';
import { authRoutes } from './modules/auth/auth.routes';
import { createAuthService } from './modules/auth/auth.service';
import { createUsersRepository } from './modules/users/users.repository';
import { usersRoutes } from './modules/users/users.routes';
import { createUsersService } from './modules/users/users.service';
import { registerAuth } from './plugins/auth';
import { registerErrorHandler, registerNotFoundHandler } from './plugins/error-handler';
import { registerSecurity } from './plugins/security';
import { registerStatic } from './plugins/static';

export interface AppDeps {
  env: Env;
  db: DB;
  generator: AnalysisGenerator | null;
}

/** Composition root: monta dependências e registra módulos. Sem efeitos de rede. */
export async function buildApp({ env, db, generator }: AppDeps): Promise<FastifyInstance> {
  const app = Fastify({
    trustProxy: env.TRUST_PROXY,
    bodyLimit: 32 * 1024,
    logger:
      env.NODE_ENV === 'test'
        ? false
        : {
            level: env.LOG_LEVEL,
            redact: [
              'req.headers.cookie',
              'req.headers.authorization',
              'res.headers["set-cookie"]',
            ],
          },
  });

  const usersRepo = createUsersRepository(db);
  const users = createUsersService(usersRepo);
  const auth = createAuthService(usersRepo);

  const admin = await users.ensureInitialAdmin(env.ADMIN_USERNAME, env.ADMIN_PASSWORD);
  if (admin) app.log.info({ username: admin.username }, 'initial admin created');

  registerErrorHandler(app);
  await registerSecurity(app, env);
  await registerAuth(app, env, auth);

  app.get('/api/health', async () => ({ status: 'ok' }));
  await app.register(authRoutes(auth), { prefix: '/api/auth' });
  await app.register(usersRoutes(users), { prefix: '/api/users' });
  await app.register(analysisRoutes(generator), { prefix: '/api/analysis' });

  const spa = env.WEB_DIST_PATH ? await registerStatic(app, env.WEB_DIST_PATH) : false;
  registerNotFoundHandler(app, { spa });

  return app;
}
