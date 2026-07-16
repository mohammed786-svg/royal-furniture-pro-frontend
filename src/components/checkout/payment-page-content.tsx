"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { CheckoutStepper } from "@/components/cart/checkout-stepper";
import { CategoryBreadcrumbs } from "@/components/category/category-breadcrumbs";
import { CheckoutOrderSummary } from "@/components/checkout/checkout-order-summary";
import { MediaImage } from "@/components/ui/media-image";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { cartOrderTotal } from "@/lib/constants/cart-data";
import {
  BANK_DETAILS,
  PAYMENT_METHODS,
  PAYMENT_QR_SRC,
  type PaymentMethod,
} from "@/lib/constants/payment-config";
import { resolveMediaUrl } from "@/lib/media/resolve-url";
import { useAddressStore } from "@/lib/store/address-store";
import { useAuthStore } from "@/lib/store/auth-store";
import { useCartStore } from "@/lib/store/cart-store";
import { fetchCheckoutPaymentInstructions } from "@/services/checkout-payment-api";
import { placeStorefrontOrder } from "@/services/storefront-commerce";
import type { CheckoutPaymentInstructions } from "@/types/checkout-payment";

const FALLBACK_INSTRUCTIONS: CheckoutPaymentInstructions = {
  qrImageUrl: PAYMENT_QR_SRC,
  accountName: BANK_DETAILS.accountName,
  bankName: BANK_DETAILS.bankName,
  accountNumber: BANK_DETAILS.accountNumber,
  ifsc: BANK_DETAILS.ifsc,
  branch: BANK_DETAILS.branch,
  upiId: BANK_DETAILS.upiId,
};

export function PaymentPageContent() {
  const router = useRouter();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const cartItems = useCartStore((s) => s.cartItems);
  const clearCart = useCartStore((s) => s.clearCart);
  const getSelectedAddress = useAddressStore((s) => s.getSelectedAddress);
  const selectedAddressId = useAddressStore((s) => s.selectedAddressId);
  const addressLabel = useAddressStore((s) => s.addressLabel);

  const [method, setMethod] = useState<PaymentMethod>("upi_qr");
  const [reference, setReference] = useState("");
  const [screenshotData, setScreenshotData] = useState<string | undefined>();
  const [screenshotName, setScreenshotName] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const [instructions, setInstructions] =
    useState<CheckoutPaymentInstructions>(FALLBACK_INSTRUCTIONS);

  useEffect(() => {
    let cancelled = false;
    void fetchCheckoutPaymentInstructions()
      .then((data) => {
        if (!cancelled) setInstructions({ ...FALLBACK_INSTRUCTIONS, ...data });
      })
      .catch(() => {
        /* keep fallbacks */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const address = getSelectedAddress();
  const hint = useMemo(
    () => PAYMENT_METHODS.find((m) => m.id === method)?.hint ?? "",
    [method],
  );
  const total = cartOrderTotal(cartItems);
  const canPlaceOrder = Boolean(screenshotData) && reference.trim().length >= 4;
  const qrSrc =
    resolveMediaUrl(instructions.qrImageUrl) ||
    instructions.qrImageUrl ||
    PAYMENT_QR_SRC;

  if (!isLoggedIn()) {
    return (
      <main className="cart-page">
        <div className="cart-page__inner royal-section-inner">
          <p className="cart-page__empty">
            Please{" "}
            <Link href="/login" className="cart-page__empty-link">
              sign in
            </Link>{" "}
            to complete checkout.
          </p>
        </div>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="cart-page">
        <div className="cart-page__inner royal-section-inner">
          <p className="cart-page__empty">
            Your cart is empty.{" "}
            <Link href="/" className="cart-page__empty-link">
              Continue shopping
            </Link>
          </p>
        </div>
      </main>
    );
  }

  if (!address || !selectedAddressId) {
    return (
      <main className="cart-page">
        <div className="cart-page__inner royal-section-inner">
          <p className="cart-page__empty">
            Please add a delivery address first.{" "}
            <Link href="/checkout/address" className="cart-page__empty-link">
              Add address
            </Link>
          </p>
        </div>
      </main>
    );
  }

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setScreenshotData(undefined);
      setScreenshotName(undefined);
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      toast.error("Image must be under 4 MB");
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setScreenshotData(result);
        setScreenshotName(file.name);
        toast.success("Payment screenshot attached");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ref = reference.trim();
    if (ref.length < 4) {
      toast.error("Enter payment reference / UTR number");
      return;
    }
    if (!screenshotData) {
      toast.error("Upload payment screenshot to place the order");
      return;
    }

    setSubmitting(true);
    try {
      const result = await placeStorefrontOrder({
        shippingAddressId: selectedAddressId,
        paymentMethod: method,
        transactionRef: ref,
        screenshot: screenshotData,
      });
      await clearCart();
      router.push(
        `/checkout/success?orderId=${encodeURIComponent(result.orderNumber || result.orderId)}`,
      );
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not place order"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="cart-page checkout-page">
      <div className="cart-page__inner royal-section-inner">
        <CategoryBreadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Cart", href: "/cart" },
            { label: "Payment", href: "/checkout/payment" },
          ]}
        />

        <CheckoutStepper activeStep={3} />

        <div className="cart-page__layout">
          <section className="cart-page__main checkout-panel">
            <h1 className="cart-page__title">Payment</h1>

            <div className="payment-deliver-to">
              <p className="payment-deliver-to__label">Deliver to</p>
              <p className="payment-deliver-to__badge">{addressLabel(address)}</p>
              <p className="payment-deliver-to__text">
                {address.fullName} · {address.line1}, {address.city} {address.pincode}
              </p>
            </div>

            <div className="payment-qr-block">
              <div className="payment-qr-block__qr">
                <MediaImage
                  src={qrSrc}
                  alt="Scan to pay Royal Furniture Pro"
                  width={200}
                  height={200}
                  fit="contain"
                  placeholderSize="md"
                  showLabel
                  resolveUrl={false}
                  imgClassName="payment-qr-block__img"
                />
              </div>
              <div className="payment-qr-block__bank">
                <h2 className="payment-qr-block__title">Bank details</h2>
                <dl className="payment-bank-dl">
                  <div>
                    <dt>Account name</dt>
                    <dd>{instructions.accountName}</dd>
                  </div>
                  <div>
                    <dt>Bank</dt>
                    <dd>{instructions.bankName}</dd>
                  </div>
                  <div>
                    <dt>Account no.</dt>
                    <dd>{instructions.accountNumber}</dd>
                  </div>
                  <div>
                    <dt>IFSC</dt>
                    <dd>{instructions.ifsc}</dd>
                  </div>
                  <div>
                    <dt>UPI ID</dt>
                    <dd>{instructions.upiId}</dd>
                  </div>
                  {instructions.branch ? (
                    <div>
                      <dt>Branch</dt>
                      <dd>{instructions.branch}</dd>
                    </div>
                  ) : null}
                </dl>
                <p className="payment-qr-block__amount">
                  Pay <strong>₹{total.toLocaleString("en-IN")}</strong> and submit proof
                  below
                </p>
              </div>
            </div>

            <form className="payment-form" onSubmit={handleSubmit} noValidate>
              <fieldset className="payment-form__methods">
                <legend>Payment type</legend>
                {PAYMENT_METHODS.map((m) => (
                  <label key={m.id} className="payment-form__method">
                    <input
                      type="radio"
                      name="pay-method"
                      checked={method === m.id}
                      onChange={() => setMethod(m.id)}
                    />
                    <span>{m.label}</span>
                  </label>
                ))}
              </fieldset>

              <div className="payment-form__field">
                <label htmlFor="payment-ref">UTR / Reference number</label>
                <input
                  id="payment-ref"
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="Transaction ID, UTR, or bank reference"
                  className="payment-form__input"
                  required
                />
                <p className="payment-form__hint">{hint}</p>
              </div>

              <div
                className={`payment-form__field payment-form__field--screenshot${
                  screenshotData ? " is-uploaded" : " is-required"
                }`}
              >
                <label htmlFor="payment-screenshot">
                  Payment screenshot <span className="payment-form__required">*</span>
                </label>
                <p className="payment-form__screenshot-note">
                  Required — upload a clear screenshot of your payment success screen
                  before placing the order.
                </p>
                <input
                  id="payment-screenshot"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFile}
                  className="payment-form__file"
                  required
                />
                {screenshotName ? (
                  <p className="payment-form__file-name">Attached: {screenshotName}</p>
                ) : (
                  <p className="payment-form__file-empty">No file chosen yet</p>
                )}
              </div>

              <button
                type="submit"
                className="payment-form__submit"
                disabled={submitting || !canPlaceOrder}
              >
                {submitting
                  ? "Submitting…"
                  : !screenshotData
                    ? "Upload screenshot to place order"
                    : "Confirm payment & place order"}
              </button>
              {!screenshotData ? (
                <p className="payment-form__blocked-hint">
                  Place order stays disabled until a payment screenshot is uploaded.
                </p>
              ) : null}
            </form>

            <Link href="/checkout/address" className="checkout-panel__back">
              ← Change address
            </Link>
          </section>

          <CheckoutOrderSummary items={cartItems} />
        </div>
      </div>
    </main>
  );
}
