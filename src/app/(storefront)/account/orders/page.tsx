import type { Metadata } from "next";
import { AccountOrdersContent } from "@/components/account/account-orders-content";

export const metadata: Metadata = {
  title: "My Orders | Royal Furniture Pro",
};

export default function AccountOrdersPage() {
  return <AccountOrdersContent />;
}
