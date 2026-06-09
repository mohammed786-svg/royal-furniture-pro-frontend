"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { AccountShell } from "@/components/account/account-shell";
import { AddressForm } from "@/components/checkout/address-form";
import { useAddressStore } from "@/lib/store/address-store";
import { royalToast } from "@/lib/toast/royal-toast";

export function AccountAddressesContent() {
  const addresses = useAddressStore((s) => s.addresses);
  const addAddress = useAddressStore((s) => s.addAddress);
  const updateAddress = useAddressStore((s) => s.updateAddress);
  const removeAddress = useAddressStore((s) => s.removeAddress);
  const addressLabel = useAddressStore((s) => s.addressLabel);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <AccountShell
      title="Saved Addresses"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "My Account", href: "/account" },
        { label: "Saved Addresses" },
      ]}
    >
      <p className="account-lead">Manage delivery addresses for furniture orders.</p>

      <ul className="account-address-list">
        {addresses.map((addr) => (
          <li key={addr.id} className="account-address-card">
            <span className="account-address-card__badge">{addressLabel(addr)}</span>
            <p className="account-address-card__name">{addr.fullName}</p>
            <p>
              {addr.line1}
              {addr.line2 ? `, ${addr.line2}` : ""}
            </p>
            <p>
              {addr.city}, {addr.state} — {addr.pincode}
            </p>
            <p>+91 {addr.phone}</p>
            <div className="account-address-card__actions">
              <button
                type="button"
                className="account-icon-btn"
                aria-label="Edit"
                onClick={() => {
                  setEditingId(addr.id);
                  setShowForm(true);
                }}
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="account-icon-btn account-icon-btn--danger"
                aria-label="Remove"
                onClick={() => {
                  removeAddress(addr.id);
                  royalToast.success("Address removed");
                }}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {!showForm && (
        <button
          type="button"
          className="account-add-btn"
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
        <div className="account-form-panel">
          <h2>{editingId ? "Edit address" : "Add address"}</h2>
          <AddressForm
            initial={editingId ? addresses.find((a) => a.id === editingId) : undefined}
            onCancel={() => {
              setShowForm(false);
              setEditingId(null);
            }}
            onSubmit={(input) => {
              if (editingId) {
                updateAddress(editingId, input);
                royalToast.success("Address updated");
              } else {
                addAddress(input);
                royalToast.success("Address saved");
              }
              setShowForm(false);
              setEditingId(null);
            }}
          />
        </div>
      )}
    </AccountShell>
  );
}
