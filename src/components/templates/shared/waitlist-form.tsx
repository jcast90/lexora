"use client";

import { useState, FormEvent } from "react";
import { resolveLandingConfig, isLiveMode } from "@/lib/config";
import { buildTrackingPayload } from "@/lib/analytics/events";
import { ArrowRight, Check, Loader2 } from "lucide-react";

type FormStatus = "idle" | "loading" | "success" | "error";

export function WaitlistForm({ className }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const { landing } = resolveLandingConfig();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, ...buildTrackingPayload() }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }
      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <div id="waitlist" className={className || "mx-auto mt-10 max-w-md"}>
      {status === "success" ? (
        <div className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-6 py-4 text-emerald-400">
          <Check className="h-5 w-5" />
          <span className="font-medium">
            You&apos;re on the list! We&apos;ll be in touch.
          </span>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.04] px-5 py-3.5 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-brand-primary/50 focus:bg-white/[0.06]"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold transition-all hover:shadow-lg disabled:opacity-60"
            style={{
              background:
                "linear-gradient(to right, var(--brand-primary), var(--brand-accent))",
            }}
          >
            {status === "loading" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                {landing.primaryCta ||
                  (isLiveMode ? "Try it Free" : "Join Waitlist")}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      )}
      {status === "error" && (
        <p className="mt-3 text-sm text-red-400">{errorMsg}</p>
      )}
      <p className="mt-4 text-xs text-zinc-600">
        No spam. Unsubscribe anytime.
      </p>
    </div>
  );
}

export function LiveCtaButtons() {
  const { landing } = resolveLandingConfig();
  return (
    <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
      <a
        href="/signup"
        className="inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-sm font-semibold transition-all hover:shadow-lg"
        style={{
          background:
            "linear-gradient(to right, var(--brand-primary), var(--brand-accent))",
        }}
      >
        {landing.primaryCta || "Try it Free"}
        <ArrowRight className="h-4 w-4" />
      </a>
      <a
        href="#pricing"
        className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-8 py-3.5 text-sm font-medium transition-all hover:bg-white/5"
      >
        {landing.secondaryCta || "View Pricing"}
      </a>
    </div>
  );
}
