import { AdminPageShell } from "@/components/admin/pages/admin-page-shell";
import { getAdminPageByKey } from "@/lib/admin/navigation";

export default function TransfersPage() {
  const page = getAdminPageByKey("transfers");
  if (!page) return null;
  return <AdminPageShell page={page} />;
}
