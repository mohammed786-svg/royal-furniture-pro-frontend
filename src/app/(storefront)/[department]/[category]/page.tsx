import type { Metadata } from "next";
import { CategoryListingPageContent } from "@/components/category/category-listing-page-content";
import { getCategoryPage } from "@/lib/constants/category-pages";

export const dynamicParams = true;

type PageProps = {
  params: Promise<{ department: string; category: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { department, category } = await params;
  const data = getCategoryPage(department, category);

  const title =
    data?.title ??
    category
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  return {
    title: `${title} | Royal Furniture Pro`,
    description: `Shop ${title.toLowerCase()} furniture at Royal Furniture Pro.`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { department, category } = await params;

  return (
    <CategoryListingPageContent categorySlug={department} subCategorySlug={category} />
  );
}
