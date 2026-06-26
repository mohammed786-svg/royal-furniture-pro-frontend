import { TagDetailPage } from "@/components/admin/catalog/tag-detail-page";

type PageProps = { params: Promise<{ id: string }> };

export default async function TagDetailRoute({ params }: PageProps) {
  const { id } = await params;
  return <TagDetailPage tagId={id} />;
}
