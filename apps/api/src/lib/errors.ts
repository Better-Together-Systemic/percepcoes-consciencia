/** Erro de domínio com status HTTP e código estável para o cliente. */
export class AppError extends Error {
  constructor(
    readonly statusCode: number,
    readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const Errors = {
  badRequest: (message: string, code = 'BAD_REQUEST') => new AppError(400, code, message),
  unauthorized: (message = 'Sessão inválida ou expirada.') =>
    new AppError(401, 'UNAUTHORIZED', message),
  forbidden: (message = 'Acesso negado.') => new AppError(403, 'FORBIDDEN', message),
  notFound: (message = 'Recurso não encontrado.') => new AppError(404, 'NOT_FOUND', message),
  conflict: (message: string) => new AppError(409, 'CONFLICT', message),
  unavailable: (message: string, code = 'SERVICE_UNAVAILABLE') => new AppError(503, code, message),
  upstream: (message: string, code = 'UPSTREAM_ERROR') => new AppError(502, code, message),
};
