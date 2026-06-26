import { BrandDetailPage } from "@/components/admin/catalog/brand-detail-page";

type PageProps = { params: Promise<{ id: string }> };

export default async function BrandDetailRoute({ params }: PageProps) {
  const { id } = await params;
  return <BrandDetailPage brandId={id} />;
}
