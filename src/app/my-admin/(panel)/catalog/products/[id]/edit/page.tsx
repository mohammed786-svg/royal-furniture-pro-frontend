"use client";

import { use } from "react";
import { ProductFormPage } from "@/components/admin/catalog/product-form-page";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function EditProductPage({ params }: PageProps) {
  const { id } = use(params);
  return <ProductFormPage mode="edit" productId={id} />;
}
