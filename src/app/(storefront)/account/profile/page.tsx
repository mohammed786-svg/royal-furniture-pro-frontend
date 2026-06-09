import type { Metadata } from "next";
import { AccountProfileContent } from "@/components/account/account-profile-content";

export const metadata: Metadata = {
  title: "My Profile | Royal Furniture Pro",
};

export default function AccountProfilePage() {
  return <AccountProfileContent />;
}
