import type { CartLineItem } from "@/lib/constants/cart-data";
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

export type VerifyOtpResponse = {
  user: StorefrontAuthUser;
  accessToken: string;
  refreshToken?: string;
  expiresInMinutes: number;
};
