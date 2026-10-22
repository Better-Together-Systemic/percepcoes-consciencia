import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import Database from 'better-sqlite3';

export type DB = Database.Database;

const MIGRATIONS: readonly string[] = [
  `CREATE TABLE users (
     id            TEXT PRIMARY KEY,
     username      TEXT NOT NULL UNIQUE COLLATE NOCASE,
     password_hash TEXT NOT NULL,
     role          TEXT NOT NULL CHECK (role IN ('admin', 'user')),
     created_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
   );`,
];

export function openDatabase(path: string): DB {
  if (path !== ':memory:') mkdirSync(dirname(path), { recursive: true });
  const db = new Database(path);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  migrate(db);
  return db;
}

/** Migrações sequenciais controladas por `PRAGMA user_version`. */
function migrate(db: DB): void {
  const current = db.pragma('user_version', { simple: true }) as number;
  const pending = MIGRATIONS.slice(current);
  if (pending.length === 0) return;
  db.transaction(() => {
    pending.forEach((sql) => db.exec(sql));
    db.pragma(`user_version = ${MIGRATIONS.length}`);
  })();
}
