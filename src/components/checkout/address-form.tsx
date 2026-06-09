"use client";

import { useState } from "react";
import type {
  AddressType,
  NewAddressInput,
  SavedAddress,
} from "@/lib/store/address-store";
import {
  formatIndianMobileDisplay,
  indianMobileError,
  isValidIndianMobile,
  normalizeIndianMobile,
} from "@/lib/validators/indian-mobile";

const ADDRESS_TYPES: { value: AddressType; label: string }[] = [
  { value: "home", label: "Home" },
  { value: "office", label: "Office" },
  { value: "other", label: "Other" },
];

type AddressFormProps = {
  initial?: SavedAddress;
  onSubmit: (input: NewAddressInput) => void;
  onCancel?: () => void;
};

const emptyForm = (): NewAddressInput => ({
  type: "home",
  fullName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
});

export function AddressForm({ initial, onSubmit, onCancel }: AddressFormProps) {
  const [form, setForm] = useState<NewAddressInput>(
    initial
      ? {
          type: initial.type,
          customLabel: initial.customLabel,
          fullName: initial.fullName,
          phone: formatIndianMobileDisplay(normalizeIndianMobile(initial.phone)),
          line1: initial.line1,
          line2: initial.line2 ?? "",
          city: initial.city,
          state: initial.state,
          pincode: initial.pincode,
        }
      : emptyForm(),
  );
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof NewAddressInput>(
    key: K,
    value: NewAddressInput[K],
  ) => {
    setForm((f) => ({ ...f, [key]: value }));
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName.trim()) {
      setError("Enter full name");
      return;
    }
    const phoneErr = indianMobileError(form.phone);
    if (phoneErr) {
      setError(phoneErr);
      return;
    }
    if (!form.line1.trim() || !form.city.trim() || !form.state.trim()) {
      setError("Complete address, city and state");
      return;
    }
    if (!/^\d{6}$/.test(form.pincode.replace(/\D/g, ""))) {
      setError("Enter valid 6-digit pincode");
      return;
    }
    if (form.type === "other" && !form.customLabel?.trim()) {
      setError("Enter a title for Other address (e.g. Parents Home)");
      return;
    }

    onSubmit({
      ...form,
      phone: normalizeIndianMobile(form.phone),
      pincode: form.pincode.replace(/\D/g, "").slice(0, 6),
      customLabel: form.type === "other" ? form.customLabel?.trim() : undefined,
      line2: form.line2?.trim() || undefined,
    });
  };

  return (
    <form className="address-form" onSubmit={handleSubmit} noValidate>
      <fieldset className="address-form__types">
        <legend className="address-form__legend">Address type</legend>
        <div className="address-form__type-row">
          {ADDRESS_TYPES.map(({ value, label }) => (
            <label key={value} className="address-form__type-label">
              <input
                type="radio"
                name="addr-type"
                checked={form.type === value}
                onChange={() => update("type", value)}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {form.type === "other" && (
        <div className="address-form__field">
          <label htmlFor="addr-custom-label">Other title</label>
          <input
            id="addr-custom-label"
            type="text"
            placeholder="e.g. Parents Home, Warehouse"
            value={form.customLabel ?? ""}
            onChange={(e) => update("customLabel", e.target.value)}
            className="address-form__input"
          />
        </div>
      )}

      <div className="address-form__grid">
        <div className="address-form__field">
          <label htmlFor="addr-name">Full name</label>
          <input
            id="addr-name"
            type="text"
            value={form.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            className="address-form__input"
            autoComplete="name"
          />
        </div>
        <div className="address-form__field">
          <label htmlFor="addr-phone">Mobile</label>
          <input
            id="addr-phone"
            type="tel"
            inputMode="numeric"
            value={form.phone}
            onChange={(e) =>
              update(
                "phone",
                formatIndianMobileDisplay(normalizeIndianMobile(e.target.value)),
              )
            }
            className="address-form__input"
            placeholder="98989 89898"
          />
        </div>
        <div className="address-form__field address-form__field--full">
          <label htmlFor="addr-line1">Address line 1</label>
          <input
            id="addr-line1"
            type="text"
            value={form.line1}
            onChange={(e) => update("line1", e.target.value)}
            className="address-form__input"
            autoComplete="address-line1"
          />
        </div>
        <div className="address-form__field address-form__field--full">
          <label htmlFor="addr-line2">Address line 2 (optional)</label>
          <input
            id="addr-line2"
            type="text"
            value={form.line2 ?? ""}
            onChange={(e) => update("line2", e.target.value)}
            className="address-form__input"
            autoComplete="address-line2"
          />
        </div>
        <div className="address-form__field">
          <label htmlFor="addr-city">City</label>
          <input
            id="addr-city"
            type="text"
            value={form.city}
            onChange={(e) => update("city", e.target.value)}
            className="address-form__input"
          />
        </div>
        <div className="address-form__field">
          <label htmlFor="addr-state">State</label>
          <input
            id="addr-state"
            type="text"
            value={form.state}
            onChange={(e) => update("state", e.target.value)}
            className="address-form__input"
          />
        </div>
        <div className="address-form__field">
          <label htmlFor="addr-pin">Pincode</label>
          <input
            id="addr-pin"
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={form.pincode}
            onChange={(e) => update("pincode", e.target.value.replace(/\D/g, ""))}
            className="address-form__input"
          />
        </div>
      </div>

      {error && (
        <p className="address-form__error" role="alert">
          {error}
        </p>
      )}

      <div className="address-form__actions">
        {onCancel && (
          <button type="button" className="address-form__cancel" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="address-form__save"
          disabled={!isValidIndianMobile(form.phone)}
        >
          Save address
        </button>
      </div>
    </form>
  );
}
