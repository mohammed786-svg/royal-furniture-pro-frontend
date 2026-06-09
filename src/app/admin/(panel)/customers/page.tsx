import { AdminPageShell } from "@/components/admin/pages/admin-page-shell";
import { getAdminPageByKey } from "@/lib/admin/navigation";

export default function CustomersPage() {
  const page = getAdminPageByKey("customers");
  if (!page) return null;
  return <AdminPageShell page={page} />;
}
