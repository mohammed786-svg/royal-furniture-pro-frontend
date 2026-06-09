import { isAxiosError } from "axios";
import type { ApiEnvelope, ApiFieldError } from "@/lib/api/types";

export class ApiError extends Error {
  readonly statusCode: number;
  readonly errors: ApiFieldError[];
  readonly endpoint: string;

  constructor(envelope: ApiEnvelope) {
    super(envelope.message || "Request failed");
    this.name = "ApiError";
    this.statusCode = envelope.statusCode;
    this.errors = envelope.errors ?? [];
    this.endpoint = envelope.endpoint;
  }

  getFieldError(field: string): string | undefined {
    return this.errors.find((error) => error.field === field)?.message;
  }
}

export function isApiEnvelope(value: unknown): value is ApiEnvelope {
  if (!value || typeof value !== "object") {
    return false;
  }
  const envelope = value as Partial<ApiEnvelope>;
  return (
    typeof envelope.success === "boolean" &&
    typeof envelope.statusCode === "number" &&
    typeof envelope.message === "string" &&
    "data" in envelope &&
    "endpoint" in envelope
  );
}

export function assertApiSuccess<T>(envelope: ApiEnvelope<T>): T {
  if (!envelope.success) {
    throw new ApiError(envelope);
  }
  return envelope.data as T;
}

export function getApiErrorMessage(
  error: unknown,
  fallback = "Request failed",
): string {
  if (error instanceof ApiError) {
    if (error.errors.length > 0) {
      return error.errors.map((item) => item.message).join(". ");
    }
    return error.message;
  }

  if (isAxiosError(error)) {
    const data = error.response?.data;
    if (isApiEnvelope(data)) {
      return getApiErrorMessage(new ApiError(data), fallback);
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export function getApiFieldErrors(error: unknown): ApiFieldError[] {
  if (error instanceof ApiError) {
    return error.errors;
  }

  if (isAxiosError(error)) {
    const data = error.response?.data;
    if (isApiEnvelope(data)) {
      return data.errors ?? [];
    }
  }

  return [];
}
