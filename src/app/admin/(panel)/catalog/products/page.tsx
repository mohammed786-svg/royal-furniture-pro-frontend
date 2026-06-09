import { AdminPageShell } from "@/components/admin/pages/admin-page-shell";
import { getAdminPageByKey } from "@/lib/admin/navigation";

export default function ProductsListPage() {
  const page = getAdminPageByKey("products");
  if (!page) return null;
  return <AdminPageShell page={page} />;
}
