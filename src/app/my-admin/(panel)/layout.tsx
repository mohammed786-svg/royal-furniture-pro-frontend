import { AdminShell } from "@/components/admin/layout/admin-shell";

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
