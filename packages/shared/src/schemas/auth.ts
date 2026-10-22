import { z } from 'zod';

export const ROLES = ['admin', 'user'] as const;
export type Role = (typeof ROLES)[number];

export const loginRequestSchema = z.object({
  username: z.string().trim().min(1, 'Informe o usuário.').max(64),
  password: z.string().min(1, 'Informe a senha.').max(256),
});
export type LoginRequest = z.infer<typeof loginRequestSchema>;

/** Representação de usuário exposta pela API — nunca inclui hash de senha. */
export const publicUserSchema = z.object({
  id: z.string(),
  username: z.string(),
  role: z.enum(ROLES),
  createdAt: z.string(),
});
export type PublicUser = z.infer<typeof publicUserSchema>;
