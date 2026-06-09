"use client";

import { useEffect } from "react";
import { ErrorPageView } from "@/components/errors/error-page-view";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function RootError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <ErrorPageView variant="500" onRetry={reset} />;
}
