export type CheckoutPaymentInstructions = {
  qrImageUrl: string;
  accountName: string;
  bankName: string;
  accountNumber: string;
  ifsc: string;
  branch: string;
  upiId: string;
};

export type CheckoutPaymentFormValues = CheckoutPaymentInstructions;
