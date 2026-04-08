"use client";

import { useState } from "react";
import config from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { Zap, Menu } from "lucide-react";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { UserMenu } from "@/components/dashboard/user-menu";

export function MobileHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b border-white/[0.06] px-4 backdrop-blur-xl lg:hidden" style={{ backgroundColor: "color-mix(in srgb, var(--brand-surface) 80%, transparent)" }}>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <Button variant="ghost" size="icon" className="text-white/60 hover:text-white hover:bg-white/10" />
          }
        >
          <Menu className="size-5" />
          <span className="sr-only">Toggle menu</span>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-[280px] border-r border-white/[0.06] bg-brand-surface-light p-0"
          showCloseButton={false}
        >
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          {/* Brand gradient top line */}
          <div className="h-[2px] w-full shrink-0" style={{ background: `linear-gradient(to right, var(--brand-primary), var(--brand-accent))` }} />
          {/* Logo */}
          <div className="flex h-16 items-center gap-3 px-6">
            <div className="flex size-8 items-center justify-center rounded-lg" style={{ background: "linear-gradient(to bottom right, var(--brand-primary), var(--brand-accent))" }}>
              <Zap className="size-4 text-white" />
            </div>
            <span className="text-base font-semibold tracking-tight text-white">
              {config.name}
            </span>
          </div>

          <Separator className="bg-white/[0.06]" />

          <div className="flex-1 py-4">
            <SidebarNav onNavigate={() => setOpen(false)} />
          </div>

          <Separator className="bg-white/[0.06]" />

          <div className="p-3">
            <UserMenu variant="sidebar" />
          </div>
        </SheetContent>
      </Sheet>

      <span className="text-sm font-semibold text-white">{config.name}</span>

      <div className="ml-auto">
        <UserMenu variant="header" />
      </div>
    </header>
  );
}
