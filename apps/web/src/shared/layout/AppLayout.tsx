import { Link, Outlet, useLocation, useNavigate } from 'react-router';
import { useLogout, useSession } from '../../features/auth/api';
import { Button } from '../ui';
import styles from './AppLayout.module.css';

export function AppLayout() {
  const { data: user } = useSession();
  const logout = useLogout();
  const navigate = useNavigate();
  const onAdmin = useLocation().pathname.startsWith('/admin');

  return (
    <div className={styles.shell}>
      <header className={styles.topBar}>
        <span className={styles.greeting}>
          Olá, <strong>{user?.username}</strong>
        </span>
        <nav className={styles.actions}>
          {user?.role === 'admin' &&
            (onAdmin ? (
              <Link to="/" className={styles.link}>
                Voltar
              </Link>
            ) : (
              <Link to="/admin" className={styles.link}>
                Admin
              </Link>
            ))}
          <Button
            size="sm"
            onClick={() =>
              logout.mutate(undefined, { onSettled: () => navigate('/login', { replace: true }) })
            }
          >
            Sair
          </Button>
        </nav>
      </header>
      <Outlet />
    </div>
  );
}
