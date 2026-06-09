import { ShipmentTrackingFormPage } from "@/components/admin/shipping/shipment-tracking-form-page";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditShipmentTrackingPage({ params }: PageProps) {
  const { id } = await params;
  return <ShipmentTrackingFormPage mode="edit" trackingId={id} />;
}
