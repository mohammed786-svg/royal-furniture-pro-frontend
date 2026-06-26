import { AdminPageShell } from "@/components/admin/pages/admin-page-shell";
import { getAdminPageByKey } from "@/lib/admin/navigation";

export default function SalesAnalyticsRoute() {
  const page = getAdminPageByKey("sales-analytics");
  if (!page) return null;
  return <AdminPageShell page={page} />;
}
