import { useSession } from '../auth/api';
import { CreateUserForm } from './CreateUserForm';
import { UsersTable } from './UsersTable';
import styles from './admin.module.css';

export default function AdminPage() {
  const { data: user } = useSession();
  return (
    <main className={styles.page}>
      <h1 className={styles.heading}>
        Painel <em>Admin</em>
      </h1>
      <CreateUserForm />
      {user && <UsersTable currentUserId={user.id} />}
    </main>
  );
}
