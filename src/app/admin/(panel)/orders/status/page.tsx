import { AdminPageShell } from "@/components/admin/pages/admin-page-shell";
import { getAdminPageByKey } from "@/lib/admin/navigation";

export default function OrderStatusPage() {
  const page = getAdminPageByKey("order-status");
  if (!page) return null;
  return <AdminPageShell page={page} />;
}
