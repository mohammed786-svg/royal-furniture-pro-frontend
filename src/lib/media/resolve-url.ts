import { env } from "@/lib/env";

export function resolveMediaUrl(url?: string | null): string | null {
  if (!url) return null;
  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("data:")
  ) {
    return url;
  }
  const base = env.cdnUrl || env.apiUrl.replace("/api/v1", "");
  return `${base.replace(/\/$/, "")}${url.startsWith("/") ? url : `/${url}`}`;
}
