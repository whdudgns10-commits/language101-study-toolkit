"use client";

import { Check, Target } from "lucide-react";
import { useDailyContent } from "@/hooks/use-daily-content";
import { MissionRerollButton } from "@/components/mission-reroll-button";

export function DailyMissions() {
  const { dateKey,dailyMissions,completedMissionIds,toggleMission } = useDailyContent();
  return <section className="mission-wrap section-shell"><div className="daily-missions-card"><div className="daily-missions-head"><div className="mission-symbol"><Target /></div><div><span className="eyebrow">오늘 · {dateKey}</span><h2>오늘의 미션 3개</h2><p>오늘 대화에서 직접 도전할 목표를 확인하세요.</p></div><MissionRerollButton/></div><div className="mission-list">{dailyMissions.map((mission,index) => { const done = completedMissionIds.includes(mission.id); return <button className={done ? "mission-item is-complete" : "mission-item"} onClick={() => toggleMission(mission.id)} key={mission.id}><span className="mission-number">{done ? <Check /> : index+1}</span><span><em>{mission.category}</em><b>{mission.textKo}</b><small>{mission.textEn}</small></span></button>; })}</div></div></section>;
}
