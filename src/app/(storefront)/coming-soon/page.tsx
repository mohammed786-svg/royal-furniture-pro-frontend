import type { Metadata } from "next";
import { ErrorPageView } from "@/components/errors/error-page-view";

export const metadata: Metadata = {
  title: "Coming Soon | Royal Furniture Pro",
  description: "Something exciting is on the way from Royal Furniture Pro",
};

export default function ComingSoonPage() {
  return <ErrorPageView variant="coming-soon" embedded />;
}
