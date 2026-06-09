import { AdminPageShell } from "@/components/admin/pages/admin-page-shell";
import { getAdminPageByKey } from "@/lib/admin/navigation";

export default function ReturnsPage() {
  const page = getAdminPageByKey("returns");
  if (!page) return null;
  return <AdminPageShell page={page} />;
}
