/** Display all API datetimes in India Standard Time. */
export const APP_TIME_ZONE = "Asia/Kolkata";

export function parseApiDateTime(value?: string | null): Date | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const date = new Date(`${trimmed}T00:00:00+05:30`);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const hasOffset = /[zZ]$/.test(trimmed) || /[+-]\d{2}:\d{2}$/.test(trimmed);
  const normalized = trimmed.includes("T") ? trimmed : trimmed.replace(" ", "T");

  // Naive API values from PostgreSQL are UTC; convert to instant, then format in IST.
  const date = new Date(hasOffset ? normalized : `${normalized}Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

type FormatDateOptions = {
  dateOnly?: boolean;
  fallback?: string;
};

export function formatApiDateTime(
  value?: string | null,
  options: FormatDateOptions = {},
): string {
  const { dateOnly = false, fallback = "—" } = options;
  const date = parseApiDateTime(value);
  if (!date) return value?.trim() || fallback;

  if (dateOnly) {
    return date.toLocaleDateString("en-IN", {
      timeZone: APP_TIME_ZONE,
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  return date.toLocaleString("en-IN", {
    timeZone: APP_TIME_ZONE,
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
