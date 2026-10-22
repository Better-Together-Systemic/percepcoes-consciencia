import { randomUUID } from 'node:crypto';
import type { PublicUser, Role } from '@percepcoes/shared';
import type { DB } from '../../db/database';

export interface UserRecord extends PublicUser {
  passwordHash: string;
}

interface UserRow {
  id: string;
  username: string;
  password_hash: string;
  role: Role;
  created_at: string;
}

const toRecord = (row: UserRow): UserRecord => ({
  id: row.id,
  username: row.username,
  role: row.role,
  createdAt: row.created_at,
  passwordHash: row.password_hash,
});

export function createUsersRepository(db: DB) {
  const byId = db.prepare<[string], UserRow>('SELECT * FROM users WHERE id = ?');
  const byUsername = db.prepare<[string], UserRow>('SELECT * FROM users WHERE username = ?');
  const all = db.prepare<[], UserRow>('SELECT * FROM users ORDER BY role, username');
  const countAdmins = db.prepare<[], { n: number }>(
    "SELECT COUNT(*) AS n FROM users WHERE role = 'admin'",
  );
  const insert = db.prepare<[string, string, string, Role]>(
    'INSERT INTO users (id, username, password_hash, role) VALUES (?, ?, ?, ?)',
  );
  const remove = db.prepare<[string]>('DELETE FROM users WHERE id = ?');

  return {
    findById: (id: string) => {
      const row = byId.get(id);
      return row ? toRecord(row) : undefined;
    },
    findByUsername: (username: string) => {
      const row = byUsername.get(username);
      return row ? toRecord(row) : undefined;
    },
    list: () => all.all().map(toRecord),
    countAdmins: () => countAdmins.get()?.n ?? 0,
    create: (username: string, passwordHash: string, role: Role): UserRecord => {
      const id = randomUUID();
      insert.run(id, username, passwordHash, role);
      return toRecord(byId.get(id)!);
    },
    delete: (id: string) => remove.run(id).changes > 0,
  };
}

export type UsersRepository = ReturnType<typeof createUsersRepository>;
