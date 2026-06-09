import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryListingPage } from "@/components/category/category-listing-page";
import {
  getAllCategoryPageParams,
  getCategoryPage,
} from "@/lib/constants/category-pages";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllCategoryPageParams();
}

type PageProps = {
  params: Promise<{ department: string; category: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { department, category } = await params;
  const data = getCategoryPage(department, category);
  if (!data) return { title: "Category | Royal Furniture Pro" };

  return {
    title: `${data.title} | Royal Furniture Pro`,
    description: `Shop ${data.category.toLowerCase()} from ${data.department} at Royal Furniture Pro.`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { department, category } = await params;
  const data = getCategoryPage(department, category);

  if (!data) {
    notFound();
  }

  return <CategoryListingPage data={data} />;
}
