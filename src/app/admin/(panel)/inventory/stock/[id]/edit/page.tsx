"use client";

import { use } from "react";
import { StockFormPage } from "@/components/admin/inventory/stock-form-page";

export default function EditStockPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <StockFormPage mode="edit" stockId={id} />;
}
