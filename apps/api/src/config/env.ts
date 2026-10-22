import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { z } from 'zod';

/**
 * Carrega o .env (do diretório atual ou da raiz do monorepo, já que os scripts
 * de workspace rodam em apps/api). Variáveis já definidas no ambiente têm prioridade.
 */
function loadDotEnv(): void {
  for (const file of [resolve(process.cwd(), '.env'), resolve(process.cwd(), '../../.env')]) {
    if (existsSync(file)) {
      process.loadEnvFile(file);
      return;
    }
  }
}

const booleanFromString = z
  .enum(['true', 'false', '1', '0'])
  .transform((v) => v === 'true' || v === '1');

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  HOST: z.string().default('127.0.0.1'),
  PORT: z.coerce.number().int().positive().default(3333),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  TRUST_PROXY: booleanFromString.default(false),

  /** Origem pública do frontend; usada para validar o header Origin em requisições mutáveis. */
  APP_ORIGIN: z.url().default('http://localhost:5173'),

  DATABASE_PATH: z.string().default('./data/app.db'),

  JWT_SECRET: z.string().min(32, 'JWT_SECRET deve ter ao menos 32 caracteres.'),
  SESSION_TTL_HOURS: z.coerce
    .number()
    .int()
    .positive()
    .max(24 * 30)
    .default(8),

  ANTHROPIC_API_KEY: z.string().min(1).optional(),
  ANTHROPIC_MODEL: z.string().default('claude-opus-5-5'),

  /** Cria o admin inicial no boot se ainda não existir nenhum admin. */
  ADMIN_USERNAME: z.string().optional(),
  ADMIN_PASSWORD: z.string().optional(),

  /** Pasta com o build do frontend; quando definida, a API também serve o SPA. */
  WEB_DIST_PATH: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

export function loadEnv(source: NodeJS.ProcessEnv = process.env): Env {
  if (source === process.env) loadDotEnv();
  // Linhas como `CHAVE=` no .env chegam como string vazia; tratamos como não definidas.
  const defined = Object.fromEntries(Object.entries(source).filter(([, v]) => v !== ''));
  const parsed = envSchema.safeParse(defined);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `  - ${i.path.join('.')}: ${i.message}`);
    throw new Error(`Configuração inválida:\n${issues.join('\n')}`);
  }
  return parsed.data;
}
