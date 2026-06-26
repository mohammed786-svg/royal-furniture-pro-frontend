"use client";

import { use } from "react";
import { WalletDetailPage } from "@/components/admin/customers/wallet-detail-page";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function WalletDetailRoute({ params }: PageProps) {
  const { id } = use(params);
  return <WalletDetailPage walletId={id} />;
}
