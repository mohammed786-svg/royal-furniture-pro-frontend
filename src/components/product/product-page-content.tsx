"use client";

import { notFound } from "next/navigation";
import { ProductDetailPage } from "@/components/product/product-detail-page";
import { useProductDetail } from "@/hooks/api/use-product-detail";

type ProductPageContentProps = {
  slug: string;
};

export function ProductPageContent({ slug }: ProductPageContentProps) {
  const { product, isLoading, isError } = useProductDetail(slug);

  if (isLoading && !product) {
    return (
      <main className="product-detail-page">
        <div className="product-detail-page__inner royal-section-inner py-12 text-center">
          <div className="admin-inline-spinner mx-auto" />
          <p className="mt-4 text-sm text-gray-500">Loading product...</p>
        </div>
      </main>
    );
  }

  if (!product) {
    if (isError) notFound();
    notFound();
  }

  return <ProductDetailPage product={product} />;
}
