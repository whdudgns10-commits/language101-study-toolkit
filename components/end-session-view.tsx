"use client";

import Link from "next/link";
import { Check, Copy, ExternalLink, Heart, NotebookPen, PartyPopper } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { activities } from "@/data/activities";
import { expressions } from "@/data/expressions";
import { missions } from "@/data/missions";
import { siteConfig } from "@/config/site";
import { getExpressionFavorites, getNotes, getSessionActivities, todayKey, type LearningNote } from "@/lib/storage";
import { getDailyBrowserState } from "@/hooks/use-daily-content";
import { selectDistinctCategoryItems } from "@/lib/daily-content";

export function EndSessionView() {
  const [activityIds,setActivityIds] = useState<string[]>([]); const [expressionIds,setExpressionIds] = useState<string[]>([]); const [notes,setNotes] = useState<LearningNote[]>([]); const [completedMissionIds,setCompletedMissionIds] = useState<string[]>([]); const [missionOffset,setMissionOffset] = useState(0); const [copied,setCopied] = useState(false);
  useEffect(() => { const timer = setTimeout(() => { setActivityIds(getSessionActivities()); setExpressionIds(getExpressionFavorites()); setNotes(getNotes().filter((note) => note.date === todayKey())); const daily = getDailyBrowserState(); setCompletedMissionIds(daily.completedMissionIds); setMissionOffset(daily.missionOffset); }, 0); return () => clearTimeout(timer); }, []);
  const doneActivities = activities.filter((item) => activityIds.includes(item.id)); const savedExpressions = expressions.filter((item) => expressionIds.includes(item.id)); const completedMissions = selectDistinctCategoryItems(missions,3,todayKey(),"missions",missionOffset).filter((item) => completedMissionIds.includes(item.id));
  const summary = useMemo(() => [`Language101 · ${todayKey()}`,`\n진행한 활동\n${doneActivities.map((item) => `- ${item.title}`).join("\n") || "- 없음"}`,`\n완료한 미션\n${completedMissions.map((item) => `- ${item.textKo}`).join("\n") || "- 없음"}`,`\n저장한 표현\n${savedExpressions.map((item) => `- ${item.expression} ${item.koreanMeaning}`).join("\n") || "- 없음"}`,`\n학습 메모\n${notes.map((note) => `- ${note.activityTitle}: ${[note.learned,note.corrected,note.nextTime].filter(Boolean).join(" / ")}`).join("\n") || "- 없음"}`].join("\n"),[completedMissions,doneActivities,notes,savedExpressions]);
  async function copy() { await navigator.clipboard.writeText(summary); setCopied(true); setTimeout(() => setCopied(false), 1400); }
  return <main className="end-page"><div className="end-shell"><div className="end-hero"><PartyPopper /><span className="eyebrow">Session complete</span><h1>오늘도 좋은 대화였어요!</h1><p>오늘의 활동과 배운 내용을 한곳에서 확인해 보세요.</p></div><div className="end-stats"><span><b>{doneActivities.length}</b>진행한 활동</span><span><b>{completedMissions.length}</b>완료한 미션</span><span><b>{savedExpressions.length}</b>저장한 표현</span><span><b>{notes.length}</b>작성한 메모</span></div><div className="end-grid"><SummaryCard title="오늘 진행한 활동" icon={<Check />} items={doneActivities.map((item) => item.title)} /><SummaryCard title="완료한 미션" icon={<PartyPopper />} items={completedMissions.map((item) => item.textKo)} /><SummaryCard title="즐겨찾기 표현" icon={<Heart />} items={savedExpressions.map((item) => `${item.expression} · ${item.koreanMeaning}`)} /><SummaryCard title="작성한 메모" icon={<NotebookPen />} items={notes.map((note) => `${note.activityTitle} · ${note.learned || note.corrected || note.nextTime}`)} /></div><button className="button button-primary end-copy" onClick={copy}>{copied ? <Check /> : <Copy />}{copied ? "복사됐어요" : "오늘 배운 내용 복사하기"}</button><div className="end-links"><Link className="button button-secondary" href="/">다음 모임 자료 보기</Link>{siteConfig.reservationUrl ? <a className="button button-primary" href={siteConfig.reservationUrl} target="_blank" rel="noreferrer">언어교환101 모임 신청하기 <ExternalLink /></a> : <span className="reservation-empty">예약 링크는 NEXT_PUBLIC_RESERVATION_URL 설정 후 표시됩니다.</span>}</div></div></main>;
}
function SummaryCard({title,icon,items}:{title:string;icon:React.ReactNode;items:string[]}) { return <section className="summary-card"><h2>{icon}{title}</h2>{items.length ? <ul>{items.map((item,index) => <li key={`${item}-${index}`}>{item}</li>)}</ul> : <p>아직 기록이 없어요.</p>}</section>; }
