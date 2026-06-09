import { Suspense } from "react";
import type { Metadata } from "next";
import { TrackOrderContent } from "@/components/checkout/track-order-content";

export const metadata: Metadata = {
  title: "Track Order | Royal Furniture Pro",
  description: "Track your furniture order status",
};

function TrackFallback() {
  return (
    <main className="track-order-page">
      <div className="track-order-page__hero-inner royal-section-inner">
        <p>Loading…</p>
      </div>
    </main>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<TrackFallback />}>
      <TrackOrderContent />
    </Suspense>
  );
}
