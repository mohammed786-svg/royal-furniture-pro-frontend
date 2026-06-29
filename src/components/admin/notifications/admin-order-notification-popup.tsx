"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, BellRing, Package, User, VolumeX, X } from "lucide-react";
import {
  getOrderNotificationMeta,
  type AdminOrderNotificationPayload,
} from "@/components/admin/notifications/admin-order-notification-types";
import { formatCurrency } from "@/lib/admin/format-currency";

const SOUND_DURATION_MS = 10_000;

type Props = {
  payload: AdminOrderNotificationPayload;
  queueCount: number;
  onDismiss: () => void;
  onMute: () => void;
  isSoundPlaying: boolean;
};

export function AdminOrderNotificationPopup({
  payload,
  queueCount,
  onDismiss,
  onMute,
  isSoundPlaying,
}: Props) {
  const router = useRouter();
  const [elapsed, setElapsed] = useState(0);
  const meta = getOrderNotificationMeta(payload);

  useEffect(() => {
    if (!isSoundPlaying) {
      setElapsed(SOUND_DURATION_MS);
      return;
    }

    setElapsed(0);
    const started = Date.now();
    const tick = window.setInterval(() => {
      const next = Date.now() - started;
      setElapsed(Math.min(next, SOUND_DURATION_MS));
      if (next >= SOUND_DURATION_MS) window.clearInterval(tick);
    }, 50);

    return () => window.clearInterval(tick);
  }, [isSoundPlaying, payload.orderId, payload.timestamp]);

  const progress = isSoundPlaying
    ? Math.min(100, (elapsed / SOUND_DURATION_MS) * 100)
    : 100;

  function handleViewOrder() {
    onMute();
    onDismiss();
    router.push(`/my-admin/orders/${payload.orderId}`);
  }

  function handleDismiss() {
    onMute();
    onDismiss();
  }

  return (
    <motion.div
      className="admin-order-alert"
      role="alertdialog"
      aria-labelledby="admin-order-alert-title"
      aria-describedby="admin-order-alert-desc"
      initial={{ opacity: 0, x: 80, scale: 0.92 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
    >
      <div className="admin-order-alert__glow" aria-hidden />
      <div className={`admin-order-alert__card admin-order-alert__card--${meta.tone}`}>
        <div className="admin-order-alert__header">
          <div
            className={`admin-order-alert__icon ${isSoundPlaying ? "is-ringing" : ""}`}
          >
            <BellRing className="h-6 w-6" strokeWidth={1.75} />
            {isSoundPlaying ? <span className="admin-order-alert__pulse" /> : null}
          </div>
          <div className="admin-order-alert__titles">
            <p className="admin-order-alert__eyebrow">Live order alert</p>
            <h2 id="admin-order-alert-title" className="admin-order-alert__title">
              {meta.label}
            </h2>
          </div>
          <button
            type="button"
            className="admin-order-alert__close"
            onClick={handleDismiss}
            aria-label="Dismiss notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div id="admin-order-alert-desc" className="admin-order-alert__body">
          <div className="admin-order-alert__order-ref">
            <Package className="h-4 w-4" />
            <strong>{payload.orderNumber}</strong>
          </div>
          {payload.customerName ? (
            <p className="admin-order-alert__row">
              <User className="h-3.5 w-3.5" />
              <span>{payload.customerName}</span>
            </p>
          ) : null}
          {typeof payload.totalAmount === "number" ? (
            <p className="admin-order-alert__amount">
              {formatCurrency(payload.totalAmount)}
            </p>
          ) : null}
          {payload.statusName || payload.status ? (
            <span className="admin-order-alert__status-pill">
              {payload.statusName || payload.status}
            </span>
          ) : null}
        </div>

        {isSoundPlaying ? (
          <div className="admin-order-alert__sound-bar" aria-hidden>
            <motion.div
              className="admin-order-alert__sound-bar-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        ) : null}

        <div className="admin-order-alert__actions">
          <button
            type="button"
            className="admin-order-alert__btn admin-order-alert__btn--ghost"
            onClick={onMute}
            disabled={!isSoundPlaying}
          >
            <VolumeX className="h-4 w-4" />
            Mute
          </button>
          <button
            type="button"
            className="admin-order-alert__btn admin-order-alert__btn--primary"
            onClick={handleViewOrder}
          >
            View order
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {queueCount > 1 ? (
          <p className="admin-order-alert__queue">+{queueCount - 1} more in queue</p>
        ) : null}
      </div>
    </motion.div>
  );
}

type StackProps = {
  queue: AdminOrderNotificationPayload[];
  isSoundPlaying: boolean;
  onDismissCurrent: () => void;
  onMute: () => void;
};

export function AdminOrderNotificationStack({
  queue,
  isSoundPlaying,
  onDismissCurrent,
  onMute,
}: StackProps) {
  const current = queue[0];
  if (!current) return null;

  return (
    <div className="admin-order-alert-stack">
      <AnimatePresence mode="wait">
        <AdminOrderNotificationPopup
          key={`${current.orderId}-${current.timestamp}-${current.action}`}
          payload={current}
          queueCount={queue.length}
          onDismiss={onDismissCurrent}
          onMute={onMute}
          isSoundPlaying={isSoundPlaying}
        />
      </AnimatePresence>
    </div>
  );
}
