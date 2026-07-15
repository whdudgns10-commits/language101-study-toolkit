"use client";

import { Check, RefreshCw, Target } from "lucide-react";
import { useDailyContent } from "@/hooks/use-daily-content";

export function DailyMissions() {
  const { dateKey,dailyMissions,completedMissionIds,toggleMission,rerollMissions } = useDailyContent();
  return <section className="mission-wrap section-shell"><div className="daily-missions-card"><div className="daily-missions-head"><div className="mission-symbol"><Target /></div><div><span className="eyebrow">Today’s missions · {dateKey} KST</span><h2>오늘의 미션 3개</h2><p>서로 다른 카테고리에서 한 가지씩 골랐어요.</p></div><button className="button button-secondary" onClick={rerollMissions}><RefreshCw /> 미션 다시 뽑기</button></div><div className="mission-list">{dailyMissions.map((mission,index) => { const done = completedMissionIds.includes(mission.id); return <button className={done ? "mission-item is-complete" : "mission-item"} onClick={() => toggleMission(mission.id)} key={mission.id}><span className="mission-number">{done ? <Check /> : index+1}</span><span><em>{mission.category}</em><b>{mission.textKo}</b><small>{mission.textEn}</small></span></button>; })}</div></div></section>;
}
