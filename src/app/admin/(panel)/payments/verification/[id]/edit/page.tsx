import { PaymentVerificationFormPage } from "@/components/admin/payments/payment-verification-form-page";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditPaymentVerificationPage({ params }: PageProps) {
  const { id } = await params;
  return <PaymentVerificationFormPage mode="edit" verificationId={id} />;
}
