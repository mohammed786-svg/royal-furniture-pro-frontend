import { BannerDetailPage } from "@/components/admin/marketing/banner-detail-page";

type PageProps = { params: Promise<{ id: string }> };

export default async function BannerDetailRoute({ params }: PageProps) {
  const { id } = await params;
  return <BannerDetailPage bannerId={id} />;
}
