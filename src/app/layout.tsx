import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import config from "@/lib/config";
import { PageTracker } from "@/components/page-tracker";
import { BrandProvider } from "@/components/brand-provider";
import { AnalyticsProvider } from "@/components/analytics-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: config.name + " - " + config.tagline,
  description: config.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} dark`}>
      <body className="antialiased bg-brand-surface text-white font-[family-name:var(--font-inter)]">
        <BrandProvider>
          <AnalyticsProvider>
            <PageTracker />
            {children}
          </AnalyticsProvider>
        </BrandProvider>
      </body>
    </html>
  );
}
