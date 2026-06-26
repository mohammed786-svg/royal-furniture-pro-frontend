import { z } from "zod";
import { getMediaBaseUrl } from "@/config/media.config";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production", "staging"])
    .default("development"),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NEXT_PUBLIC_API_URL: z.string().url().optional(),
  NEXT_PUBLIC_WS_URL: z.string().url().optional(),
  NEXT_PUBLIC_CDN_URL: z.string().url().optional(),
  NEXT_PUBLIC_IMAGE_URL: z.string().url().optional(),
  NEXT_PUBLIC_MEDIA_BASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_GA_ID: z.string().optional(),
  NEXT_PUBLIC_GTM_ID: z.string().optional(),
  NEXT_PUBLIC_API_CRYPTO_KEY: z.string().optional(),
});

export type AppEnv = z.infer<typeof envSchema>;

/**
 * Validated environment variables (client-safe keys only).
 * Extend when implementing features.
 */
export function getClientEnv(): AppEnv {
  return envSchema.parse({
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL,
    NEXT_PUBLIC_CDN_URL: process.env.NEXT_PUBLIC_CDN_URL,
    NEXT_PUBLIC_IMAGE_URL: process.env.NEXT_PUBLIC_IMAGE_URL,
    NEXT_PUBLIC_MEDIA_BASE_URL: process.env.NEXT_PUBLIC_MEDIA_BASE_URL,
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
    NEXT_PUBLIC_GTM_ID: process.env.NEXT_PUBLIC_GTM_ID,
    NEXT_PUBLIC_API_CRYPTO_KEY: process.env.NEXT_PUBLIC_API_CRYPTO_KEY,
  });
}

export const env = {
  isDev: process.env.NODE_ENV === "development",
  isProd: process.env.NODE_ENV === "production",
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "",
  wsUrl: process.env.NEXT_PUBLIC_WS_URL ?? "",
  /** @deprecated Prefer getMediaBaseUrl() / resolveMediaUrl() */
  cdnUrl: process.env.NEXT_PUBLIC_CDN_URL ?? getMediaBaseUrl(),
  imageUrl: process.env.NEXT_PUBLIC_IMAGE_URL ?? getMediaBaseUrl(),
  mediaBaseUrl: getMediaBaseUrl(),
  cryptoKey: process.env.NEXT_PUBLIC_API_CRYPTO_KEY ?? "",
} as const;
