import { CouponFormPage } from "@/components/admin/marketing/coupon-form-page";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditCouponPage({ params }: PageProps) {
  const { id } = await params;
  return <CouponFormPage mode="edit" couponId={id} />;
}
