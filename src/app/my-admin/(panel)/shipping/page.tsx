import { AdminPageShell } from "@/components/admin/pages/admin-page-shell";
import { getAdminPageByKey } from "@/lib/admin/navigation";

export default function ShipmentsPage() {
  const page = getAdminPageByKey("shipments");
  if (!page) return null;
  return <AdminPageShell page={page} />;
}
