import { FaqFormPage } from "@/components/admin/marketing/faq-form-page";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditFaqPage({ params }: PageProps) {
  const { id } = await params;
  return <FaqFormPage mode="edit" faqId={id} />;
}
