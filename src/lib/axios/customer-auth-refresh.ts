import axios from "axios";
import { assertApiSuccess } from "@/lib/api/api-error";
import type { ApiEnvelope } from "@/lib/api/types";
import {
  decryptPayload,
  encryptPayload,
  isCryptoEnabled,
} from "@/lib/crypto/payload-crypto";
import { env } from "@/lib/env";
import type { VerifyOtpResponse } from "@/types/storefront-commerce";

async function decryptResponseData(data: unknown): Promise<unknown> {
  if (
    !isCryptoEnabled() ||
    !data ||
    typeof data !== "object" ||
    !("payload" in data) ||
    typeof (data as { payload?: unknown }).payload !== "string"
  ) {
    return data;
  }
  return decryptPayload((data as { payload: string }).payload);
}

export async function refreshCustomerAuthSession(
  refreshToken: string,
): Promise<VerifyOtpResponse> {
  const body = isCryptoEnabled()
    ? await encryptPayload({ refreshToken })
    : { refreshToken };

  const { data } = await axios.post<ApiEnvelope<VerifyOtpResponse>>(
    `${env.apiUrl}/storefront/auth/refresh/`,
    body,
    {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(isCryptoEnabled() ? { "X-Payload-Encrypted": "1" } : {}),
      },
    },
  );

  const envelope = (await decryptResponseData(data)) as ApiEnvelope<VerifyOtpResponse>;
  return assertApiSuccess(envelope);
}
