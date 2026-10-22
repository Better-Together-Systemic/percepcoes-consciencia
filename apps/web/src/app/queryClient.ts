import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { sessionKey } from '../features/auth/api';
import { ApiError } from '../shared/api/http';

/** Sessão expirada em qualquer chamada derruba o usuário para o login. */
function handleUnauthorized(error: unknown) {
  if (error instanceof ApiError && error.status === 401) {
    queryClient.setQueryData(sessionKey, null);
  }
}

export const queryClient = new QueryClient({
  queryCache: new QueryCache({ onError: handleUnauthorized }),
  mutationCache: new MutationCache({ onError: handleUnauthorized }),
  defaultOptions: {
    queries: {
      retry: (count, error) => !(error instanceof ApiError && error.status < 500) && count < 2,
      refetchOnWindowFocus: false,
    },
  },
});
