import { AdminProfileLayout } from "@/components/admin/profile/admin-profile-layout";
import { AdminProfileSettings } from "@/components/admin/profile/admin-profile-settings";

export default function AdminProfilePage() {
  return (
    <AdminProfileLayout>
      <AdminProfileSettings />
    </AdminProfileLayout>
  );
}
