"use client";

import { notFound } from "next/navigation";
import { CategoryListingPage } from "@/components/category/category-listing-page";
import { useCategoryListing } from "@/hooks/api/use-category-listing";

type CategoryListingPageContentProps = {
  categorySlug: string;
  subCategorySlug: string;
};

export function CategoryListingPageContent({
  categorySlug,
  subCategorySlug,
}: CategoryListingPageContentProps) {
  const { data, isLoading, isError } = useCategoryListing(
    categorySlug,
    subCategorySlug,
  );

  if (isLoading && !data?.products.length) {
    return (
      <main className="category-listing-page">
        <div className="category-listing-page__inner royal-section-inner py-12 text-center">
          <div className="admin-inline-spinner mx-auto" />
          <p className="mt-4 text-sm text-gray-500">Loading category...</p>
        </div>
      </main>
    );
  }

  if (isError && !data?.products.length) {
    notFound();
  }

  if (!data) {
    notFound();
  }

  return <CategoryListingPage data={data} />;
}
