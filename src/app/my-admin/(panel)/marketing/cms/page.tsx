import { AdminPageShell } from "@/components/admin/pages/admin-page-shell";
import { getAdminPageByKey } from "@/lib/admin/navigation";

export default function CmsPagesPage() {
  const page = getAdminPageByKey("cms");
  if (!page) return null;
  return <AdminPageShell page={page} />;
}
