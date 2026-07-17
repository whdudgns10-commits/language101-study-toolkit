import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { LanguageProvider } from "@/components/language-provider";
import { TutorialProvider } from "@/components/tutorial/tutorial-provider";
import { AccessProvider } from "@/components/access/2026-07-17-access-provider";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: "언어교환101 | Language Exchange 101",
  description: siteConfig.description,
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    title: "언어교환101 | Language Exchange 101",
    description: "Choose an activity and start talking. Free meetup materials for every table.",
    type: "website",
    siteName: "언어교환101",
  },
  twitter: { card: "summary_large_image", title: "언어교환101 | Language Exchange 101", description: "Choose an activity and start talking." },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en-US" suppressHydrationWarning><body style={{ "--purple": siteConfig.brandColor } as React.CSSProperties}><LanguageProvider><AccessProvider><TutorialProvider>{children}<MobileBottomNav/></TutorialProvider></AccessProvider></LanguageProvider></body></html>;
}
