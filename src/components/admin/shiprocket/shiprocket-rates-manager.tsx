"use client";

import { useMemo, useState } from "react";
import { MapPin } from "lucide-react";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { royalToast } from "@/lib/toast/royal-toast";
import { fetchShiprocketRates } from "@/services/shiprocket-api";

type CourierRow = Record<string, unknown>;

function formatInr(amount: unknown): string {
  const value = Number(amount);
  if (!Number.isFinite(value)) return "—";
  return value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function getCourierRate(courier: CourierRow): number {
  return Number(courier.rate ?? courier.freight_charge ?? courier.cost ?? NaN);
}

function formatCourierMeta(courier: CourierRow): string {
  const parts: string[] = [];
  const rating = courier.rating;
  if (rating != null && rating !== "" && Number.isFinite(Number(rating))) {
    parts.push(`${Number(rating).toFixed(1)} ★`);
  }
  const days = courier.estimated_delivery_days ?? courier.etd;
  if (days != null && String(days).trim() !== "") {
    const dayText = String(days);
    parts.push(
      dayText.toLowerCase().includes("day")
        ? `EDD ${dayText}`
        : `EDD within ${dayText} days`,
    );
  } else if (courier.edd) {
    parts.push(`EDD ${String(courier.edd)}`);
  }
  return parts.join(" ");
}

export function ShiprocketRatesManager() {
  const [pickupPostcode, setPickupPostcode] = useState("");
  const [deliveryPostcode, setDeliveryPostcode] = useState("");
  const [weight, setWeight] = useState("1");
  const [shipmentValue, setShipmentValue] = useState("");
  const [lengthCm, setLengthCm] = useState("");
  const [breadthCm, setBreadthCm] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [cod, setCod] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);

  const couriers = useMemo(() => {
    const list =
      (result?.data as { available_courier_companies?: CourierRow[] } | undefined)
        ?.available_courier_companies ?? [];
    if (!Array.isArray(list)) return [];
    return [...list].sort((a, b) => getCourierRate(a) - getCourierRate(b));
  }, [result]);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickupPostcode.trim() || !deliveryPostcode.trim()) {
      royalToast.error("Enter pickup and delivery pincodes");
      return;
    }
    setLoading(true);
    try {
      const data = await fetchShiprocketRates({
        pickupPostcode: pickupPostcode.trim(),
        deliveryPostcode: deliveryPostcode.trim(),
        weight: Math.max(0.5, Number(weight) || 1),
        cod,
        lengthCm: lengthCm ? Number(lengthCm) : undefined,
        breadthCm: breadthCm ? Number(breadthCm) : undefined,
        heightCm: heightCm ? Number(heightCm) : undefined,
      });
      setResult(data);
    } catch (error) {
      setResult(null);
      royalToast.error(getApiErrorMessage(error, "Rate calculation failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sr-rates">
      <div className="sr-rates__calc-card">
        <h2 className="sr-rates__title">Calculate Your Shipping Rates</h2>

        <form className="sr-rates__form" onSubmit={handleCalculate}>
          <div className="sr-rates__pincode-row">
            <div className="sr-rates__field">
              <label className="sr-rates__label" htmlFor="sr-pickup-pincode">
                <MapPin className="sr-rates__pin sr-rates__pin--pickup" aria-hidden />
                Pickup Pincode
              </label>
              <input
                id="sr-pickup-pincode"
                className="sr-rates__input"
                value={pickupPostcode}
                onChange={(e) =>
                  setPickupPostcode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="Enter pincode"
                inputMode="numeric"
                autoComplete="postal-code"
              />
            </div>

            <div className="sr-rates__pincode-connector" aria-hidden>
              <span />
            </div>

            <div className="sr-rates__field">
              <label className="sr-rates__label" htmlFor="sr-delivery-pincode">
                <MapPin className="sr-rates__pin sr-rates__pin--delivery" aria-hidden />
                Delivery Pincode
              </label>
              <input
                id="sr-delivery-pincode"
                className="sr-rates__input"
                value={deliveryPostcode}
                onChange={(e) =>
                  setDeliveryPostcode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="Enter pincode"
                inputMode="numeric"
                autoComplete="postal-code"
              />
            </div>
          </div>

          <div className="sr-rates__field">
            <label className="sr-rates__label" htmlFor="sr-weight">
              Package Weight
            </label>
            <div className="sr-rates__input-affix sr-rates__input-affix--suffix">
              <input
                id="sr-weight"
                className="sr-rates__input"
                type="number"
                min={0.5}
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
              <span className="sr-rates__affix">kg</span>
            </div>
            <p className="sr-rates__hint">Min. chargeable wt is 0.5kg</p>
          </div>

          <div className="sr-rates__field">
            <label className="sr-rates__label" htmlFor="sr-shipment-value">
              Shipment Value (₹)
            </label>
            <div className="sr-rates__input-affix sr-rates__input-affix--prefix">
              <span className="sr-rates__affix">₹</span>
              <input
                id="sr-shipment-value"
                className="sr-rates__input"
                type="number"
                min={0}
                step="1"
                value={shipmentValue}
                onChange={(e) => setShipmentValue(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>

          <button
            type="button"
            className="sr-rates__advanced-toggle"
            onClick={() => setShowAdvanced((open) => !open)}
            aria-expanded={showAdvanced}
          >
            {showAdvanced ? "Hide" : "Show"} package dimensions &amp; COD
          </button>

          {showAdvanced ? (
            <div className="sr-rates__advanced">
              <div className="sr-rates__dims-grid">
                <div className="sr-rates__field">
                  <label className="sr-rates__label" htmlFor="sr-length">
                    Length (cm)
                  </label>
                  <input
                    id="sr-length"
                    className="sr-rates__input"
                    type="number"
                    min={0}
                    step="0.1"
                    value={lengthCm}
                    onChange={(e) => setLengthCm(e.target.value)}
                    placeholder="Optional"
                  />
                </div>
                <div className="sr-rates__field">
                  <label className="sr-rates__label" htmlFor="sr-breadth">
                    Breadth (cm)
                  </label>
                  <input
                    id="sr-breadth"
                    className="sr-rates__input"
                    type="number"
                    min={0}
                    step="0.1"
                    value={breadthCm}
                    onChange={(e) => setBreadthCm(e.target.value)}
                    placeholder="Optional"
                  />
                </div>
                <div className="sr-rates__field">
                  <label className="sr-rates__label" htmlFor="sr-height">
                    Height (cm)
                  </label>
                  <input
                    id="sr-height"
                    className="sr-rates__input"
                    type="number"
                    min={0}
                    step="0.1"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    placeholder="Optional"
                  />
                </div>
              </div>
              <label className="sr-rates__cod">
                <input
                  type="checkbox"
                  checked={cod}
                  onChange={(e) => setCod(e.target.checked)}
                />
                Cash on delivery (COD)
              </label>
            </div>
          ) : null}

          <button type="submit" className="sr-rates__submit" disabled={loading}>
            {loading ? "Calculating…" : "Calculate Rates"}
          </button>
        </form>
      </div>

      {couriers.length > 0 ? (
        <div className="sr-rates__results-card">
          <h3 className="sr-rates__results-title">Serviceable Courier Partners</h3>
          <ul className="sr-rates__courier-list">
            {couriers.map((courier, index) => {
              const meta = formatCourierMeta(courier);
              const rate = getCourierRate(courier);
              return (
                <li
                  key={String(
                    courier.courier_company_id ?? courier.courier_name ?? index,
                  )}
                  className="sr-rates__courier-item"
                >
                  <div className="sr-rates__courier-info">
                    <p className="sr-rates__courier-name">
                      {String(courier.courier_name ?? "Courier")}
                    </p>
                    {meta ? <p className="sr-rates__courier-meta">{meta}</p> : null}
                  </div>
                  <p className="sr-rates__courier-price">
                    ₹{formatInr(Number.isFinite(rate) ? rate : courier.rate)}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      ) : result && !loading ? (
        <div className="sr-rates__results-card sr-rates__results-card--empty">
          <h3 className="sr-rates__results-title">Serviceable Courier Partners</h3>
          <p className="sr-rates__empty">
            No courier partners available for this route.
          </p>
        </div>
      ) : null}
    </div>
  );
}
