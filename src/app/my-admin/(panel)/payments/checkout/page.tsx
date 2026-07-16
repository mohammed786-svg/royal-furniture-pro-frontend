import { AdminPageShell } from "@/components/admin/pages/admin-page-shell";
import { getAdminPageByKey } from "@/lib/admin/navigation";

export default function CheckoutPaymentSettingsRoute() {
  const page = getAdminPageByKey("payment-checkout");
  if (!page) return null;
  return <AdminPageShell page={page} />;
}
