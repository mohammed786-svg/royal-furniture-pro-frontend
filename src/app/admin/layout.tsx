import type { Metadata } from "next";
import { AdminAuthInitializer } from "@/components/admin/auth/admin-auth-initializer";
import "@/styles/themes/admin-dashboard.css";

export const metadata: Metadata = {
  title: {
    default: "Admin — Royal Furniture Pro",
    template: "%s — Royal Furniture Pro Admin",
  },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdminAuthInitializer />
      {children}
    </>
  );
}
