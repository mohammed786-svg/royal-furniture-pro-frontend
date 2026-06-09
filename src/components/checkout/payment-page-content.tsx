"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { CheckoutStepper } from "@/components/cart/checkout-stepper";
import { CategoryBreadcrumbs } from "@/components/category/category-breadcrumbs";
import { CheckoutOrderSummary } from "@/components/checkout/checkout-order-summary";
import { cartOrderTotal } from "@/lib/constants/cart-data";
import {
  BANK_DETAILS,
  PAYMENT_METHODS,
  PAYMENT_QR_SRC,
  type PaymentMethod,
} from "@/lib/constants/payment-config";
import { useAddressStore } from "@/lib/store/address-store";
import { useCartStore } from "@/lib/store/cart-store";
import { orderTotalFromItems, useOrderStore } from "@/lib/store/order-store";

export function PaymentPageContent() {
  const router = useRouter();
  const cartItems = useCartStore((s) => s.cartItems);
  const clearCart = useCartStore((s) => s.clearCart);
  const getSelectedAddress = useAddressStore((s) => s.getSelectedAddress);
  const addressLabel = useAddressStore((s) => s.addressLabel);
  const placeOrder = useOrderStore((s) => s.placeOrder);

  const [method, setMethod] = useState<PaymentMethod>("upi_qr");
  const [reference, setReference] = useState("");
  const [screenshotName, setScreenshotName] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);

  const address = getSelectedAddress();
  const hint = useMemo(
    () => PAYMENT_METHODS.find((m) => m.id === method)?.hint ?? "",
    [method],
  );
  const total = cartOrderTotal(cartItems);

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

  if (!address) {
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
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      toast.error("Image must be under 4 MB");
      return;
    }
    setScreenshotName(file.name);
    toast.success("Payment screenshot attached");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ref = reference.trim();
    if (ref.length < 4) {
      toast.error("Enter payment reference / UTR number");
      return;
    }
    if (!screenshotName) {
      toast.error("Upload payment screenshot");
      return;
    }

    setSubmitting(true);
    const orderId = placeOrder({
      items: [...cartItems],
      total: orderTotalFromItems(cartItems),
      address,
      paymentMethod: method,
      paymentReference: ref,
      paymentScreenshotName: screenshotName,
    });

    clearCart();
    setSubmitting(false);
    router.push(`/checkout/success?orderId=${encodeURIComponent(orderId)}`);
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
                <Image
                  src={PAYMENT_QR_SRC}
                  alt="Scan to pay Royal Furniture Pro"
                  width={200}
                  height={200}
                  className="payment-qr-block__img"
                  priority
                />
              </div>
              <div className="payment-qr-block__bank">
                <h2 className="payment-qr-block__title">Bank details</h2>
                <dl className="payment-bank-dl">
                  <div>
                    <dt>Account name</dt>
                    <dd>{BANK_DETAILS.accountName}</dd>
                  </div>
                  <div>
                    <dt>Bank</dt>
                    <dd>{BANK_DETAILS.bankName}</dd>
                  </div>
                  <div>
                    <dt>Account no.</dt>
                    <dd>{BANK_DETAILS.accountNumber}</dd>
                  </div>
                  <div>
                    <dt>IFSC</dt>
                    <dd>{BANK_DETAILS.ifsc}</dd>
                  </div>
                  <div>
                    <dt>UPI ID</dt>
                    <dd>{BANK_DETAILS.upiId}</dd>
                  </div>
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
                />
                <p className="payment-form__hint">{hint}</p>
              </div>

              <div className="payment-form__field">
                <label htmlFor="payment-screenshot">Payment screenshot</label>
                <input
                  id="payment-screenshot"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFile}
                  className="payment-form__file"
                />
                {screenshotName && (
                  <p className="payment-form__file-name">Attached: {screenshotName}</p>
                )}
              </div>

              <button
                type="submit"
                className="payment-form__submit"
                disabled={submitting}
              >
                {submitting ? "Submitting…" : "Confirm payment & place order"}
              </button>
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
