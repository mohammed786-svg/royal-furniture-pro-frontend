import { AdminPageShell } from "@/components/admin/pages/admin-page-shell";
import { getAdminPageByKey } from "@/lib/admin/navigation";

export default function WarehousesPage() {
  const page = getAdminPageByKey("warehouses");
  if (!page) return null;
  return <AdminPageShell page={page} />;
}
