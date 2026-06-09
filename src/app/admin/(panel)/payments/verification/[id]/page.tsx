import { PaymentVerificationDetailPage } from "@/components/admin/payments/payment-verification-detail-page";

type PageProps = { params: Promise<{ id: string }> };

export default async function PaymentVerificationDetailRoute({ params }: PageProps) {
  const { id } = await params;
  return <PaymentVerificationDetailPage verificationId={id} />;
}
