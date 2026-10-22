/** Corpo padrão de erro retornado pela API. */
export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
  };
}
