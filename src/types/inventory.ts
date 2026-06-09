import type { PaginationMeta } from "@/types/catalog";

export type WarehouseItem = {
  id: string;
  warehouseCode: string;
  name: string;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  country?: string | null;
  contactPhone?: string | null;
  contactEmail?: string | null;
  isPrimary: boolean;
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type WarehouseFormValues = {
  warehouseCode: string;
  name: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  contactPhone: string;
  contactEmail: string;
  isPrimary: boolean;
  isActive: boolean;
};

export type StockItem = {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  productVariantId?: string | null;
  variantName?: string | null;
  variantSku?: string | null;
  warehouseId: string;
  warehouseCode: string;
  warehouseName: string;
  availableStock: number;
  reservedStock: number;
  soldStock: number;
  damagedStock: number;
  returnedStock: number;
  warehouseStock: number;
  reorderLevel: number;
  lastRestockedAt?: string | null;
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type StockFormValues = {
  productId: string;
  productVariantId: string;
  warehouseId: string;
  availableStock: number;
  reservedStock: number;
  soldStock: number;
  damagedStock: number;
  returnedStock: number;
  reorderLevel: number;
  isActive: boolean;
};

export type AdjustmentItem = {
  id: string;
  inventoryId: string;
  warehouseId: string;
  warehouseCode: string;
  warehouseName: string;
  productId: string;
  productName: string;
  productSku: string;
  productVariantId?: string | null;
  variantName?: string | null;
  variantSku?: string | null;
  adjustmentType: string;
  quantity: number;
  reason: string;
  approvedBy?: string | null;
  status: string;
  adjustedAt?: string | null;
  currentAvailableStock: number;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type AdjustmentFormValues = {
  inventoryId: string;
  warehouseId: string;
  adjustmentType: string;
  quantity: number;
  reason: string;
};

export type TransferItem = {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  productVariantId?: string | null;
  variantName?: string | null;
  variantSku?: string | null;
  fromWarehouseId: string;
  fromWarehouseCode: string;
  fromWarehouseName: string;
  toWarehouseId: string;
  toWarehouseCode: string;
  toWarehouseName: string;
  quantity: number;
  status: string;
  initiatedBy?: string | null;
  completedAt?: string | null;
  notes: string;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type TransferFormValues = {
  productId: string;
  productVariantId: string;
  fromWarehouseId: string;
  toWarehouseId: string;
  quantity: number;
  notes: string;
};

export type AlertItem = {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  productVariantId?: string | null;
  variantName?: string | null;
  variantSku?: string | null;
  warehouseId: string;
  warehouseCode: string;
  warehouseName: string;
  availableStock: number;
  reorderLevel: number;
  shortage: number;
};

export type InventoryOptions = {
  warehouses: { id: string; code: string; name: string; isPrimary: boolean }[];
  products: { id: string; name: string; sku: string }[];
  variants: {
    id: string;
    productId: string;
    productName: string;
    variantName: string;
    sku: string;
  }[];
  adjustmentTypes: string[];
  adjustmentStatuses: string[];
  transferStatuses: string[];
};

export type InventoryListResponse<T> = {
  items: T[];
  pagination: PaginationMeta;
};
