import { AdminPageShell } from "@/components/admin/pages/admin-page-shell";
import { getAdminPageByKey } from "@/lib/admin/navigation";

export default function StockPage() {
  const page = getAdminPageByKey("stock");
  if (!page) return null;
  return <AdminPageShell page={page} />;
}
