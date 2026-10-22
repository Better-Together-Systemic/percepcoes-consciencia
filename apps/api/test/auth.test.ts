import { describe, expect, it } from 'vitest';
import { ADMIN, ORIGIN, setup } from './helpers';

describe('auth', () => {
  it('faz login e emite cookie httpOnly SameSite=Strict', async () => {
    const { app, login } = await setup();
    const { res } = await login();
    expect(res.statusCode).toBe(200);
    expect(res.json().user).toMatchObject({ username: ADMIN.username, role: 'admin' });
    expect(res.json().user.passwordHash).toBeUndefined();
    const cookie = res.cookies.find((c) => c.name === 'pc_session');
    expect(cookie?.httpOnly).toBe(true);
    expect(cookie?.sameSite).toBe('Strict');
    await app.close();
  });

  it('rejeita credenciais inválidas sem revelar se o usuário existe', async () => {
    const { app, login } = await setup();
    const wrongPass = await login(ADMIN.username, 'errada');
    const noUser = await login('ninguem', 'errada');
    expect(wrongPass.res.statusCode).toBe(401);
    expect(noUser.res.json()).toEqual(wrongPass.res.json());
    await app.close();
  });

  it('protege /me sem sessão e aceita com sessão', async () => {
    const { app, login } = await setup();
    expect((await app.inject({ url: '/api/auth/me' })).statusCode).toBe(401);
    const { cookie } = await login();
    const me = await app.inject({ url: '/api/auth/me', headers: { cookie } });
    expect(me.json().user.username).toBe(ADMIN.username);
    await app.close();
  });

  it('bloqueia requisições mutáveis vindas de outra origem', async () => {
    const { app } = await setup();
    const res = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      headers: { origin: 'https://evil.example' },
      payload: ADMIN,
    });
    expect(res.statusCode).toBe(403);
    const ok = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      headers: { origin: ORIGIN },
      payload: ADMIN,
    });
    expect(ok.statusCode).toBe(200);
    await app.close();
  });

  it('aplica rate limit no login', async () => {
    const { app, login } = await setup();
    for (let i = 0; i < 5; i++) await login('x', 'y');
    expect((await login('x', 'y')).res.statusCode).toBe(429);
    await app.close();
  });
});
