import { ShipmentTrackingDetailPage } from "@/components/admin/shipping/shipment-tracking-detail-page";

type PageProps = { params: Promise<{ id: string }> };

export default async function ShipmentTrackingDetailRoute({ params }: PageProps) {
  const { id } = await params;
  return <ShipmentTrackingDetailPage trackingId={id} />;
}
