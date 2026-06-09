"use client";

import { use } from "react";
import { OrderDetailPage } from "@/components/admin/orders/order-detail-page";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function OrderDetailRoute({ params }: PageProps) {
  const { id } = use(params);
  return <OrderDetailPage orderId={id} />;
}
