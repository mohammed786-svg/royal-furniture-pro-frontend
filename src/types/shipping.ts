export type ShipmentItem = {
  id: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  shiprocketOrderId?: string | null;
  shipmentIdExternal?: string | null;
  awbNumber?: string | null;
  courierName?: string | null;
  trackingNumber?: string | null;
  pickupStatus?: string | null;
  deliveryStatus?: string | null;
  shippingLabelUrl?: string | null;
  estimatedDeliveryDate?: string | null;
  shippedAt?: string | null;
  deliveredAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type ShipmentFormValues = {
  orderId: string;
  shiprocketOrderId: string;
  shipmentIdExternal: string;
  awbNumber: string;
  courierName: string;
  trackingNumber: string;
  pickupStatus: string;
  deliveryStatus: string;
  shippingLabelUrl: string;
  estimatedDeliveryDate: string;
  shippedAt: string;
  deliveredAt: string;
};

export type ShipmentTrackingItem = {
  id: string;
  shipmentId: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  awbNumber?: string | null;
  statusCode: string;
  statusMessage: string;
  location?: string | null;
  trackedAt?: string | null;
  source: string;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type ShipmentTrackingFormValues = {
  shipmentId: string;
  orderId: string;
  statusCode: string;
  statusMessage: string;
  location: string;
  trackedAt: string;
  source: string;
};
