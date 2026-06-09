import type { Metadata } from "next";
import { AccountAddressesContent } from "@/components/account/account-addresses-content";

export const metadata: Metadata = {
  title: "Saved Addresses | Royal Furniture Pro",
};

export default function AccountAddressesPage() {
  return <AccountAddressesContent />;
}
