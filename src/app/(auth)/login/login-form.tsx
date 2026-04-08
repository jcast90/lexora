"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import config from "@/lib/config";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";
  const supabase = createClient();

  async function handleSendOtp(e: React.FormEvent) {
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

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setErrorMsg("");
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otpCode,
      type: "email",
    });
    if (error) {
      setErrorMsg(error.message);
      setStatus("error");
      return;
    }

    // Create profile on-demand if it doesn't exist
    if (data.user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", data.user.id)
        .single();

      if (!profile) {
        await supabase.from("profiles").insert({
          id: data.user.id,
          email: data.user.email,
          full_name: data.user.user_metadata?.full_name || "",
        });
      }
    }

    router.push(redirect);
  }

  async function handleResendCode() {
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
      setErrorMsg("");
      setStatus("idle");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="relative w-full max-w-md">
        <div className="absolute -inset-4 rounded-3xl opacity-15 blur-2xl pointer-events-none" style={{ background: "radial-gradient(circle, var(--brand-primary), transparent 70%)" }} />
        <Card className="relative w-full bg-brand-surface-light border-white/[0.06]">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-2"><Logo size={40} /></div>
            <CardTitle className="text-2xl">{config.name}</CardTitle>
            <CardDescription className="text-gray-400">
              {step === "email" ? "Sign in to your account" : `Enter the code sent to ${email}`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {step === "email" ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
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
                  {status === "loading" ? "Sending..." : "Continue with Email"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">6-digit code</Label>
                  <Input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    placeholder="000000"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    required
                    autoFocus
                    className="bg-white/5 border-white/10 text-center text-lg tracking-widest"
                  />
                </div>
                {errorMsg && <p className="text-sm text-red-400">{errorMsg}</p>}
                <Button
                  type="submit"
                  disabled={status === "loading" || otpCode.length < 6}
                  className="w-full text-white"
                  style={{ background: "linear-gradient(to right, var(--brand-primary), var(--brand-accent))" }}
                >
                  {status === "loading" ? "Verifying..." : "Verify & Sign In"}
                </Button>
                <div className="flex items-center justify-between text-sm">
                  <button
                    type="button"
                    onClick={() => { setStep("email"); setOtpCode(""); setErrorMsg(""); setStatus("idle"); }}
                    className="text-gray-400 hover:text-gray-300"
                  >
                    Use different email
                  </button>
                  <button
                    type="button"
                    onClick={handleResendCode}
                    className="text-brand-primary hover:opacity-80"
                  >
                    Resend code
                  </button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
