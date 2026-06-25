import type { Metadata } from "next";
import { ProductPageContent } from "@/components/product/product-page-content";
import { getProductBySlug } from "@/lib/constants/product-details";

export const dynamicParams = true;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  return {
    title: product
      ? `${product.name} | Royal Furniture Pro`
      : `${slug.replace(/-/g, " ")} | Royal Furniture Pro`,
    description:
      product?.description.slice(0, 160) ?? "Shop furniture at Royal Furniture Pro.",
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;

  return <ProductPageContent slug={slug} />;
}
