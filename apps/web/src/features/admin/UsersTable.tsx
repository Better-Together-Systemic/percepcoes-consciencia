import type { PublicUser } from '@percepcoes/shared';
import { Alert, Button, Card } from '../../shared/ui';
import { useDeleteUser, useUsers } from './api';
import styles from './admin.module.css';

export function UsersTable({ currentUserId }: { currentUserId: string }) {
  const { data: users, isPending, error } = useUsers();
  const deleteUser = useDeleteUser();

  const onDelete = (user: PublicUser) => {
    if (window.confirm(`Remover ${user.username}?`)) deleteUser.mutate(user.id);
  };

  return (
    <Card title="Usuários cadastrados" accent="blue">
      {error && <Alert>{error.message}</Alert>}
      {deleteUser.error && <Alert>{deleteUser.error.message}</Alert>}
      {isPending ? (
        <p className={styles.muted}>Carregando…</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">Usuário</th>
              <th scope="col">Tipo</th>
              <th scope="col">Criado em</th>
              <th scope="col">
                <span className="visually-hidden">Ações</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {users?.map((u) => (
              <tr key={u.id}>
                <td>{u.username}</td>
                <td>
                  <span
                    className={`${styles.badge} ${u.role === 'admin' ? styles.admin : styles.user}`}
                  >
                    {u.role === 'admin' ? 'admin' : 'aluno'}
                  </span>
                </td>
                <td className={styles.muted}>
                  {new Date(u.createdAt).toLocaleDateString('pt-BR')}
                </td>
                <td className={styles.actions}>
                  {u.role !== 'admin' && u.id !== currentUserId && (
                    <Button
                      size="sm"
                      variant="danger"
                      disabled={deleteUser.isPending}
                      onClick={() => onDelete(u)}
                    >
                      Remover
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Card>
  );
}
