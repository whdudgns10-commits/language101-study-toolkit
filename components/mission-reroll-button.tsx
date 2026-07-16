"use client";
import { RefreshCw, X } from "lucide-react";
import { useState } from "react";
import { useDailyContent } from "@/hooks/use-daily-content";
import { useLanguage } from "@/hooks/use-language";

export function MissionRerollButton({compact=false}:{compact?:boolean}) {
  const {completedMissionIds,rerollMissions}=useDailyContent();const {t}=useLanguage(); const [confirming,setConfirming]=useState(false); const [busy,setBusy]=useState(false);
  function change(){setBusy(true);rerollMissions();setConfirming(false);window.setTimeout(()=>setBusy(false),350)}
  function request(){if(busy)return;if(completedMissionIds.length)setConfirming(true);else change()}
  return <><div className={compact?"mission-reroll compact":"mission-reroll"}><button className="button button-secondary" disabled={busy} onClick={request}><RefreshCw className={busy?"is-spinning":""}/>{busy?t("common.loading"):t("mission.other")}</button>{!compact&&<small>{t("mission.otherDesc")}</small>}</div>{confirming&&<div className="study-modal" role="dialog" aria-modal="true" aria-labelledby="reroll-confirm-title"><div><button className="modal-close" onClick={()=>setConfirming(false)} aria-label={t("common.close")}><X/></button><h2 id="reroll-confirm-title">{t("mission.confirmTitle")}</h2><p>{t("mission.confirm")}</p><div className="reroll-confirm-actions"><button className="button button-secondary" onClick={()=>setConfirming(false)}>{t("common.cancel")}</button><button className="button button-primary" onClick={change}>{t("mission.new")}</button></div></div></div>}</>;
}
