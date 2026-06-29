"use client";

import { useCallback, useEffect, useState } from "react";
import { OrderActionDialog } from "@/components/orders/order-action-dialog";
import { getApiErrorMessage } from "@/lib/api/api-error";
import type { OrderActionsInfo } from "@/lib/orders/order-reasons";
import { royalToast } from "@/lib/toast/royal-toast";
import {
  assignOrderAwb,
  cancelOrder,
  fetchOrderActions,
  returnExchangeOrder,
} from "@/services/orders-api";
import type { OrderDetail } from "@/types/orders";

type DialogMode = "cancel" | "return" | "exchange" | null;

type Props = {
  orderId: string;
  order: OrderDetail;
  onOrderUpdated: (order: OrderDetail) => void;
};

export function OrderLifecyclePanel({ orderId, order, onOrderUpdated }: Props) {
  const [actions, setActions] = useState<OrderActionsInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadActions = useCallback(async () => {
    try {
      const data = await fetchOrderActions(orderId);
      setActions(data);
    } catch {
      setActions(null);
    }
  }, [orderId]);

  useEffect(() => {
    void loadActions();
  }, [loadActions, order.currentStatus]);

  async function handleGenerateAwb() {
    setLoading(true);
    try {
      const updated = await assignOrderAwb(orderId);
      onOrderUpdated(updated);
      royalToast.success("AWB generated via Shiprocket");
      await loadActions();
    } catch (error) {
      royalToast.error(getApiErrorMessage(error, "Could not generate AWB"));
    } finally {
      setLoading(false);
    }
  }

  async function handleDialogSubmit(payload: {
    reasonCode: string;
    reasonText: string;
  }) {
    setSubmitting(true);
    try {
      if (dialogMode === "cancel") {
        const updated = await cancelOrder(orderId, payload);
        onOrderUpdated(updated);
        royalToast.success("Order cancelled");
      } else if (dialogMode === "return" || dialogMode === "exchange") {
        const updated = await returnExchangeOrder(orderId, {
          ...payload,
          requestType: dialogMode === "exchange" ? "EXCHANGE" : "RETURN",
        });
        onOrderUpdated(updated);
        royalToast.success(
          dialogMode === "exchange"
            ? "Exchange request submitted"
            : "Return request submitted",
        );
      }
      setDialogMode(null);
      await loadActions();
    } catch (error) {
      royalToast.error(getApiErrorMessage(error, "Action failed"));
    } finally {
      setSubmitting(false);
    }
  }

  const canCancel = actions?.canCancel ?? false;
  const canAwb = actions?.canGenerateAwb ?? false;
  const canReturn = actions?.canReturn ?? false;
  const canExchange = actions?.canExchange ?? false;

  if (!canCancel && !canAwb && !canReturn && !canExchange) {
    return order.cancelReason ? (
      <div className="order-lifecycle-panel">
        <p className="order-lifecycle-panel__note">
          <strong>Cancel reason:</strong> {order.cancelReason}
        </p>
      </div>
    ) : null;
  }

  return (
    <div className="order-lifecycle-panel">
      <h4 className="order-lifecycle-panel__title">Order actions</h4>
      <div className="order-lifecycle-panel__buttons">
        {canCancel ? (
          <button
            type="button"
            className="order-lifecycle-panel__btn order-lifecycle-panel__btn--danger"
            onClick={() => setDialogMode("cancel")}
          >
            Cancel order
          </button>
        ) : null}
        {canAwb ? (
          <button
            type="button"
            className="order-lifecycle-panel__btn"
            disabled={loading}
            onClick={() => void handleGenerateAwb()}
          >
            {loading ? "Generating AWB…" : "Generate AWB"}
          </button>
        ) : null}
        {canReturn ? (
          <button
            type="button"
            className="order-lifecycle-panel__btn"
            onClick={() => setDialogMode("return")}
          >
            Request return
          </button>
        ) : null}
        {canExchange ? (
          <button
            type="button"
            className="order-lifecycle-panel__btn"
            onClick={() => setDialogMode("exchange")}
          >
            Request exchange
          </button>
        ) : null}
      </div>

      <OrderActionDialog
        open={dialogMode !== null}
        title={
          dialogMode === "cancel"
            ? "Cancel order"
            : dialogMode === "exchange"
              ? "Request exchange"
              : "Request return"
        }
        submitLabel={
          dialogMode === "cancel"
            ? "Cancel order"
            : dialogMode === "exchange"
              ? "Submit exchange request"
              : "Submit return request"
        }
        loading={submitting}
        onClose={() => setDialogMode(null)}
        onSubmit={handleDialogSubmit}
      />
    </div>
  );
}
