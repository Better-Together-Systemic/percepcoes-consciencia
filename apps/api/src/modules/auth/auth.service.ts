import type { LoginRequest, PublicUser } from '@percepcoes/shared';
import { Errors } from '../../lib/errors';
import { hashPassword, verifyPassword } from '../../lib/password';
import type { UsersRepository } from '../users/users.repository';
import { toPublicUser } from '../users/users.service';

export function createAuthService(repo: UsersRepository) {
  // Hash fictício para que logins com usuário inexistente levem o mesmo tempo
  // que logins com senha errada (evita enumeração de usuários por timing).
  const dummyHash = hashPassword('timing-equalizer');

  return {
    async authenticate({ username, password }: LoginRequest): Promise<PublicUser> {
      const user = repo.findByUsername(username.trim().toLowerCase());
      const ok = await verifyPassword(password, user?.passwordHash ?? (await dummyHash));
      if (!user || !ok) throw Errors.unauthorized('Usuário ou senha incorretos.');
      return toPublicUser(user);
    },

    /** Recarrega o usuário da sessão; usuários removidos perdem acesso imediatamente. */
    resolveSessionUser(userId: string): PublicUser {
      const user = repo.findById(userId);
      if (!user) throw Errors.unauthorized();
      return toPublicUser(user);
    },
  };
}

export type AuthService = ReturnType<typeof createAuthService>;
