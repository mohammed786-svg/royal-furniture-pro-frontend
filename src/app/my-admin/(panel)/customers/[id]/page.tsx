"use client";

import { use } from "react";
import { CustomerDetailPage } from "@/components/admin/customers/customer-detail-page";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function CustomerDetailRoute({ params }: PageProps) {
  const { id } = use(params);
  return <CustomerDetailPage customerId={id} />;
}
