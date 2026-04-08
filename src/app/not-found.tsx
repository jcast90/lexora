import Link from "next/link";
import config from "@/lib/config";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-surface px-4">
      <h1 className="text-6xl font-bold text-white">404</h1>
      <p className="mt-4 text-lg text-white/60">Page not found</p>
      <Link
        href="/"
        className="mt-8 rounded-lg px-6 py-3 text-sm font-medium text-white transition-colors hover:opacity-90"
        style={{ background: "linear-gradient(to right, var(--brand-primary), var(--brand-accent))" }}
      >
        Back to {config.name}
      </Link>
    </div>
  );
}
