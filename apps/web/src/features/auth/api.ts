import type { LoginRequest, PublicUser } from '@percepcoes/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiError, http } from '../../shared/api/http';

export const sessionKey = ['session'] as const;

async function fetchSession(): Promise<PublicUser | null> {
  try {
    return (await http.get<{ user: PublicUser }>('/auth/me')).user;
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) return null;
    throw err;
  }
}

export function useSession() {
  return useQuery({ queryKey: sessionKey, queryFn: fetchSession, staleTime: 5 * 60_000 });
}

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: LoginRequest) => http.post<{ user: PublicUser }>('/auth/login', body),
    onSuccess: ({ user }) => qc.setQueryData(sessionKey, user),
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => http.post<void>('/auth/logout'),
    onSettled: () => {
      // Limpa todo o cache: nenhum dado do usuário anterior sobrevive ao logout.
      qc.clear();
      qc.setQueryData(sessionKey, null);
    },
  });
}
