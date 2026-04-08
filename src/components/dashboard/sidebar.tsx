import config from "@/lib/config";
import { Separator } from "@/components/ui/separator";
import { Zap } from "lucide-react";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { UserMenu } from "@/components/dashboard/user-menu";

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[260px] flex-col border-r border-white/[0.06] bg-brand-surface-light lg:flex">
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

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <SidebarNav />
      </div>

      <Separator className="bg-white/[0.06]" />

      {/* User section */}
      <div className="p-3">
        <UserMenu variant="sidebar" />
      </div>
    </aside>
  );
}
