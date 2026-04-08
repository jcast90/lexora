"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[dashboard] Unhandled error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4">
      <h2 className="text-xl font-semibold text-white">Something went wrong</h2>
      <p className="mt-2 text-sm text-white/60">{error.message}</p>
      {error.digest && (
        <p className="mt-1 text-xs text-white/30">Error ID: {error.digest}</p>
      )}
      <Button
        onClick={reset}
        className="mt-6"
        variant="outline"
      >
        Try again
      </Button>
    </div>
  );
}
