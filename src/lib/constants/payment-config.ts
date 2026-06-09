export type PaymentMethod = "upi_qr" | "bank_transfer" | "gpay";

export const PAYMENT_METHODS: {
  id: PaymentMethod;
  label: string;
  hint: string;
}[] = [
  {
    id: "upi_qr",
    label: "UPI / QR Scan",
    hint: "Enter UTR or 12-digit UPI transaction reference from your UPI app after scanning our QR.",
  },
  {
    id: "bank_transfer",
    label: "Bank Transfer (NEFT/IMPS/RTGS)",
    hint: "Enter bank reference number, UTR, or transaction ID from your bank SMS/email receipt.",
  },
  {
    id: "gpay",
    label: "Google Pay",
    hint: "Enter Google Pay UPI transaction ID or UTR shown in GPay payment details.",
  },
];

export const BANK_DETAILS = {
  accountName: "Royal Furniture Pro Pvt Ltd",
  bankName: "HDFC Bank",
  accountNumber: "50200012345678",
  ifsc: "HDFC0001234",
  branch: "MG Road, Bengaluru",
  upiId: "royalfurniture@hdfcbank",
};

/** Placeholder QR — replace with your merchant QR image in /public when ready */
export const PAYMENT_QR_SRC = "/payment/royal-payment-qr.svg";
