"use client";

import { use } from "react";
import { WarehouseFormPage } from "@/components/admin/inventory/warehouse-form-page";

export default function EditWarehousePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <WarehouseFormPage mode="edit" warehouseId={id} />;
}
