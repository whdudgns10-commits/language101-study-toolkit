"use client";
import { RefreshCw, X } from "lucide-react";
import { useState } from "react";
import { useDailyContent } from "@/hooks/use-daily-content";

export function MissionRerollButton({compact=false}:{compact?:boolean}) {
  const {completedMissionIds,rerollMissions}=useDailyContent(); const [confirming,setConfirming]=useState(false); const [busy,setBusy]=useState(false);
  function change(){setBusy(true);rerollMissions();setConfirming(false);window.setTimeout(()=>setBusy(false),350)}
  function request(){if(busy)return;if(completedMissionIds.length)setConfirming(true);else change()}
  return <><div className={compact?"mission-reroll compact":"mission-reroll"}><button className="button button-secondary" disabled={busy} onClick={request}><RefreshCw className={busy?"is-spinning":""}/>{busy?"변경 중...":"다른 미션 받기"}</button>{!compact&&<small>현재 미션이 마음에 들지 않으면 새로운 미션 3개를 받아보세요.</small>}</div>{confirming&&<div className="study-modal" role="dialog" aria-modal="true" aria-labelledby="reroll-confirm-title"><div><button className="modal-close" onClick={()=>setConfirming(false)} aria-label="닫기"><X/></button><h2 id="reroll-confirm-title">미션을 변경할까요?</h2><p>현재 미션을 변경하면 오늘의 미션 진행 상태가 초기화됩니다.<br/>새로운 미션으로 변경할까요?</p><div className="reroll-confirm-actions"><button className="button button-secondary" onClick={()=>setConfirming(false)}>취소</button><button className="button button-primary" onClick={change}>새로운 미션 받기</button></div></div></div>}</>;
}
