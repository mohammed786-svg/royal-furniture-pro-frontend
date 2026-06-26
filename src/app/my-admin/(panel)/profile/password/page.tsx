import { AdminPasswordChange } from "@/components/admin/profile/admin-password-change";
import { AdminProfileLayout } from "@/components/admin/profile/admin-profile-layout";

export default function AdminPasswordPage() {
  return (
    <AdminProfileLayout>
      <AdminPasswordChange />
    </AdminProfileLayout>
  );
}
