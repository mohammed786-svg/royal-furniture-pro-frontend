import type { CartLineItem } from "@/lib/constants/cart-data";
import type { OrderActionsInfo } from "@/lib/orders/order-reasons";
import type { SavedAddress } from "@/lib/store/address-store";

export type StorefrontAuthUser = {
  customerId: string;
  userId?: string | null;
  name: string;
  mobile: string;
  email?: string | null;
};

export type StorefrontCartResponse = {
  cartId: string;
  items: CartLineItem[];
  itemCount: number;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
};

export type StorefrontWishlistResponse = {
  items: CartLineItem[];
  itemCount: number;
};

export type StorefrontAddressesResponse = {
  items: SavedAddress[];
  selectedAddressId: string | null;
};

export type StorefrontCheckoutResponse = {
  orderId: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  paymentStatus: string;
};

export type StorefrontOrderSummary = {
  orderId: string;
  orderNumber: string;
  status: string;
  statusName: string;
  totalAmount: number;
  createdAt?: string | null;
  paymentMethod: string;
};

export type StorefrontTrackOrderResponse = {
  order: StorefrontOrderSummary;
  invoiceAvailable?: boolean;
  items: {
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    sku: string;
  }[];
  shipment: {
    shiprocketOrderId?: string | null;
    awbNumber?: string;
    courierName?: string;
    deliveryStatus?: string;
    trackingNumber?: string;
    estimatedDeliveryDate?: string | null;
  } | null;
  tracking: {
    statusCode: string;
    statusMessage: string;
    location?: string;
    trackedAt?: string | null;
    source: string;
  }[];
  actions?: OrderActionsInfo | null;
};

export type StorefrontOrdersListResponse = {
  items: StorefrontOrderSummary[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

export type VerifyOtpResponse = {
  user: StorefrontAuthUser;
  accessToken: string;
  refreshToken?: string;
  expiresInMinutes: number;
};
