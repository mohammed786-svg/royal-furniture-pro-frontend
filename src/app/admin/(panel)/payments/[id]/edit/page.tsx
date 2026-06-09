import { PaymentFormPage } from "@/components/admin/payments/payment-form-page";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditPaymentPage({ params }: PageProps) {
  const { id } = await params;
  return <PaymentFormPage mode="edit" paymentId={id} />;
}
