export type PaymentItem = {
  id: string;
  orderId: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  paymentMethod: string;
  paymentAmount: number;
  currency: string;
  paymentStatus: string;
  transactionRef?: string | null;
  paidAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type PaymentFormValues = {
  orderId: string;
  customerId: string;
  paymentMethod: string;
  paymentAmount: number;
  currency: string;
  paymentStatus: string;
  transactionRef: string;
  paidAt: string;
};

export type PaymentVerificationItem = {
  id: string;
  paymentId: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  utrNumber: string;
  paymentAmount: number;
  screenshotUrl?: string | null;
  verificationStatus: string;
  verifiedBy?: string | null;
  verifiedByName?: string | null;
  verificationTime?: string | null;
  remarks?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type PaymentVerificationFormValues = {
  paymentId: string;
  orderId: string;
  utrNumber: string;
  paymentAmount: number;
  screenshotUrl: string;
  remarks: string;
};
