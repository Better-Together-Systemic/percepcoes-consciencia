import { describe, expect, it } from 'vitest';
import { setup } from './helpers';

describe('users (admin)', () => {
  it('admin cria, lista e remove usuários; usuário removido perde a sessão', async () => {
    const { app, login } = await setup();
    const { cookie } = await login();

    const created = await app.inject({
      method: 'POST',
      url: '/api/users',
      headers: { cookie },
      payload: { username: 'Aluno.Um', password: 'senha-segura-1' },
    });
    expect(created.statusCode).toBe(201);
    const user = created.json().user;
    expect(user).toMatchObject({ username: 'aluno.um', role: 'user' });

    const dup = await app.inject({
      method: 'POST',
      url: '/api/users',
      headers: { cookie },
      payload: { username: 'aluno.um', password: 'senha-segura-1' },
    });
    expect(dup.statusCode).toBe(409);

    const studentSession = await login('aluno.um', 'senha-segura-1');
    const list = await app.inject({ url: '/api/users', headers: { cookie } });
    expect(list.json().users).toHaveLength(2);

    const del = await app.inject({
      method: 'DELETE',
      url: `/api/users/${user.id}`,
      headers: { cookie },
    });
    expect(del.statusCode).toBe(204);

    const me = await app.inject({
      url: '/api/auth/me',
      headers: { cookie: studentSession.cookie },
    });
    expect(me.statusCode).toBe(401);
    await app.close();
  });

  it('usuário comum não acessa rotas de admin', async () => {
    const { app, login } = await setup();
    const { cookie } = await login();
    await app.inject({
      method: 'POST',
      url: '/api/users',
      headers: { cookie },
      payload: { username: 'aluno', password: 'senha-segura-1' },
    });
    const student = await login('aluno', 'senha-segura-1');
    const res = await app.inject({ url: '/api/users', headers: { cookie: student.cookie } });
    expect(res.statusCode).toBe(403);
    await app.close();
  });

  it('valida senha mínima', async () => {
    const { app, login } = await setup();
    const { cookie } = await login();
    const res = await app.inject({
      method: 'POST',
      url: '/api/users',
      headers: { cookie },
      payload: { username: 'curta', password: '123' },
    });
    expect(res.statusCode).toBe(400);
    expect(res.json().error.code).toBe('VALIDATION_ERROR');
    await app.close();
  });
});
