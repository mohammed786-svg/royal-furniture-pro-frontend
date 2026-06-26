import { PaymentDetailPage } from "@/components/admin/payments/payment-detail-page";

type PageProps = { params: Promise<{ id: string }> };

export default async function PaymentDetailRoute({ params }: PageProps) {
  const { id } = await params;
  return <PaymentDetailPage paymentId={id} />;
}
