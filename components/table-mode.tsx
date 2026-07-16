"use client";

import { ChevronLeft, ChevronRight, Clock3, ExternalLink, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { Activity } from "@/types/activity";

type WakeLockSentinelLike = { release: () => Promise<void> };
export function TableMode({ activity, onClose }: { activity: Activity; onClose: () => void }) {
  const [index,setIndex] = useState(0); const [seconds,setSeconds] = useState(60); const [running,setRunning] = useState(false); const [wakeLock,setWakeLock] = useState(false);
  useEffect(() => { let lock: WakeLockSentinelLike | null = null; const request = async () => { try { const nav = navigator as Navigator & { wakeLock?: { request: (type:"screen") => Promise<WakeLockSentinelLike> } }; if (nav.wakeLock) { lock = await nav.wakeLock.request("screen"); setWakeLock(true); } } catch { setWakeLock(false); } }; void request(); return () => { void lock?.release(); }; }, []);
  useEffect(() => { if (!running || seconds <= 0) return; const timer = setInterval(() => setSeconds((value) => { if (value <= 1) { setRunning(false); return 0; } return value - 1; }),1000); return () => clearInterval(timer); },[running,seconds]);
  const item = activity.instructions[index]; const display = `${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,"0")}`;
  return <div className="table-mode" role="dialog" aria-modal="true"><header><div><span>{activity.category}</span><h1>{activity.title}</h1></div><button onClick={onClose} aria-label="테이블 모드 닫기"><X /></button></header><main><section className="table-instruction"><span>진행 방법 {index+1} / {activity.instructions.length}</span><p>{item}</p><div><button onClick={() => setIndex((value) => Math.max(0,value-1))} disabled={index===0}><ChevronLeft /> 이전</button><button onClick={() => setIndex((value) => (value+1)%activity.instructions.length)}>다음 항목 <ChevronRight /></button></div></section><section className="table-timer"><Clock3 /><b className={seconds===0 ? "is-done" : ""}>{seconds===0 ? "TIME!" : display}</b><div>{[30,60,120,300].map((value) => <button className={seconds===value ? "is-active" : ""} onClick={() => { setSeconds(value); setRunning(false); }} key={value}>{value<60?`${value}초`:`${value/60}분`}</button>)}</div><button className="button button-primary" onClick={() => setRunning((value) => !value)}>{running ? "일시정지" : "타이머 시작"}</button></section></main><footer><span>{wakeLock ? "화면 꺼짐 방지 사용 중" : "화면 꺼짐 방지를 지원하지 않는 브라우저입니다."}</span>{activity.sourceType==="interactive"&&<a href={activity.externalUrl} target="_blank" rel="noreferrer">외부 페이지 활동 열기 <ExternalLink /></a>}</footer></div>;
}
