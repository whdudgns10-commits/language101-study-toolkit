"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check, Clock3, Copy, Info, Maximize2, Play, Users } from "lucide-react";
import { useEffect, useState } from "react";
import type { Activity } from "@/types/activity";
import { FavoriteButton } from "./favorite-button";
import { MiniTimer } from "./mini-timer";
import { SiteHeader } from "./site-header";
import { LearningNoteEditor } from "./learning-note-editor";
import { TableMode } from "./table-mode";
import { recordSessionActivity } from "@/lib/storage";

export function ActivityDetail({ activity }: { activity: Activity }) {
  const [tableMode,setTableMode] = useState(false); const [copied,setCopied] = useState(false);
  useEffect(() => { const timer = setTimeout(() => recordSessionActivity(activity.id),0); return () => clearTimeout(timer); },[activity.id]);
  const notice = activity.sourceType === "naver-cafe" ? "네이버 로그인이나 카페 가입이 필요할 수 있습니다." : activity.sourceType === "interactive" ? "Opens an interactive activity in a new tab." : "This activity is available inside the toolkit.";
  async function copyLink() { await navigator.clipboard.writeText(activity.externalUrl); setCopied(true); setTimeout(() => setCopied(false),1200); }
  if (tableMode) return <TableMode activity={activity} onClose={() => setTableMode(false)} />;
  return <>
    <SiteHeader showSearch={false} />
    <main className="detail-page">
      <div className="detail-shell">
        <Link href="/#activities" className="back-link"><ArrowLeft size={18} /> Back to Activities</Link>
        <div className="detail-mode-row"><button className="button button-secondary" onClick={() => setTableMode(true)}><Maximize2 /> 테이블 모드</button></div><article className="detail-card">
          <div className="detail-top"><div><span className="eyebrow">{activity.category}</span><h1>{activity.title}</h1><p>{activity.description}</p></div><FavoriteButton id={activity.id} label /></div>
          <div className="detail-meta"><div><span>Level</span><b>{activity.level}</b></div><div><span><Clock3 /> Duration</span><b>{activity.durationMinutes} minutes</b></div><div><span><Users /> Group size</span><b>{activity.groupSizes.join(", ")}</b></div></div>
          <div className="instruction-panel"><span className="eyebrow">How to play</span><h2>Three simple steps</h2><ol>{activity.instructions.map((instruction, index) => <li key={instruction}><span>{index + 1}</span><p>{instruction}</p></li>)}</ol></div>
          <div className={activity.sourceType === "naver-cafe" ? "source-notice naver-notice" : "source-notice"}><Info size={18} /><p>{notice}</p></div>
          <div className="detail-actions"><a className="button button-primary" href={activity.externalUrl || "#"} target={activity.sourceType === "internal" ? undefined : "_blank"} rel="noreferrer"><Play size={19} /> Start Activity</a><a className="button button-secondary" href={activity.externalUrl || "#"} target={activity.sourceType === "internal" ? undefined : "_blank"} rel="noreferrer">새 탭에서 열기 <ArrowUpRight size={18} /></a>{activity.sourceType === "naver-cafe" && <button className="button button-secondary" onClick={copyLink}>{copied ? <Check /> : <Copy />}{copied ? "링크 복사됨" : "링크 복사"}</button>}</div>
        </article>
        <LearningNoteEditor activityId={activity.id} activityTitle={activity.title} />
      </div>
    </main>
    <MiniTimer />
  </>;
}
