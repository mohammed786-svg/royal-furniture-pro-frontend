import { env } from "@/lib/env";

/** Django Channels admin order notifications (`ws/admin/`). */
export function getAdminOrderWsUrl(): string {
  const base = (env.wsUrl || "").replace(/\/$/, "");
  if (!base) return "";
  if (base.endsWith("/admin")) return `${base}/`;
  return `${base}/admin/`;
}
