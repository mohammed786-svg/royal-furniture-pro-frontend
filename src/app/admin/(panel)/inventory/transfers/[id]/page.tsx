"use client";

import { use } from "react";
import { TransferFormPage } from "@/components/admin/inventory/transfer-form-page";

export default function ViewTransferPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <TransferFormPage mode="view" transferId={id} />;
}
