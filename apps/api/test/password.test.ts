import { describe, expect, it } from 'vitest';
import { hashPassword, verifyPassword } from '../src/lib/password';

describe('password hashing', () => {
  it('verifica a senha correta e rejeita a incorreta', async () => {
    const hash = await hashPassword('s3nha-forte!');
    expect(hash.startsWith('scrypt$')).toBe(true);
    expect(await verifyPassword('s3nha-forte!', hash)).toBe(true);
    expect(await verifyPassword('outra', hash)).toBe(false);
  });

  it('gera salts diferentes para a mesma senha', async () => {
    expect(await hashPassword('abc12345')).not.toBe(await hashPassword('abc12345'));
  });

  it('rejeita hashes malformados', async () => {
    expect(await verifyPassword('x', 'plaintext')).toBe(false);
  });
});
