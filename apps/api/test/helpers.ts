import type { AnalysisResult } from '@percepcoes/shared';
import { buildApp } from '../src/app';
import { loadEnv } from '../src/config/env';
import { openDatabase } from '../src/db/database';
import type { AnalysisGenerator } from '../src/modules/analysis/analysis.generator';

export const ADMIN = { username: 'admin', password: 'admin-password-123' };
export const ORIGIN = 'http://localhost:5173';

export const fakeResult: AnalysisResult = {
  dinamica: 'Lealdade invisível',
  reflexao: 'Reflexão de teste.',
  lei: 'Pertencimento',
  feridas: ['Abandono'],
  origem: 'Feridas de Pertencimento',
  investigacao: [{ tema: 't', subtema: 's', pergunta: 'p' }],
  categorias: [{ nome: 'c', frases: [{ texto: 'f', especialista: 'e', contexto: 'x' }] }],
  exercicios: [{ titulo: 't', descricao: 'd', intencao: 'i', sensorial: false }],
};

export async function setup(
  generator: AnalysisGenerator | null = { generate: async () => fakeResult },
  envOverrides: Record<string, string> = {},
) {
  const env = loadEnv({
    NODE_ENV: 'test',
    JWT_SECRET: 'x'.repeat(48),
    APP_ORIGIN: ORIGIN,
    DATABASE_PATH: ':memory:',
    ADMIN_USERNAME: ADMIN.username,
    ADMIN_PASSWORD: ADMIN.password,
    ...envOverrides,
  });
  const db = openDatabase(':memory:');
  const app = await buildApp({ env, db, generator });

  async function login(username = ADMIN.username, password = ADMIN.password) {
    const res = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { username, password },
    });
    const cookie = res.cookies.find((c) => c.name === 'pc_session');
    return { res, cookie: cookie ? `${cookie.name}=${cookie.value}` : '' };
  }

  return { app, db, login };
}
