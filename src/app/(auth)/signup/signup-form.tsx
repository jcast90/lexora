"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import config from "@/lib/config";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";
  const supabase = createClient();

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setErrorMsg("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });

    if (error) {
      setErrorMsg(error.message);
      setStatus("error");
    } else {
      setStep("code");
      setStatus("idle");
    }
  }

  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setErrorMsg("");

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otpCode,
      type: "email",
    });

    if (error) {
      setErrorMsg(error.message);
      setStatus("error");
    } else {
      // Create profile on-demand (shared DB)
      try {
        const TABLE_PREFIX = process.env.NEXT_PUBLIC_TABLE_PREFIX || "";
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { data } = await (supabase.from(`${TABLE_PREFIX}profiles`) as any)
            .select("id").eq("id", user.id).single();
          if (!data) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await (supabase.from(`${TABLE_PREFIX}profiles`) as any).insert({
              id: user.id,
              full_name: user.user_metadata?.full_name || "",
              plan: "free",
            });
          }
        }
      } catch {
        // Best-effort profile creation
      }
      router.push(redirect);
    }
  }

  if (step === "code") {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="relative w-full max-w-lg">
          <div className="absolute -inset-4 rounded-3xl opacity-15 blur-2xl pointer-events-none" style={{ background: "radial-gradient(circle, var(--brand-primary), transparent 70%)" }} />
          <Card className="relative w-full bg-brand-surface-light border-white/[0.06]">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-2"><Logo size={40} /></div>
              <CardTitle className="text-2xl">Enter your code</CardTitle>
              <CardDescription className="text-gray-400">
                We sent a 6-digit code to <strong className="text-white">{email}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleVerifyCode} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Verification Code</Label>
                  <Input
                    id="code"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    placeholder="000000"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                    required
                    autoFocus
                    className="bg-white/5 border-white/10 text-center text-2xl tracking-[0.5em] font-mono"
                  />
                </div>
                {errorMsg && <p className="text-sm text-red-400">{errorMsg}</p>}
                <Button
                  type="submit"
                  disabled={status === "loading" || otpCode.length < 6}
                  className="w-full text-white"
                  style={{ background: "linear-gradient(to right, var(--brand-primary), var(--brand-accent))" }}
                >
                  {status === "loading" ? "Verifying..." : "Create Account"}
                </Button>
              </form>
              <div className="flex justify-between mt-4">
                <button type="button" onClick={() => { setStep("email"); setOtpCode(""); setErrorMsg(""); }} className="text-sm text-gray-400 hover:text-gray-300">
                  Use different email
                </button>
                <button type="button" onClick={async () => {
                  setErrorMsg("");
                  await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true } });
                  setErrorMsg("New code sent!");
                }} className="text-sm text-brand-primary hover:opacity-80">
                  Resend code
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="relative w-full max-w-lg">
        <div className="absolute -inset-4 rounded-3xl opacity-15 blur-2xl pointer-events-none" style={{ background: "radial-gradient(circle, var(--brand-primary), transparent 70%)" }} />
        <Card className="relative w-full bg-brand-surface-light border-white/[0.06]">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-2"><Logo size={40} /></div>
            <CardTitle className="text-2xl">Get started with {config.name}</CardTitle>
            <CardDescription className="text-gray-400">
              Create your free account in seconds
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSendCode} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  className="bg-white/5 border-white/10"
                />
              </div>
              {errorMsg && <p className="text-sm text-red-400">{errorMsg}</p>}
              <Button
                type="submit"
                disabled={status === "loading"}
                className="w-full text-white"
                style={{ background: "linear-gradient(to right, var(--brand-primary), var(--brand-accent))" }}
              >
                {status === "loading" ? "Sending..." : "Create Account"}
              </Button>
            </form>
            <p className="text-center text-xs text-gray-500 mt-4">
              We&apos;ll send you a 6-digit code to verify your email. No password needed.
            </p>
            <p className="text-center text-sm text-gray-400 mt-3">
              Already have an account? <Link href="/login" className="text-brand-primary hover:opacity-80">Sign in</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
