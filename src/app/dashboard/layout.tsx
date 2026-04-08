import { Sidebar } from "@/components/dashboard/sidebar";
import { MobileHeader } from "@/components/dashboard/mobile-header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-brand-surface">
      <Sidebar />
      <MobileHeader />
      <main className="lg:pl-[260px]">
        <div className="min-h-screen">{children}</div>
      </main>
    </div>
  );
}
