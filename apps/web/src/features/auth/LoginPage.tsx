import { useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Alert, Brand, Button, Field, Spinner } from '../../shared/ui';
import { useLogin } from './api';
import styles from './LoginPage.module.css';

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const login = useLogin();
  const navigate = useNavigate();
  const from = (useLocation().state as { from?: string } | null)?.from ?? '/';

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    login.mutate(
      { username, password },
      {
        onSuccess: () => navigate(from, { replace: true }),
        onError: () => setPassword(''),
      },
    );
  };

  return (
    <main className={styles.page}>
      <form className={styles.box} onSubmit={onSubmit} noValidate>
        <Brand size="md" />
        <div className={styles.fields}>
          <Field
            label="Usuário"
            placeholder="seu usuário"
            autoComplete="username"
            autoCapitalize="none"
            autoFocus
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Field
            label="Senha"
            type="password"
            placeholder="sua senha"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className={styles.error}>{login.error && <Alert>{login.error.message}</Alert>}</div>
        <Button type="submit" block disabled={login.isPending || !username || !password}>
          {login.isPending && <Spinner />}
          Entrar
        </Button>
      </form>
    </main>
  );
}
