import type { Metadata } from "next";
import { ErrorPageView } from "@/components/errors/error-page-view";

export const metadata: Metadata = {
  title: "Page Not Found | Royal Furniture Pro",
  description: "The page you are looking for could not be found",
};

export default function RootNotFound() {
  return <ErrorPageView variant="404" />;
}
