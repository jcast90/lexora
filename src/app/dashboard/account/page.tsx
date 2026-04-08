"use client";

import { Card, CardContent } from "@/components/ui/card";

export default function AccountPage() {
  return (
    <div className="px-4 py-8 lg:px-8">
      <h1 className="text-2xl font-bold tracking-tight text-white">Account</h1>
      <Card className="mt-6 border-white/[0.06] bg-brand-surface-light text-white">
        <CardContent className="py-16 text-center">
          <p className="text-white/40">Coming soon</p>
        </CardContent>
      </Card>
    </div>
  );
}
