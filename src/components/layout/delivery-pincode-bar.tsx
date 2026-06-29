"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Crosshair, MapPin, Pencil, X } from "lucide-react";
import { resolveDeliveryPincode } from "@/lib/delivery/resolve-pincode";
import { isValidPincode, useDeliveryStore } from "@/lib/store/delivery-store";
import { royalToast } from "@/lib/toast/royal-toast";

export function DeliveryPincodeBar() {
  const pincode = useDeliveryStore((s) => s.pincode);
  const cityLabel = useDeliveryStore((s) => s.cityLabel);
  const isDetecting = useDeliveryStore((s) => s.isDetecting);
  const setPincode = useDeliveryStore((s) => s.setPincode);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(pincode);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!editing) setDraft(pincode);
  }, [pincode, editing]);

  useEffect(() => {
    if (editing) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [editing]);

  const startEdit = () => {
    setDraft(pincode);
    setEditing(true);
  };

  const cancelEdit = () => {
    setDraft(pincode);
    setEditing(false);
  };

  const savePincode = () => {
    const value = draft.replace(/\D/g, "").slice(0, 6);
    if (!isValidPincode(value)) {
      royalToast.error("Enter a valid 6-digit pincode");
      return;
    }
    setPincode(value, "manual");
    setEditing(false);
    royalToast.success(`Delivery pincode updated to ${value}`);
  };

  const detectLocation = async () => {
    const found = await resolveDeliveryPincode({ force: true, preferGeo: true });
    if (found) {
      const next = useDeliveryStore.getState();
      royalToast.success(
        next.cityLabel
          ? `Detected ${next.cityLabel} · ${next.pincode}`
          : `Detected pincode ${next.pincode}`,
      );
      return;
    }
    royalToast.error("Could not detect your pincode. Please enter it manually.");
  };

  const displayValue = cityLabel ? `${cityLabel} · ${pincode}` : pincode;

  return (
    <div className="delivery-pincode-bar">
      <MapPin className="delivery-pincode-bar__icon" aria-hidden />
      <span className="delivery-pincode-bar__label">Deliver to -</span>

      {editing ? (
        <div className="delivery-pincode-bar__edit">
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={draft}
            onChange={(e) => setDraft(e.target.value.replace(/\D/g, ""))}
            onKeyDown={(e) => {
              if (e.key === "Enter") savePincode();
              if (e.key === "Escape") cancelEdit();
            }}
            className="delivery-pincode-bar__input"
            aria-label="Delivery pincode"
            placeholder="6-digit pincode"
          />
          <button
            type="button"
            className="delivery-pincode-bar__action delivery-pincode-bar__action--save"
            aria-label="Save pincode"
            onClick={savePincode}
          >
            <Check className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            className="delivery-pincode-bar__action"
            aria-label="Cancel"
            onClick={cancelEdit}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <>
          <span className="delivery-pincode-bar__value">
            {isDetecting ? "Detecting…" : displayValue}
          </span>
          <button
            type="button"
            className="delivery-pincode-bar__pencil"
            aria-label="Detect my location"
            title="Detect my location"
            onClick={() => void detectLocation()}
            disabled={isDetecting}
          >
            <Crosshair className="h-3 w-3" />
          </button>
          <button
            type="button"
            className="delivery-pincode-bar__pencil"
            aria-label="Edit pincode"
            title="Change pincode"
            onClick={startEdit}
            disabled={isDetecting}
          >
            <Pencil className="h-3 w-3" />
          </button>
        </>
      )}
    </div>
  );
}
