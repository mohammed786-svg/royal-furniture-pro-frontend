import { AdminPageShell } from "@/components/admin/pages/admin-page-shell";
import { getAdminPageByKey } from "@/lib/admin/navigation";

export default function PaymentsPage() {
  const page = getAdminPageByKey("payments");
  if (!page) return null;
  return <AdminPageShell page={page} />;
}
