import type { Metadata } from "next";
import { AccountPaymentsContent } from "@/components/account/account-payments-content";

export const metadata: Metadata = {
  title: "Payment History | Royal Furniture Pro",
};

export default function AccountPaymentsPage() {
  return <AccountPaymentsContent />;
}
