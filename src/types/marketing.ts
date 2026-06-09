export type CouponItem = {
  id: string;
  couponCode: string;
  couponName: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  maxDiscountAmount: number;
  minimumOrderAmount: number;
  usageLimit: number;
  usagePerCustomer: number;
  usedCount: number;
  startsAt?: string | null;
  expiresAt?: string | null;
  isActive: boolean;
  usages?: CouponUsage[];
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type CouponUsage = {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail?: string | null;
  orderId: string;
  discountApplied: number;
  usedAt?: string | null;
};

export type CouponFormValues = {
  couponCode: string;
  couponName: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  maxDiscountAmount: number;
  minimumOrderAmount: number;
  usageLimit: number;
  usagePerCustomer: number;
  startsAt: string;
  expiresAt: string;
  isActive: boolean;
};

export type BannerPosition = {
  id: string;
  positionCode: string;
  positionName: string;
  description?: string | null;
  maxBanners: number;
  isActive: boolean;
};

export type BannerItem = {
  id: string;
  bannerPositionId: string;
  positionCode?: string;
  positionName?: string;
  categoryId?: string | null;
  categoryName?: string | null;
  title: string;
  subtitle?: string | null;
  imageUrl?: string | null;
  mobileImageUrl?: string | null;
  linkUrl?: string | null;
  linkType?: string | null;
  displayOrder: number;
  startsAt?: string | null;
  endsAt?: string | null;
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type BannerFormValues = {
  bannerPositionId: string;
  categoryId: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  mobileImageUrl: string;
  linkUrl: string;
  linkType: string;
  displayOrder: number;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
};

export type CmsPageItem = {
  id: string;
  pageCode: string;
  title: string;
  slug: string;
  content?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;
  isPublished: boolean;
  publishedAt?: string | null;
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type CmsPageFormValues = {
  pageCode: string;
  title: string;
  slug: string;
  content: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  isPublished: boolean;
  isActive: boolean;
};

export type TestimonialItem = {
  id: string;
  customerName: string;
  customerImage?: string | null;
  location?: string | null;
  rating: number;
  testimonialText: string;
  productId?: string | null;
  productName?: string | null;
  isFeatured: boolean;
  displayOrder: number;
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type TestimonialFormValues = {
  customerName: string;
  customerImage: string;
  location: string;
  rating: number;
  testimonialText: string;
  productId: string;
  isFeatured: boolean;
  displayOrder: number;
  isActive: boolean;
};

export type FaqItem = {
  id: string;
  category: string;
  question: string;
  answer: string;
  displayOrder: number;
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type FaqFormValues = {
  category: string;
  question: string;
  answer: string;
  displayOrder: number;
  isActive: boolean;
};
