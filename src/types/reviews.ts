export type ReviewItem = {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  customerId: string;
  customerName: string;
  customerEmail?: string | null;
  orderId?: string | null;
  title: string;
  reviewText: string;
  rating: number;
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  approvedBy?: string | null;
  approvedAt?: string | null;
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type ReviewFormValues = {
  productId: string;
  customerId: string;
  orderId: string;
  title: string;
  reviewText: string;
  rating: number;
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  isActive: boolean;
};

export type ReviewStatus = "APPROVED" | "REJECTED";
