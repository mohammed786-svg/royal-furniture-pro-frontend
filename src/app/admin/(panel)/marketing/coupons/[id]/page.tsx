import { CouponDetailPage } from "@/components/admin/marketing/coupon-detail-page";

type PageProps = { params: Promise<{ id: string }> };

export default async function CouponDetailRoute({ params }: PageProps) {
  const { id } = await params;
  return <CouponDetailPage couponId={id} />;
}
