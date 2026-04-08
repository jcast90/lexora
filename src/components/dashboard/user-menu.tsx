"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Settings,
  LogOut,
  User,
  CreditCard,
} from "lucide-react";

export function UserMenu({ variant = "sidebar" }: { variant?: "sidebar" | "header" }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors duration-200 hover:bg-white/[0.06] ${
          variant === "header" ? "cursor-pointer" : "w-full cursor-pointer"
        }`}
      >
        <Avatar size="sm">
          <AvatarFallback className="text-[10px] font-semibold text-white" style={{ background: "linear-gradient(to bottom right, var(--brand-primary), var(--brand-accent))" }}>
            JD
          </AvatarFallback>
        </Avatar>
        {variant === "sidebar" && (
          <div className="flex flex-col items-start text-left">
            <span className="text-sm font-medium text-white/90">John Doe</span>
            <span className="text-xs text-white/40">john@example.com</span>
          </div>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side={variant === "sidebar" ? "top" : "bottom"}
        align="end"
        sideOffset={8}
        className="w-56 bg-brand-surface-light border-white/10"
      >
        <DropdownMenuLabel className="text-white/60">
          My Account
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuItem className="text-white/80 focus:bg-white/10 focus:text-white cursor-pointer">
          <User className="mr-2 size-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem className="text-white/80 focus:bg-white/10 focus:text-white cursor-pointer">
          <CreditCard className="mr-2 size-4" />
          Billing
        </DropdownMenuItem>
        <DropdownMenuItem className="text-white/80 focus:bg-white/10 focus:text-white cursor-pointer">
          <Settings className="mr-2 size-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuItem className="text-red-400 focus:bg-red-500/10 focus:text-red-400 cursor-pointer">
          <LogOut className="mr-2 size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
