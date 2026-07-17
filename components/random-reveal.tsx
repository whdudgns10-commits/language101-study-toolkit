"use client";

import Link from "next/link";
import { Dices, X } from "lucide-react";
import type { Activity } from "@/types/activity";
import { Button } from "./ui/button";
import { useLanguage } from "@/hooks/use-language";

export function RandomReveal({ activity, onAgain, onClose }: { activity: Activity; onAgain: () => void; onClose: () => void }) {
  const {t}=useLanguage();
  return (
    <div className="reveal-backdrop" role="dialog" aria-modal="true" aria-labelledby="random-title">
      <div className="reveal-card">
        <button className="reveal-close" onClick={onClose} aria-label={t("common.close")}><X /></button>
        <div className="reveal-icon"><Dices /></div>
        <span className="eyebrow">{t("randomActivity.selected")}</span>
        <h2 id="random-title">{activity.title}</h2>
        <p>{activity.description}</p>
        <Link href={`/activities/${activity.id}`} className="button button-primary">{t("activity.startPractice")}</Link>
        <Button variant="ghost" onClick={onAgain}>{t("common.random")}</Button>
      </div>
    </div>
  );
}
