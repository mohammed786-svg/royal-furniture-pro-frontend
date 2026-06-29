import { AdminPageShell } from "@/components/admin/pages/admin-page-shell";
import { getAdminPageByKey } from "@/lib/admin/navigation";

export default function ShiprocketOrdersPage() {
  const page = getAdminPageByKey("shiprocket-orders");
  if (!page) return null;
  return <AdminPageShell page={page} />;
}
