import { AdminPageShell } from "@/components/admin/pages/admin-page-shell";
import { getAdminPageByKey } from "@/lib/admin/navigation";

export default function OrderTrackingPage() {
  const page = getAdminPageByKey("tracking");
  if (!page) return null;
  return <AdminPageShell page={page} />;
}
