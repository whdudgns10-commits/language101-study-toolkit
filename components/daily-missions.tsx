"use client";

import { Check, Target } from "lucide-react";
import { useDailyContent } from "@/hooks/use-daily-content";
import { MissionRerollButton } from "@/components/mission-reroll-button";
import { useLanguage } from "@/hooks/use-language";

export function DailyMissions() {
  const { dateKey,dailyMissions,completedMissionIds,toggleMission } = useDailyContent();
  const {t}=useLanguage();return <section className="mission-wrap section-shell"><div className="daily-missions-card"><div className="daily-missions-head"><div className="mission-symbol"><Target /></div><div><span className="eyebrow">{dateKey}</span><h2>{t("mission.title")}</h2><p>{t("mission.desc")}</p></div>{dailyMissions.length>0&&<MissionRerollButton/>}</div><div className="mission-list">{dailyMissions.length?dailyMissions.map((mission,index) => { const done = completedMissionIds.includes(mission.id); return <button className={done ? "mission-item is-complete" : "mission-item"} onClick={() => toggleMission(mission.id)} key={mission.id}><span className="mission-number">{done ? <Check /> : index+1}</span><span><em>{mission.category}</em><b>{mission.textKo}</b></span></button>; }):<div className="study-empty">{t("common.preparing")}</div>}</div></div></section>;
}
