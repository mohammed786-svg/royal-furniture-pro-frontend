"use client";

import { use } from "react";
import { AdjustmentFormPage } from "@/components/admin/inventory/adjustment-form-page";

export default function ViewAdjustmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <AdjustmentFormPage mode="view" adjustmentId={id} />;
}
