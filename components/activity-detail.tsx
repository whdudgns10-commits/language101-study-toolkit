"use client";

import Link from "next/link";
import { ArrowLeft, Clock3, ExternalLink, HelpCircle, Maximize2, Play, Users } from "lucide-react";
import { useEffect, useState } from "react";
import type { Activity } from "@/types/activity";
import { ActivityAccordion } from "@/components/activity/activity-accordion";
import { ActivityIcon } from "@/components/activity/activity-icon";
import { AlphabetChallengeGame } from "@/components/alphabet-challenge-game";
import { ConversationContentViewer } from "@/components/conversation-content-viewer";
import { FavoriteButton } from "@/components/favorite-button";
import { LearningNoteEditor } from "@/components/learning-note-editor";
import { MiniTimer } from "@/components/mini-timer";
import { SiteHeader } from "@/components/site-header";
import { SituationSentenceGame } from "@/components/situation-sentence-game";
import { TableMode } from "@/components/table-mode";
import { useLanguage } from "@/hooks/use-language";
import { localizeActivity } from "@/lib/activity-localization";
import { recordSessionActivity } from "@/lib/storage";

export function ActivityDetail({ activity }: { activity:Activity }) {
  const { language, t } = useLanguage();
  const localized = localizeActivity(activity, language);
  const levelLabel = activity.id === "debate-pros-cons"
    ? language === "ko" ? "중상급–고급" : language === "zh" ? "中高级–高级" : language === "ja" ? "中上級–上級" : "Intermediate–Advanced"
    : activity.id === "words-game"
    ? language === "en" ? "All Levels" : language === "ko" ? "전체 레벨" : language === "zh" ? "所有级别" : "全レベル"
    : activity.level;
  const [tableMode, setTableMode] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => recordSessionActivity(activity.id), 0);
    return () => clearTimeout(timer);
  }, [activity.id]);

  if (activity.id === "describing-picture-game") return <><SiteHeader showSearch={false}/><main className="detail-page"><div className="detail-shell"><Link href="/activities" className="back-link"><ArrowLeft size={18}/>{t("activity.back")}</Link><SituationSentenceGame/></div></main></>;
  if (tableMode) return <TableMode activity={activity} onClose={() => setTableMode(false)}/>;

  return <>
    <SiteHeader showSearch={false}/>
    <main className="detail-page compact-activity-detail"><div className="detail-shell">
      <Link href="/activities" className="back-link"><ArrowLeft size={18}/>{t("activity.back")}</Link>
      <article className="detail-card">
        <div className="detail-top"><div><ActivityIcon iconKey={activity.iconKey} size="md" className="detail-activity-icon"/><span className="eyebrow">{activity.category}</span><h1>{localized.title}</h1><p className="activity-summary">{localized.description}</p></div><FavoriteButton id={activity.id} label/></div>
        <div className="compact-detail-meta"><span>{t("activity.level")} · <b>{levelLabel}</b></span><span><Clock3/>{activity.id === "debate-pros-cons" ? "20–40" : activity.durationMinutes} min</span><span><Users/>{activity.groupSizes.join(", ")}</span></div>
        {activity.sourceType === "interactive" && <a className="button button-primary compact-start" href={activity.externalUrl} target="_blank" rel="noreferrer"><Play/>{t("activity.external")}<ExternalLink/></a>}
        <button className="compact-table-button" onClick={() => setTableMode(true)}><Maximize2/>{t("activity.tableMode")}</button>
      </article>
      <ActivityAccordion title={t("activity.viewHowToPlay")} openTitle={t("activity.hideHowToPlay")} icon={<HelpCircle/>}><ol className="compact-instructions">{localized.instructions.map((instruction, index) => <li key={instruction}><span>{index + 1}</span><p>{instruction}</p></li>)}</ol></ActivityAccordion>
      {["balance-game","ice-breaking-3","choose-one-out-of-three","debate-pros-cons","word-battle","useful-expressions"].includes(activity.id) ? <Link className="button button-primary compact-start" href={activity.id==="balance-game"?"/activities/balance-game/practice":`/activities/${activity.id}/practice`}><Play/>{t("activity.startPractice")}</Link> : activity.sourceType === "internal" && <ActivityAccordion title={t("activity.startPractice")} openTitle={t("activity.closePractice")} icon={<Play/>}>{activity.id === "words-game" ? <AlphabetChallengeGame/> : <ConversationContentViewer activityId={activity.id}/>}</ActivityAccordion>}
      <ActivityAccordion title={t("activity.notes")} openTitle={t("common.close")}><LearningNoteEditor activityId={activity.id} activityTitle={localized.title}/></ActivityAccordion>
    </div></main>
    <MiniTimer/>
  </>;
}
