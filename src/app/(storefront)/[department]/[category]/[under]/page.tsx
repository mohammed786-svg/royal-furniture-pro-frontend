import type { Metadata } from "next";
import { CategoryListingPageContent } from "@/components/category/category-listing-page-content";

export const dynamicParams = true;

type PageProps = {
  params: Promise<{ department: string; category: string; under: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { under } = await params;
  const title = under
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    title: `${title} | Royal Furniture Pro`,
    description: `Shop ${title.toLowerCase()} furniture at Royal Furniture Pro.`,
  };
}

export default async function UnderCategoryPage({ params }: PageProps) {
  const { department, category, under } = await params;

  return (
    <CategoryListingPageContent
      categorySlug={department}
      subCategorySlug={category}
      underSubCategorySlug={under}
    />
  );
}
