import { AdminPageShell } from "@/components/admin/pages/admin-page-shell";
import { getAdminPageByKey } from "@/lib/admin/navigation";

export default function ReviewsPage() {
  const page = getAdminPageByKey("reviews");
  if (!page) return null;
  return <AdminPageShell page={page} />;
}
