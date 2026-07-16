"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Clock3, Info, Maximize2, Play, Users } from "lucide-react";
import { useEffect, useState } from "react";
import type { Activity } from "@/types/activity";
import { FavoriteButton } from "./favorite-button";
import { MiniTimer } from "./mini-timer";
import { SiteHeader } from "./site-header";
import { LearningNoteEditor } from "./learning-note-editor";
import { TableMode } from "./table-mode";
import { recordSessionActivity } from "@/lib/storage";
import { ConversationContentViewer } from "@/components/conversation-content-viewer";

export function ActivityDetail({ activity }: { activity: Activity }) {
  const [tableMode,setTableMode] = useState(false);
  useEffect(() => { const timer = setTimeout(() => recordSessionActivity(activity.id),0); return () => clearTimeout(timer); },[activity.id]);
  const notice = activity.sourceType === "interactive" ? "독립 실행형 도구가 외부 페이지에서 열립니다." : "질문과 대화 자료를 이 페이지에서 바로 이용할 수 있습니다.";
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
          <div className="source-notice"><Info size={18} /><p>{notice}</p></div>
          {activity.sourceType === "interactive"&&<div className="detail-actions"><a className="button button-primary" href={activity.externalUrl} target="_blank" rel="noreferrer"><Play size={19} /> Start Activity · 외부 페이지</a><a className="button button-secondary" href={activity.externalUrl} target="_blank" rel="noreferrer">외부 페이지에서 열기 <ArrowUpRight size={18} /></a></div>}
        </article>
        {activity.sourceType === "internal"&&<ConversationContentViewer activityId={activity.id}/>}
        <LearningNoteEditor activityId={activity.id} activityTitle={activity.title} />
      </div>
    </main>
    <MiniTimer />
  </>;
}
