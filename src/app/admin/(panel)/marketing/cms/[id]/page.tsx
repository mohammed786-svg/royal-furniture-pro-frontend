import { CmsPageDetailPage } from "@/components/admin/marketing/cms-page-detail-page";

type PageProps = { params: Promise<{ id: string }> };

export default async function CmsPageDetailRoute({ params }: PageProps) {
  const { id } = await params;
  return <CmsPageDetailPage pageId={id} />;
}
