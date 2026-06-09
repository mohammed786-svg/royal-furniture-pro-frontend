import type { PaginationMeta } from "@/types/catalog";

export type CustomerProfile = {
  id: string;
  dateOfBirth?: string | null;
  gender?: string | null;
  profileImage?: string | null;
  preferences: Record<string, unknown>;
  newsletterSubscribed: boolean;
};

export type CustomerItem = {
  id: string;
  userId?: string | null;
  guestToken?: string | null;
  email: string;
  phone: string;
  fullName: string;
  isGuest: boolean;
  isActive: boolean;
  profile?: CustomerProfile | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type CustomerFormValues = {
  email: string;
  phone: string;
  fullName: string;
  isGuest: boolean;
  isActive: boolean;
  profile: {
    dateOfBirth: string;
    gender: string;
    profileImage: string;
    newsletterSubscribed: boolean;
  };
};

export type AddressItem = {
  id: string;
  customerId: string;
  customerName: string;
  addressType: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string | null;
  landmark?: string | null;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type AddressFormValues = {
  customerId: string;
  addressType: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
  isActive: boolean;
};

export type WishlistItem = {
  id: string;
  customerId?: string | null;
  customerName?: string | null;
  productId: string;
  productName: string;
  productSku: string;
  productSalePrice: number;
  productImageUrl?: string | null;
  productVariantId?: string | null;
  isGuest: boolean;
  isActive: boolean;
  createdAt?: string | null;
};

export type WalletItem = {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  balance: number;
  currency: string;
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type WalletTransaction = {
  id: string;
  walletId: string;
  customerId: string;
  transactionType: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  referenceType?: string | null;
  referenceId?: string | null;
  description?: string | null;
  createdAt?: string | null;
};

export type WalletDetail = WalletItem & {
  transactions: WalletTransaction[];
};

export type WalletTransactionFormValues = {
  transactionType: string;
  amount: number;
  referenceType: string;
  referenceId: string;
  description: string;
};

export type CustomerOptions = {
  genders: string[];
  addressTypes: string[];
  transactionTypes: string[];
  referenceTypes: string[];
};

export type CustomersListResponse<T> = {
  items: T[];
  pagination: PaginationMeta;
};
