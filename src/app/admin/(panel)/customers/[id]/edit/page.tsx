"use client";

import { use } from "react";
import { CustomerFormPage } from "@/components/admin/customers/customer-form-page";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function EditCustomerPage({ params }: PageProps) {
  const { id } = use(params);
  return <CustomerFormPage mode="edit" customerId={id} />;
}
