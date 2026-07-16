"use client";
import { CircleHelp } from "lucide-react";
import { useTutorial } from "@/hooks/use-tutorial";
import { useLanguage } from "@/hooks/use-language";
export function TutorialBanner(){const {completed,startTutorial}=useTutorial();const {t}=useLanguage();if(completed)return null;return <aside className="tutorial-banner"><CircleHelp/><div><b>{t("tutorial.banner.title")}</b><p>{t("tutorial.banner.description")}</p></div><button className="button button-secondary" onClick={startTutorial}>{t("tutorial.banner.button")}</button></aside>}
