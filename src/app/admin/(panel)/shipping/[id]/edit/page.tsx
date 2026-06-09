import { ShipmentFormPage } from "@/components/admin/shipping/shipment-form-page";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditShipmentPage({ params }: PageProps) {
  const { id } = await params;
  return <ShipmentFormPage mode="edit" shipmentId={id} />;
}
