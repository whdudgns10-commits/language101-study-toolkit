import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: "Language101 Study Toolkit | Language Exchange Activities",
  description: siteConfig.description,
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    title: "Language101 Study Toolkit | Language Exchange Activities",
    description: "Choose an activity and start talking. Free meetup materials for every table.",
    type: "website",
    siteName: "Language101 Study Toolkit",
  },
  twitter: { card: "summary_large_image", title: "Language101 Study Toolkit", description: "Choose an activity and start talking." },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body style={{ "--purple": siteConfig.brandColor } as React.CSSProperties}>{children}<MobileBottomNav/></body></html>;
}
