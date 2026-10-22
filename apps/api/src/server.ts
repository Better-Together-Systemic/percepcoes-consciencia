import { buildApp } from './app';
import { loadEnv } from './config/env';
import { openDatabase } from './db/database';
import { createAnthropicGenerator } from './modules/analysis/anthropic.generator';

const env = loadEnv();
const db = openDatabase(env.DATABASE_PATH);
const generator = env.ANTHROPIC_API_KEY
  ? createAnthropicGenerator({ apiKey: env.ANTHROPIC_API_KEY, model: env.ANTHROPIC_MODEL })
  : null;

const app = await buildApp({ env, db, generator });
if (!generator) app.log.warn('ANTHROPIC_API_KEY ausente: /api/analysis responderá 503');

const shutdown = async (signal: string) => {
  app.log.info({ signal }, 'shutting down');
  await app.close();
  db.close();
  process.exit(0);
};
process.once('SIGINT', () => void shutdown('SIGINT'));
process.once('SIGTERM', () => void shutdown('SIGTERM'));

await app.listen({ host: env.HOST, port: env.PORT });
