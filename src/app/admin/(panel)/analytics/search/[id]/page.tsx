import { SearchDetailPage } from "@/components/admin/analytics/search-detail-page";

type PageProps = { params: Promise<{ id: string }> };

export default async function SearchDetailRoute({ params }: PageProps) {
  const { id } = await params;
  return <SearchDetailPage searchId={id} />;
}
