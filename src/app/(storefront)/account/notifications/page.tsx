import type { Metadata } from "next";
import { AccountNotificationsContent } from "@/components/account/account-notifications-content";

export const metadata: Metadata = {
  title: "Notifications | Royal Furniture Pro",
};

export default function AccountNotificationsPage() {
  return <AccountNotificationsContent />;
}
