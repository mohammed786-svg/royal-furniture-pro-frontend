import { TestimonialFormPage } from "@/components/admin/marketing/testimonial-form-page";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditTestimonialPage({ params }: PageProps) {
  const { id } = await params;
  return <TestimonialFormPage mode="edit" testimonialId={id} />;
}
