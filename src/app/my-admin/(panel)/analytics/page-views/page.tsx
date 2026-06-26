import { AdminPageShell } from "@/components/admin/pages/admin-page-shell";
import { getAdminPageByKey } from "@/lib/admin/navigation";

export default function PageViewsAnalyticsRoute() {
  const page = getAdminPageByKey("page-views");
  if (!page) return null;
  return <AdminPageShell page={page} />;
}
