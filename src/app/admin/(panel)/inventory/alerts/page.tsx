import { AdminPageShell } from "@/components/admin/pages/admin-page-shell";
import { getAdminPageByKey } from "@/lib/admin/navigation";

export default function AlertsPage() {
  const page = getAdminPageByKey("alerts");
  if (!page) return null;
  return <AdminPageShell page={page} />;
}
