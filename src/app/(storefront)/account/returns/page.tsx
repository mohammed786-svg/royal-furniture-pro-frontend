import type { Metadata } from "next";
import { AccountReturnsContent } from "@/components/account/account-returns-content";

export const metadata: Metadata = {
  title: "Returns & Refunds | Royal Furniture Pro",
};

export default function AccountReturnsPage() {
  return <AccountReturnsContent />;
}
