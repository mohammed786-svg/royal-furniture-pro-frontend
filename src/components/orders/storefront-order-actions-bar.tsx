"use client";

import { useState } from "react";
import { OrderActionDialog } from "@/components/orders/order-action-dialog";
import { getApiErrorMessage } from "@/lib/api/api-error";
import type { OrderActionsInfo } from "@/lib/orders/order-reasons";
import { royalToast } from "@/lib/toast/royal-toast";
import {
  cancelStorefrontOrder,
  returnExchangeStorefrontOrder,
} from "@/services/storefront-commerce";

type DialogMode = "cancel" | "return" | "exchange" | null;

type Props = {
  orderNumber: string;
  actions: OrderActionsInfo | null | undefined;
  onActionComplete?: () => void;
};

export function StorefrontOrderActionsBar({
  orderNumber,
  actions,
  onActionComplete,
}: Props) {
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!actions) return null;

  const { canCancel, canReturn, canExchange } = actions;
  if (!canCancel && !canReturn && !canExchange) return null;

  async function handleSubmit(payload: { reasonCode: string; reasonText: string }) {
    setSubmitting(true);
    try {
      if (dialogMode === "cancel") {
        await cancelStorefrontOrder({ orderNumber, ...payload });
        royalToast.success("Order cancelled");
      } else {
        await returnExchangeStorefrontOrder({
          orderNumber,
          requestType: dialogMode === "exchange" ? "EXCHANGE" : "RETURN",
          ...payload,
        });
        royalToast.success(
          dialogMode === "exchange"
            ? "Exchange request submitted"
            : "Return request submitted",
        );
      }
      setDialogMode(null);
      onActionComplete?.();
    } catch (error) {
      royalToast.error(getApiErrorMessage(error, "Action failed"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="storefront-order-actions">
      {canCancel ? (
        <button
          type="button"
          className="storefront-order-actions__btn storefront-order-actions__btn--danger"
          onClick={() => setDialogMode("cancel")}
        >
          Cancel order
        </button>
      ) : null}
      {canReturn ? (
        <button
          type="button"
          className="storefront-order-actions__btn"
          onClick={() => setDialogMode("return")}
        >
          Return
        </button>
      ) : null}
      {canExchange ? (
        <button
          type="button"
          className="storefront-order-actions__btn"
          onClick={() => setDialogMode("exchange")}
        >
          Exchange
        </button>
      ) : null}

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
        onSubmit={handleSubmit}
      />
    </div>
  );
}
