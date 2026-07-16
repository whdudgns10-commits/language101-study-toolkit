"use client";
import { CircleHelp } from "lucide-react";
import { useTutorial } from "@/hooks/use-tutorial";
import { useLanguage } from "@/hooks/use-language";
export function TutorialHelpButton(){const {startTutorial}=useTutorial();const {t}=useLanguage();return <button type="button" className="tutorial-help-button" data-tutorial="help-button" aria-label={t("tutorial.open")} onClick={startTutorial}><CircleHelp/></button>}
