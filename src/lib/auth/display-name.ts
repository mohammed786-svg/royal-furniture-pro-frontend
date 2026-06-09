/** First name (or first word) for header — max 14 chars */
export function accountDisplayName(fullName: string): string {
  const trimmed = fullName.trim();
  if (!trimmed) return "Account";
  const first = trimmed.split(/\s+/)[0] ?? trimmed;
  if (first.length <= 14) return first;
  return `${first.slice(0, 13)}…`;
}
