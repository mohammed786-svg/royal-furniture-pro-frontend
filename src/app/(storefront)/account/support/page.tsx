import type { Metadata } from "next";
import { AccountSupportContent } from "@/components/account/account-support-content";

export const metadata: Metadata = {
  title: "Help & Support | Royal Furniture Pro",
};

export default function AccountSupportPage() {
  return <AccountSupportContent />;
}
