import type { Metadata } from "next";
import { AccountSettingsContent } from "@/components/account/account-settings-content";

export const metadata: Metadata = {
  title: "Account Settings | Royal Furniture Pro",
};

export default function AccountSettingsPage() {
  return <AccountSettingsContent />;
}
