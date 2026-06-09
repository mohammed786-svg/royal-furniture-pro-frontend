"use client";

import { use } from "react";
import { AddressFormPage } from "@/components/admin/customers/address-form-page";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function EditAddressPage({ params }: PageProps) {
  const { id } = use(params);
  return <AddressFormPage mode="edit" addressId={id} />;
}
