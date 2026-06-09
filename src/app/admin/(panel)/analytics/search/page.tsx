import { AdminPageShell } from "@/components/admin/pages/admin-page-shell";
import { getAdminPageByKey } from "@/lib/admin/navigation";

export default function SearchAnalyticsRoute() {
  const page = getAdminPageByKey("search-reports");
  if (!page) return null;
  return <AdminPageShell page={page} />;
}
