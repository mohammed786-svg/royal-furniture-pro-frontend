import type { PaginationMeta } from "@/types/catalog";

export type OrderAddress = {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  pincode: string;
};

export type OrderItem = {
  id: string;
  productId: string;
  productVariantId?: string | null;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  discountAmount: number;
  taxAmount: number;
  lineTotal: number;
  hsnCode: string;
  gstPercent: number;
  warehouseId?: string | null;
};

export type OrderPayment = {
  id: string;
  paymentMethod: string;
  paymentAmount: number;
  currency: string;
  paymentStatus: string;
  transactionRef?: string | null;
  paidAt?: string | null;
  createdAt?: string | null;
};

export type OrderTracking = {
  id: string;
  orderId?: string;
  orderNumber?: string | null;
  customerName?: string | null;
  statusCode: string;
  statusMessage: string;
  location?: string | null;
  trackedAt?: string | null;
  isCustomerVisible: boolean;
  createdAt?: string | null;
};

export type OrderHistory = {
  id: string;
  fromStatus: string;
  toStatus: string;
  changedBy?: string | null;
  changedByName?: string | null;
  changeReason?: string | null;
  metadata: Record<string, unknown>;
  changedAt?: string | null;
};

export type OrderListItem = {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  statusCode: string;
  statusName: string;
  currentStatus: string;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  shippingAmount: number;
  totalAmount: number;
  paymentMethod: string;
  couponCode?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  confirmedAt?: string | null;
  shippedAt?: string | null;
  deliveredAt?: string | null;
  cancelledAt?: string | null;
};

export type OrderDetail = OrderListItem & {
  orderStatusId: string;
  shippingAddressId?: string | null;
  billingAddressId?: string | null;
  shippingAddress?: OrderAddress | null;
  billingAddress?: OrderAddress | null;
  notes?: string | null;
  cancelReason?: string | null;
  items: OrderItem[];
  payments: OrderPayment[];
  tracking: OrderTracking[];
  history: OrderHistory[];
  shipments: {
    id: string;
    shiprocketOrderId?: string | null;
    shipmentIdExternal?: string | null;
    awbNumber?: string | null;
    courierName?: string | null;
    trackingNumber?: string | null;
    pickupStatus?: string | null;
    deliveryStatus?: string | null;
    estimatedDeliveryDate?: string | null;
    shippedAt?: string | null;
    deliveredAt?: string | null;
  }[];
  shipmentTracking: {
    id: string;
    shipmentId: string;
    statusCode: string;
    statusMessage: string;
    location?: string | null;
    trackedAt?: string | null;
    source: string;
  }[];
};

export type OrderStatusItem = {
  id: string;
  statusCode: string;
  statusName: string;
  description?: string | null;
  displayOrder: number;
  isTerminal: boolean;
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type OrderStatusFormValues = {
  statusCode: string;
  statusName: string;
  description: string;
  displayOrder: number;
  isTerminal: boolean;
  isActive: boolean;
};

export type OrderCreateLineItem = {
  productId: string;
  productVariantId: string;
  quantity: number;
  unitPrice: number;
  discountAmount: number;
  taxAmount: number;
  lineTotal: number;
  hsnCode: string;
  warehouseId: string;
};

export type OrderCreateFormValues = {
  customerId: string;
  shippingAddressId: string;
  billingAddressId: string;
  statusCode: string;
  paymentMethod: string;
  paymentStatus: string;
  createPayment: boolean;
  discountAmount: number;
  shippingAmount: number;
  couponCode: string;
  notes: string;
  items: OrderCreateLineItem[];
};

export type ReturnFormValues = {
  orderId: string;
  statusCode: string;
  reason: string;
};

export type TrackingFormValues = {
  orderId: string;
  statusCode: string;
  statusMessage: string;
  location: string;
  trackedAt: string;
  isCustomerVisible: boolean;
};

export type InvoiceLineItem = {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  discountAmount: number;
  taxAmount: number;
  lineTotal: number;
  hsnCode: string;
  gstPercent: number;
};

export type OrderInvoice = {
  invoiceNumber: string;
  invoiceDate?: string | null;
  orderId: string;
  orderNumber: string;
  company: {
    name: string;
    address: string;
    phone: string;
    email: string;
  };
  customer: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
  };
  shippingAddress: OrderAddress;
  billingAddress: OrderAddress;
  lineItems: InvoiceLineItem[];
  totals: {
    subtotal: number;
    discountAmount: number;
    taxAmount: number;
    shippingAmount: number;
    grandTotal: number;
  };
  paymentMethod: string;
  currentStatus: string;
  couponCode?: string | null;
  notes?: string | null;
};

export type OrderOptions = {
  customers: { id: string; fullName: string; email: string; phone: string }[];
  products: {
    id: string;
    name: string;
    sku: string;
    salePrice: number;
    hsnCode: string;
    gstPercent: number;
  }[];
  variants: {
    id: string;
    productId: string;
    productName: string;
    variantName: string;
    sku: string;
    salePrice: number;
  }[];
  addresses: {
    id: string;
    customerId: string;
    customerName: string;
    addressType: string;
    fullName: string;
    city: string;
    pincode: string;
  }[];
  statuses: {
    id: string;
    statusCode: string;
    statusName: string;
    isTerminal: boolean;
  }[];
  paymentMethods: string[];
};

export type OrdersListResponse<T> = {
  items: T[];
  pagination: PaginationMeta;
};
