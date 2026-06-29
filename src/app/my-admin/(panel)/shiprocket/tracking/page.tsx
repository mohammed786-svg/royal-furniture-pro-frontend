import { AdminPageShell } from "@/components/admin/pages/admin-page-shell";
import { getAdminPageByKey } from "@/lib/admin/navigation";

export default function ShiprocketTrackingPage() {
  const page = getAdminPageByKey("shiprocket-tracking");
  if (!page) return null;
  return <AdminPageShell page={page} />;
}
