import { z } from 'zod';
import { PASSWORD_MIN_LENGTH } from '../constants';

export const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, 'Usuário deve ter ao menos 3 caracteres.')
  .max(64)
  .regex(/^[a-z0-9._-]+$/, 'Use apenas letras, números, ponto, hífen ou sublinhado.');

export const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, `Senha deve ter ao menos ${PASSWORD_MIN_LENGTH} caracteres.`)
  .max(256);

export const createUserRequestSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
});
export type CreateUserRequest = z.infer<typeof createUserRequestSchema>;
