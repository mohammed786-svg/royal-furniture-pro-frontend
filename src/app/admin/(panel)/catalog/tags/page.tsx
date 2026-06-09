import { AdminPageShell } from "@/components/admin/pages/admin-page-shell";
import { getAdminPageByKey } from "@/lib/admin/navigation";

export default function TagsPage() {
  const page = getAdminPageByKey("tags");
  if (!page) return null;
  return <AdminPageShell page={page} />;
}
