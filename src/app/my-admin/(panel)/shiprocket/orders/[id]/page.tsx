import { ShiprocketOrderDetailPage } from "@/components/admin/shiprocket/shiprocket-order-detail-page";

type Props = { params: Promise<{ id: string }> };

export default async function ShiprocketOrderDetailRoute({ params }: Props) {
  const { id } = await params;
  return <ShiprocketOrderDetailPage shiprocketOrderId={id} />;
}
