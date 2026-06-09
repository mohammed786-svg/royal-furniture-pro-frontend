import type { Metadata } from "next";
import { AccountDashboardContent } from "@/components/account/account-dashboard-content";

export const metadata: Metadata = {
  title: "My Account | Royal Furniture Pro",
  description: "Your Royal Furniture Pro account dashboard",
};

export default function AccountPage() {
  return <AccountDashboardContent />;
}
