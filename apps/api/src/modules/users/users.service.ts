import type { CreateUserRequest, PublicUser, Role } from '@percepcoes/shared';
import { Errors } from '../../lib/errors';
import { hashPassword } from '../../lib/password';
import type { UserRecord, UsersRepository } from './users.repository';

export const toPublicUser = ({ passwordHash: _omit, ...user }: UserRecord): PublicUser => user;

export function createUsersService(repo: UsersRepository) {
  async function create(input: CreateUserRequest, role: Role = 'user'): Promise<PublicUser> {
    if (repo.findByUsername(input.username)) throw Errors.conflict('Usuário já existe.');
    const hash = await hashPassword(input.password);
    return toPublicUser(repo.create(input.username, hash, role));
  }

  return {
    list: (): PublicUser[] => repo.list().map(toPublicUser),

    create,

    remove(id: string, actorId: string): void {
      const target = repo.findById(id);
      if (!target) throw Errors.notFound('Usuário não encontrado.');
      if (target.id === actorId) throw Errors.badRequest('Você não pode remover a si mesmo.');
      if (target.role === 'admin')
        throw Errors.forbidden('Administradores não podem ser removidos.');
      repo.delete(id);
    },

    /** Cria o admin inicial a partir do ambiente, apenas se não houver nenhum admin. */
    async ensureInitialAdmin(username?: string, password?: string): Promise<PublicUser | null> {
      if (repo.countAdmins() > 0 || !username || !password) return null;
      return create({ username: username.trim().toLowerCase(), password }, 'admin');
    },
  };
}

export type UsersService = ReturnType<typeof createUsersService>;
