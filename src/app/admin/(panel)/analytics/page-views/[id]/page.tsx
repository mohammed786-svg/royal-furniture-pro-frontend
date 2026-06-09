import { PageViewDetailPage } from "@/components/admin/analytics/page-view-detail-page";

type PageProps = { params: Promise<{ id: string }> };

export default async function PageViewDetailRoute({ params }: PageProps) {
  const { id } = await params;
  return <PageViewDetailPage pageViewId={id} />;
}
