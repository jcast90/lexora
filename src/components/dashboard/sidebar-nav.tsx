"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import config from "@/lib/config";
import {
  LayoutDashboard,
  Settings,
  Database,
  Zap,
  Users,
  BarChart3,
  FileText,
  Globe,
  Scale,
  Shield,
  Briefcase,
  Calendar,
  Mail,
  MessageSquare,
  Bell,
  Search,
  Home,
  FolderOpen,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Building,
  Phone,
  Star,
  Heart,
  Tag,
  Inbox,
  Send,
  PieChart,
  Activity,
  Package,
  Truck,
  ShoppingCart,
  Clipboard,
  BookOpen,
  CreditCard,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  Settings,
  Database,
  Zap,
  Users,
  BarChart3,
  FileText,
  Globe,
  Scale,
  Shield,
  Briefcase,
  Calendar,
  Mail,
  MessageSquare,
  Bell,
  Search,
  Home,
  FolderOpen,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Building,
  Phone,
  Star,
  Heart,
  Tag,
  Inbox,
  Send,
  PieChart,
  Activity,
  Package,
  Truck,
  ShoppingCart,
  Clipboard,
  BookOpen,
  CreditCard,
};

const navItems = config.dashboard.navItems;
const warnedIcons = new Set<string>();

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 px-3">
      {navItems.map((item) => {
        const Icon = iconMap[item.icon] ?? LayoutDashboard;
        if (!iconMap[item.icon] && !warnedIcons.has(item.icon)) {
          warnedIcons.add(item.icon);
          console.warn(`[dashboard] Unknown icon "${item.icon}" for nav item "${item.label}" — falling back to LayoutDashboard`);
        }
        const isActive =
          pathname === item.href ||
          (item.href !== "/dashboard" && pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
              isActive
                ? "bg-white/10 text-white border-l-[3px]"
                : "text-white/50 hover:bg-white/[0.06] hover:text-white/80 border-l-[3px] border-l-transparent"
            }`}
            style={isActive ? { borderLeftColor: "var(--brand-primary)" } : undefined}
          >
            <Icon
              className={`size-[18px] shrink-0 transition-colors duration-200 ${
                isActive
                  ? "text-brand-primary"
                  : "text-white/40 group-hover:text-white/60"
              }`}
            />
            <span>{item.label}</span>
            {isActive && (
              <span className="ml-auto size-1.5 rounded-full bg-brand-primary" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
