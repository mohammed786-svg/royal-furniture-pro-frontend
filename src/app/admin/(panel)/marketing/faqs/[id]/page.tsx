import { FaqDetailPage } from "@/components/admin/marketing/faq-detail-page";

type PageProps = { params: Promise<{ id: string }> };

export default async function FaqDetailRoute({ params }: PageProps) {
  const { id } = await params;
  return <FaqDetailPage faqId={id} />;
}
