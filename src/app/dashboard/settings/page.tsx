"use client";

import { useState } from "react";
import config from "@/lib/config";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Eye,
  EyeOff,
  Copy,
  Plus,
  Check,
  Shield,
  CreditCard,
  Users,
  Key,
  Trash2,
} from "lucide-react";

const teamMembers = [
  { name: "John Doe", email: "john@example.com", role: "Owner" },
  { name: "Sarah Chen", email: "sarah@example.com", role: "Admin" },
  { name: "Mike Johnson", email: "mike@example.com", role: "Member" },
];

export default function SettingsPage() {
  const [showApiKey, setShowApiKey] = useState(false);
  const [copied, setCopied] = useState(false);

  const placeholderKey = "vk_live_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6";

  const handleCopy = () => {
    navigator.clipboard.writeText(placeholderKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="px-4 py-8 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Settings
        </h1>
        <p className="mt-1 text-sm text-white/50">
          Manage your account settings and preferences.
        </p>
      </div>

      <Tabs defaultValue="general">
        <TabsList
          variant="line"
          className="mb-8 w-full justify-start border-b border-white/[0.06] bg-transparent pb-0"
        >
          <TabsTrigger
            value="general"
            className="gap-2 text-white/50 data-active:text-white data-active:after:bg-brand-primary"
          >
            <Shield className="size-4" />
            General
          </TabsTrigger>
          <TabsTrigger
            value="billing"
            className="gap-2 text-white/50 data-active:text-white data-active:after:bg-brand-primary"
          >
            <CreditCard className="size-4" />
            Billing
          </TabsTrigger>
          <TabsTrigger
            value="team"
            className="gap-2 text-white/50 data-active:text-white data-active:after:bg-brand-primary"
          >
            <Users className="size-4" />
            Team
          </TabsTrigger>
          <TabsTrigger
            value="api-keys"
            className="gap-2 text-white/50 data-active:text-white data-active:after:bg-brand-primary"
          >
            <Key className="size-4" />
            API Keys
          </TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general">
          <Card className="border-white/[0.06] bg-brand-surface-light">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-white">
                General Settings
              </CardTitle>
              <CardDescription className="text-sm text-white/40">
                Update your product details and account information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-white/70">Product Name</Label>
                  <Input
                    defaultValue={config.name}
                    className="border-white/[0.08] bg-white/[0.03] text-white placeholder:text-white/30 focus-visible:border-brand-primary/50 focus-visible:ring-brand-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/70">Email Address</Label>
                  <Input
                    type="email"
                    defaultValue="admin@example.com"
                    className="border-white/[0.08] bg-white/[0.03] text-white placeholder:text-white/30 focus-visible:border-brand-primary/50 focus-visible:ring-brand-primary/20"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-white/70">Domain</Label>
                <Input
                  defaultValue={config.domain}
                  className="border-white/[0.08] bg-white/[0.03] text-white placeholder:text-white/30 focus-visible:border-brand-primary/50 focus-visible:ring-brand-primary/20"
                />
              </div>
              <Separator className="bg-white/[0.06]" />
              <div className="flex justify-end">
                <Button className="text-white" style={{ background: "linear-gradient(to right, var(--brand-primary), var(--brand-accent))" }}>
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing">
          <div className="space-y-6">
            <Card className="border-white/[0.06] bg-brand-surface-light">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold text-white">
                      Current Plan
                    </CardTitle>
                    <CardDescription className="text-sm text-white/40">
                      You are currently on the Pro plan.
                    </CardDescription>
                  </div>
                  <Badge className="border-0 text-white" style={{ background: "linear-gradient(to right, var(--brand-primary), var(--brand-accent))" }}>
                    Pro
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white">$29</span>
                  <span className="text-sm text-white/40">/month</span>
                </div>
                <div className="grid gap-2 text-sm text-white/60">
                  <div className="flex items-center gap-2">
                    <Check className="size-4 text-emerald-400" />
                    Unlimited projects
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="size-4 text-emerald-400" />
                    Advanced analytics
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="size-4 text-emerald-400" />
                    Priority support
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="size-4 text-emerald-400" />
                    Custom integrations
                  </div>
                </div>
                <Separator className="bg-white/[0.06]" />
                <div className="flex gap-3">
                  <Button className="text-white" style={{ background: "linear-gradient(to right, var(--brand-primary), var(--brand-accent))" }}>
                    Upgrade to Enterprise
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-white/50 hover:text-white hover:bg-white/10"
                  >
                    Cancel Subscription
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/[0.06] bg-brand-surface-light">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-white">
                  Payment Method
                </CardTitle>
                <CardDescription className="text-sm text-white/40">
                  Manage your payment details.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between rounded-lg border border-white/[0.08] bg-white/[0.03] p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-md bg-white/[0.06]">
                      <CreditCard className="size-5 text-white/60" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white/80">
                        Visa ending in 4242
                      </p>
                      <p className="text-xs text-white/40">Expires 12/2027</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white/50 hover:text-white hover:bg-white/10"
                  >
                    Update
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team">
          <div className="space-y-6">
            <Card className="border-white/[0.06] bg-brand-surface-light">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-white">
                  Invite Members
                </CardTitle>
                <CardDescription className="text-sm text-white/40">
                  Add new members to your team by email.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Input
                    type="email"
                    placeholder="colleague@example.com"
                    className="flex-1 border-white/[0.08] bg-white/[0.03] text-white placeholder:text-white/30 focus-visible:border-brand-primary/50 focus-visible:ring-brand-primary/20"
                  />
                  <Button className="gap-2 text-white" style={{ background: "linear-gradient(to right, var(--brand-primary), var(--brand-accent))" }}>
                    <Plus className="size-4" />
                    Invite
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/[0.06] bg-brand-surface-light">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-white">
                  Team Members
                </CardTitle>
                <CardDescription className="text-sm text-white/40">
                  Manage your team and their roles.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {teamMembers.map((member) => (
                    <div
                      key={member.email}
                      className="flex items-center justify-between rounded-lg border border-white/[0.08] bg-white/[0.03] p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-full" style={{ background: "linear-gradient(to bottom right, color-mix(in srgb, var(--brand-primary) 20%, transparent), color-mix(in srgb, var(--brand-accent) 20%, transparent))" }}>
                          <span className="text-sm font-semibold text-white/70">
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white/80">
                            {member.name}
                          </p>
                          <p className="text-xs text-white/40">
                            {member.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant="outline"
                          className={
                            member.role === "Owner"
                              ? "border-brand-primary/30 text-brand-primary"
                              : member.role === "Admin"
                                ? "border-brand-accent/30 text-brand-accent"
                                : "border-white/20 text-white/50"
                          }
                        >
                          {member.role}
                        </Badge>
                        {member.role !== "Owner" && (
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-white/30 hover:text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* API Keys Tab */}
        <TabsContent value="api-keys">
          <div className="space-y-6">
            <Card className="border-white/[0.06] bg-brand-surface-light">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold text-white">
                      API Keys
                    </CardTitle>
                    <CardDescription className="text-sm text-white/40">
                      Manage your API keys for programmatic access.
                    </CardDescription>
                  </div>
                  <Button className="gap-2 text-white" style={{ background: "linear-gradient(to right, var(--brand-primary), var(--brand-accent))" }}>
                    <Plus className="size-4" />
                    Create Key
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-white/[0.08] bg-white/[0.03] p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white/80">
                        Production Key
                      </p>
                      <p className="text-xs text-white/40">
                        Created on Jan 15, 2026
                      </p>
                    </div>
                    <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                      Active
                    </Badge>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex-1 rounded-md border border-white/[0.08] bg-brand-surface px-3 py-2 font-mono text-sm text-white/70">
                      {showApiKey
                        ? placeholderKey
                        : "vk_live_" + "\u2022".repeat(32)}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white/40 hover:text-white hover:bg-white/10"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white/40 hover:text-white hover:bg-white/10"
                      onClick={handleCopy}
                    >
                      {copied ? (
                        <Check className="size-4 text-emerald-400" />
                      ) : (
                        <Copy className="size-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/[0.06] bg-brand-surface-light">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-white">
                  Usage
                </CardTitle>
                <CardDescription className="text-sm text-white/40">
                  API usage for the current billing period.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-white/60">Requests</span>
                      <span className="text-white/80">
                        12,847 / 50,000
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                      <div
                        className="h-full rounded-full"
                        style={{ width: "25.7%", background: "linear-gradient(to right, var(--brand-primary), var(--brand-accent))" }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-white/60">Data Transfer</span>
                      <span className="text-white/80">3.2 GB / 10 GB</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                      <div
                        className="h-full rounded-full"
                        style={{ width: "32%", background: "linear-gradient(to right, var(--brand-primary), var(--brand-accent))" }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
