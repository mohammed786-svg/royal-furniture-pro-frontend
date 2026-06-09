export type ApiFieldError = {
  field: string;
  message: string;
};

export type ApiEnvelope<T = unknown> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
  errors: ApiFieldError[] | null;
  endpoint: string;
};

export type EncryptedApiEnvelope = {
  payload: string;
};
