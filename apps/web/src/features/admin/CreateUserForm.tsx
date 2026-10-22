import { PASSWORD_MIN_LENGTH } from '@percepcoes/shared';
import { useState, type FormEvent } from 'react';
import { Alert, Button, Card, Field } from '../../shared/ui';
import { useCreateUser } from './api';
import styles from './admin.module.css';

export function CreateUserForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [created, setCreated] = useState<string | null>(null);
  const createUser = useCreateUser();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setCreated(null);
    createUser.mutate(
      { username, password },
      {
        onSuccess: ({ user }) => {
          setCreated(user.username);
          setUsername('');
          setPassword('');
        },
      },
    );
  };

  return (
    <Card title="Adicionar novo usuário" accent="blue">
      <form className={styles.row} onSubmit={onSubmit}>
        <Field
          className={styles.grow}
          label="Usuário"
          hideLabel
          placeholder="usuário"
          autoComplete="off"
          autoCapitalize="none"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Field
          className={styles.grow}
          label="Senha"
          hideLabel
          type="password"
          placeholder={`senha (mín. ${PASSWORD_MIN_LENGTH})`}
          autoComplete="new-password"
          minLength={PASSWORD_MIN_LENGTH}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" size="sm" disabled={createUser.isPending || !username || !password}>
          Adicionar
        </Button>
      </form>
      <div className={styles.feedback}>
        {createUser.error && <Alert>{createUser.error.message}</Alert>}
        {created && <Alert tone="success">Adicionado: {created}</Alert>}
      </div>
    </Card>
  );
}
