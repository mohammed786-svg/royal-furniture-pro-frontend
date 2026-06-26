"use client";

import { use } from "react";
import { OrderStatusFormPage } from "@/components/admin/orders/order-status-form-page";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function EditOrderStatusPage({ params }: PageProps) {
  const { id } = use(params);
  return <OrderStatusFormPage mode="edit" statusId={id} />;
}
