/**
 * Single source of truth for public media URLs.
 *
 * Set NEXT_PUBLIC_MEDIA_BASE_URL in .env (no trailing slash), e.g.
 *   https://royalfurniturepro.azdeploy.com
 * Later domain change (e.g. https://royalfurniturepro.in) — update env only.
 *
 * Resolved URL pattern: {baseUrl}/media/{file}
 * DB paths may be stored as `/media/...` or `media/...` or `/products/...`.
 */

function stripTrailingSlash(value: string): string {
  return value.replace(/\/$/, "");
}

function readMediaBaseUrl(): string {
  const fromEnv =
    process.env.NEXT_PUBLIC_MEDIA_BASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    "";
  return stripTrailingSlash(fromEnv);
}

export const mediaConfig = {
  /** Site origin used to prefix relative media paths */
  baseUrl: readMediaBaseUrl(),
  /** Nginx/media mount path segment */
  mediaPrefix: "/media",
} as const;

/** Paths served from Next.js `public/` — not Django `/media/` uploads. */
function isStaticPublicAssetPath(path: string): boolean {
  return (
    path.startsWith("/images/") ||
    path.startsWith("/logos/") ||
    path.startsWith("/payment/")
  );
}

export function getMediaBaseUrl(): string {
  return mediaConfig.baseUrl;
}

/** Build absolute media URL from a DB-relative path. */
export function buildMediaUrl(path?: string | null): string | null {
  if (path == null) return null;
  const trimmed = String(path).trim();
  if (
    !trimmed ||
    ["na", "n/a", "null", "undefined", "none"].includes(trimmed.toLowerCase())
  ) {
    return null;
  }
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:")
  ) {
    return trimmed;
  }

  let normalized = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;

  if (isStaticPublicAssetPath(normalized)) {
    return normalized;
  }

  if (!normalized.startsWith("/media/")) {
    normalized = `${mediaConfig.mediaPrefix}${normalized.startsWith("/") ? normalized : `/${normalized}`}`;
  }

  if (!mediaConfig.baseUrl) {
    return normalized;
  }

  return `${mediaConfig.baseUrl}${normalized}`;
}
