"use client";

import Link from "next/link";
import { Home, Search, UserRound } from "lucide-react";
import { LanguageSelector } from "@/components/language-selector";import { useLanguage } from "@/hooks/use-language";

export function SiteHeader({ onSearch, showSearch = true }: { onSearch?: () => void; showSearch?: boolean }) {
  const {t}=useLanguage();
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="logo" aria-label={t("common.home")}>
          <span className="logo-mark">L1</span>
          <span className="brand-copy"><strong>{t("brand.name")}</strong><small>{t("brand.subtitle")}</small></span>
        </Link>
        <nav className="header-actions" aria-label="Quick navigation">
          {showSearch && <button className="icon-button" onClick={onSearch} aria-label={t("common.search")}><Search size={20} /></button>}
          <Link className="my-study-desktop-link" href="/my-study" aria-label={t("nav.myStudy")}><UserRound size={20} /><span>{t("nav.myStudy")}</span></Link><LanguageSelector/>
          <Link className="icon-button" href="/" aria-label={t("common.home")}><Home size={20} /></Link>
        </nav>
      </div>
    </header>
  );
}
