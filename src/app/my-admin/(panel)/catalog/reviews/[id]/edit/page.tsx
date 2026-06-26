import { ReviewFormPage } from "@/components/admin/catalog/review-form-page";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditReviewPage({ params }: PageProps) {
  const { id } = await params;
  return <ReviewFormPage mode="edit" reviewId={id} />;
}
