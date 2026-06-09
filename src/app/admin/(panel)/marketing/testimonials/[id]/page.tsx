import { TestimonialDetailPage } from "@/components/admin/marketing/testimonial-detail-page";

type PageProps = { params: Promise<{ id: string }> };

export default async function TestimonialDetailRoute({ params }: PageProps) {
  const { id } = await params;
  return <TestimonialDetailPage testimonialId={id} />;
}
