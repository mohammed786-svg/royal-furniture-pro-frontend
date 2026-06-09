import { ShipmentDetailPage } from "@/components/admin/shipping/shipment-detail-page";

type PageProps = { params: Promise<{ id: string }> };

export default async function ShipmentDetailRoute({ params }: PageProps) {
  const { id } = await params;
  return <ShipmentDetailPage shipmentId={id} />;
}
