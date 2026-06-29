"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { royalToast } from "@/lib/toast/royal-toast";
import { fetchShiprocketOrder } from "@/services/shiprocket-api";

type Props = { shiprocketOrderId: string };

export function ShiprocketOrderDetailPage({ shiprocketOrderId }: Props) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const result = await fetchShiprocketOrder(shiprocketOrderId);
        if (active) setData(result);
      } catch (error) {
        if (active) {
          royalToast.error(getApiErrorMessage(error, "Failed to load order"));
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [shiprocketOrderId]);

  return (
    <div className="admin-product-form-page">
      <Link href="/my-admin/shiprocket/orders" className="admin-back-link">
        <ArrowLeft className="h-4 w-4" />
        Back to Shiprocket orders
      </Link>
      <h1>Shiprocket order {shiprocketOrderId}</h1>
      {loading ? (
        <p>Loading…</p>
      ) : data ? (
        <pre className="admin-json-preview">{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p>Order not found.</p>
      )}
    </div>
  );
}
