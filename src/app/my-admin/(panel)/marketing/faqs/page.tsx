import { AdminPageShell } from "@/components/admin/pages/admin-page-shell";
import { getAdminPageByKey } from "@/lib/admin/navigation";

export default function FaqsPage() {
  const page = getAdminPageByKey("faqs");
  if (!page) return null;
  return <AdminPageShell page={page} />;
}
