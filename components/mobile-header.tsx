"use client";
import Link from "next/link";
import { Search, UserRound } from "lucide-react";
import { MissionHeaderButton } from "@/components/mission-header-button";
import { LanguageSelector } from "@/components/language-selector";import { useLanguage } from "@/hooks/use-language";
export function MobileHeader(){const {t}=useLanguage();return <header className="mobile-header"><Link href="/" className="mobile-brand" aria-label={t("common.home")}><span>L1</span><b>{t("brand.name")}<br/><em>{t("brand.subtitle")}</em></b></Link><nav><MissionHeaderButton/><Link href="/my-study" className="my-study-header-link" aria-label={t("nav.myStudy")}><UserRound/><small>{t("nav.myStudy")}</small></Link><Link href="/activities?focus=search" aria-label={t("common.search")}><Search/></Link><LanguageSelector/></nav></header>}
