"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AdminOrderNotificationStack } from "@/components/admin/notifications/admin-order-notification-popup";
import type { AdminOrderNotificationPayload } from "@/components/admin/notifications/admin-order-notification-types";
import {
  playOrderRingtoneForDuration,
  stopOrderRingtone,
  unlockOrderRingtone,
} from "@/lib/audio/play-order-ringtone";
import { subscribeAdminOrderNotifications } from "@/lib/websocket/admin-order-ws-client";

const SOUND_DURATION_MS = 10_000;

export type { AdminOrderNotificationPayload } from "@/components/admin/notifications/admin-order-notification-types";

export function AdminOrderNotificationListener() {
  const stopSoundRef = useRef<(() => void) | null>(null);

  const [queue, setQueue] = useState<AdminOrderNotificationPayload[]>([]);
  const [isSoundPlaying, setIsSoundPlaying] = useState(false);

  const muteSound = useCallback(() => {
    stopSoundRef.current?.();
    stopSoundRef.current = null;
    stopOrderRingtone();
    setIsSoundPlaying(false);
  }, []);

  const startSound = useCallback(() => {
    stopSoundRef.current?.();
    stopSoundRef.current = playOrderRingtoneForDuration(SOUND_DURATION_MS);
    setIsSoundPlaying(true);
    window.setTimeout(() => {
      setIsSoundPlaying(false);
      stopSoundRef.current = null;
    }, SOUND_DURATION_MS);
  }, []);

  const startSoundRef = useRef(startSound);
  startSoundRef.current = startSound;

  const enqueueNotification = useCallback((payload: AdminOrderNotificationPayload) => {
    let shouldPlay = false;

    setQueue((prev) => {
      const isDuplicateInQueue = prev.some(
        (item) => item.orderId === payload.orderId && item.action === payload.action,
      );
      if (isDuplicateInQueue) return prev;

      shouldPlay = prev.length === 0;
      return [...prev, payload];
    });

    if (shouldPlay) {
      startSoundRef.current();
    }

    window.dispatchEvent(
      new CustomEvent<AdminOrderNotificationPayload>("admin-order-notification", {
        detail: payload,
      }),
    );
  }, []);

  const enqueueRef = useRef(enqueueNotification);
  enqueueRef.current = enqueueNotification;

  const dismissCurrent = useCallback(() => {
    muteSound();
    setQueue((prev) => {
      const next = prev.slice(1);
      if (next.length > 0) {
        window.setTimeout(() => startSoundRef.current(), 0);
      }
      return next;
    });
  }, [muteSound]);

  useEffect(() => {
    const onInteract = () => unlockOrderRingtone();
    window.addEventListener("pointerdown", onInteract);
    window.addEventListener("keydown", onInteract);
    unlockOrderRingtone();

    const unsubscribe = subscribeAdminOrderNotifications((payload) => {
      enqueueRef.current(payload);
    });

    return () => {
      window.removeEventListener("pointerdown", onInteract);
      window.removeEventListener("keydown", onInteract);
      unsubscribe();
      muteSound();
    };
  }, [muteSound]);

  return (
    <AdminOrderNotificationStack
      queue={queue}
      isSoundPlaying={isSoundPlaying}
      onDismissCurrent={dismissCurrent}
      onMute={muteSound}
    />
  );
}
