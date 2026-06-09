import { ReviewDetailPage } from "@/components/admin/catalog/review-detail-page";

type PageProps = { params: Promise<{ id: string }> };

export default async function ReviewDetailRoute({ params }: PageProps) {
  const { id } = await params;
  return <ReviewDetailPage reviewId={id} />;
}
