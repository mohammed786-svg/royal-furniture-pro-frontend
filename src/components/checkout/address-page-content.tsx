"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { CheckoutStepper } from "@/components/cart/checkout-stepper";
import { CategoryBreadcrumbs } from "@/components/category/category-breadcrumbs";
import { AddressForm } from "@/components/checkout/address-form";
import { CheckoutOrderSummary } from "@/components/checkout/checkout-order-summary";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { useAddressStore } from "@/lib/store/address-store";
import { useAuthStore } from "@/lib/store/auth-store";
import { useCartStore } from "@/lib/store/cart-store";

export function AddressPageContent() {
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);
  const hydrateAddresses = useAddressStore((s) => s.hydrate);
  const cartItems = useCartStore((s) => s.cartItems);
  const addresses = useAddressStore((s) => s.addresses);
  const selectedAddressId = useAddressStore((s) => s.selectedAddressId);
  const setSelectedAddressId = useAddressStore((s) => s.setSelectedAddressId);
  const addAddress = useAddressStore((s) => s.addAddress);
  const updateAddress = useAddressStore((s) => s.updateAddress);
  const removeAddress = useAddressStore((s) => s.removeAddress);
  const addressLabel = useAddressStore((s) => s.addressLabel);

  const [showForm, setShowForm] = useState(addresses.length === 0);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (accessToken) {
      void hydrateAddresses();
    }
  }, [accessToken, hydrateAddresses]);

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      setSelectedAddressId(addresses[0].id);
    }
  }, [addresses, selectedAddressId, setSelectedAddressId]);

  if (!accessToken) {
    return (
      <main className="cart-page">
        <div className="cart-page__inner royal-section-inner">
          <p className="cart-page__empty">
            Please{" "}
            <Link href="/login" className="cart-page__empty-link">
              sign in
            </Link>{" "}
            to manage delivery addresses.
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

  const canProceed = Boolean(
    selectedAddressId && addresses.some((a) => a.id === selectedAddressId),
  );

  return (
    <main className="cart-page checkout-page">
      <div className="cart-page__inner royal-section-inner">
        <CategoryBreadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Cart", href: "/cart" },
            { label: "Address", href: "/checkout/address" },
          ]}
        />

        <CheckoutStepper activeStep={2} />

        <div className="cart-page__layout">
          <section className="cart-page__main checkout-panel">
            <h1 className="cart-page__title">Delivery address</h1>

            {addresses.length > 0 && (
              <ul className="address-list">
                {addresses.map((addr) => {
                  const selected = addr.id === selectedAddressId;
                  return (
                    <li
                      key={addr.id}
                      className={`address-card${selected ? " address-card--selected" : ""}`}
                    >
                      <label className="address-card__select">
                        <input
                          type="radio"
                          name="selected-address"
                          checked={selected}
                          onChange={() => setSelectedAddressId(addr.id)}
                        />
                        <span className="address-card__radio" aria-hidden />
                        <div className="address-card__body">
                          <span className="address-card__badge">
                            {addressLabel(addr)}
                          </span>
                          <p className="address-card__name">{addr.fullName}</p>
                          <p className="address-card__lines">
                            {addr.line1}
                            {addr.line2 ? `, ${addr.line2}` : ""}
                          </p>
                          <p className="address-card__city">
                            {addr.city}, {addr.state} — {addr.pincode}
                          </p>
                          <p className="address-card__phone">+91 {addr.phone}</p>
                        </div>
                      </label>
                      <div className="address-card__actions">
                        <button
                          type="button"
                          className="address-card__icon-btn"
                          aria-label="Edit address"
                          onClick={() => {
                            setEditingId(addr.id);
                            setShowForm(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          className="address-card__icon-btn address-card__icon-btn--danger"
                          aria-label="Remove address"
                          onClick={async () => {
                            try {
                              await removeAddress(addr.id);
                            } catch (error) {
                              toast.error(
                                getApiErrorMessage(error, "Could not remove address"),
                              );
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}

            {!showForm && (
              <button
                type="button"
                className="address-add-btn"
                onClick={() => {
                  setEditingId(null);
                  setShowForm(true);
                }}
              >
                <Plus className="h-4 w-4" />
                Add new address
              </button>
            )}

            {showForm && (
              <div className="address-form-panel">
                <h2 className="address-form-panel__title">
                  <MapPin className="h-5 w-5" />
                  {editingId ? "Edit address" : "Add address"}
                </h2>
                <AddressForm
                  initial={
                    editingId ? addresses.find((a) => a.id === editingId) : undefined
                  }
                  onCancel={
                    addresses.length > 0
                      ? () => {
                          setShowForm(false);
                          setEditingId(null);
                        }
                      : undefined
                  }
                  onSubmit={async (input) => {
                    try {
                      if (editingId) {
                        await updateAddress(editingId, input);
                      } else {
                        const id = await addAddress(input);
                        setSelectedAddressId(id);
                      }
                      setShowForm(false);
                      setEditingId(null);
                    } catch (error) {
                      toast.error(getApiErrorMessage(error, "Could not save address"));
                    }
                  }}
                />
              </div>
            )}

            <div className="checkout-panel__nav">
              <Link href="/cart" className="checkout-panel__back">
                ← Back to cart
              </Link>
            </div>
          </section>

          <CheckoutOrderSummary
            items={cartItems}
            proceedLabel="Continue to payment"
            proceedDisabled={!canProceed}
            onProceed={() => {
              if (canProceed) router.push("/checkout/payment");
            }}
          />
        </div>
      </div>
    </main>
  );
}
