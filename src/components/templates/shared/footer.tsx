"use client";

import config from "@/lib/config";
import { Zap } from "lucide-react";

export function FooterBar() {
  return (
    <footer className="border-t border-white/[0.06] px-6 py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2">
          <div
            className="h-6 w-6 rounded-md flex items-center justify-center"
            style={{
              background:
                "linear-gradient(to bottom right, var(--brand-primary), var(--brand-accent))",
            }}
          >
            <Zap className="h-3 w-3 text-white" />
          </div>
          <span className="text-sm font-medium">{config.name}</span>
        </div>
        <p className="text-xs text-zinc-600">
          &copy; {new Date().getFullYear()} {config.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
