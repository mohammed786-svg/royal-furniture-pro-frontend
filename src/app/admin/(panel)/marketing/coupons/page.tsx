import { AdminPageShell } from "@/components/admin/pages/admin-page-shell";
import { getAdminPageByKey } from "@/lib/admin/navigation";

export default function CouponsPage() {
  const page = getAdminPageByKey("coupons");
  if (!page) return null;
  return <AdminPageShell page={page} />;
}
