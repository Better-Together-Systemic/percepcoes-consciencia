import { describe, expect, it } from 'vitest';
import { fakeResult, setup } from './helpers';

describe('analysis', () => {
  it('exige autenticação', async () => {
    const { app } = await setup();
    const res = await app.inject({
      method: 'POST',
      url: '/api/analysis',
      payload: { situacao: 'x'.repeat(20) },
    });
    expect(res.statusCode).toBe(401);
    await app.close();
  });

  it('valida a entrada e retorna o resultado do gerador', async () => {
    const { app, login } = await setup();
    const { cookie } = await login();

    const invalid = await app.inject({
      method: 'POST',
      url: '/api/analysis',
      headers: { cookie },
      payload: { situacao: 'curto', linguagens: ['inexistente'] },
    });
    expect(invalid.statusCode).toBe(400);

    const ok = await app.inject({
      method: 'POST',
      url: '/api/analysis',
      headers: { cookie },
      payload: { situacao: 'Pai ausente durante toda a infância', linguagens: ['palavras'] },
    });
    expect(ok.statusCode).toBe(200);
    expect(ok.json().result).toEqual(fakeResult);
    await app.close();
  });

  it('responde 503 quando a IA não está configurada', async () => {
    const { app, login } = await setup(null);
    const { cookie } = await login();
    const res = await app.inject({
      method: 'POST',
      url: '/api/analysis',
      headers: { cookie },
      payload: { situacao: 'Pai ausente durante toda a infância' },
    });
    expect(res.statusCode).toBe(503);
    await app.close();
  });
});
