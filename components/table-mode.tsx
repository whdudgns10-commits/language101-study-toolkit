"use client";

import { ChevronLeft, ChevronRight, Clock3, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { Activity } from "@/types/activity";
import { useLanguage } from "@/hooks/use-language";

type WakeLockSentinelLike = { release: () => Promise<void> };
export function TableMode({ activity, onClose }: { activity: Activity; onClose: () => void }) {
  const {t}=useLanguage();
  const [index,setIndex] = useState(0); const [seconds,setSeconds] = useState(60); const [running,setRunning] = useState(false); const [wakeLock,setWakeLock] = useState(false);
  useEffect(() => { let lock: WakeLockSentinelLike | null = null; const request = async () => { try { const nav = navigator as Navigator & { wakeLock?: { request: (type:"screen") => Promise<WakeLockSentinelLike> } }; if (nav.wakeLock) { lock = await nav.wakeLock.request("screen"); setWakeLock(true); } } catch { setWakeLock(false); } }; void request(); return () => { void lock?.release(); }; }, []);
  useEffect(() => { if (!running || seconds <= 0) return; const timer = setInterval(() => setSeconds((value) => { if (value <= 1) { setRunning(false); return 0; } return value - 1; }),1000); return () => clearInterval(timer); },[running,seconds]);
  const item = activity.instructions[index]; const display = `${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,"0")}`;
  return <div className="table-mode" role="dialog" aria-modal="true"><header><div><span>{activity.category}</span><h1>{activity.title}</h1></div><button onClick={onClose} aria-label={t("table.close")}><X /></button></header><main><section className="table-instruction"><span>{t("table.instructions")} {index+1} / {activity.instructions.length}</span><p>{item}</p><div><button onClick={() => setIndex((value) => Math.max(0,value-1))} disabled={index===0}><ChevronLeft /> {t("common.previous")}</button><button onClick={() => setIndex((value) => (value+1)%activity.instructions.length)}>{t("table.nextItem")} <ChevronRight /></button></div></section><section className="table-timer"><Clock3 /><b className={seconds===0 ? "is-done" : ""}>{seconds===0 ? "TIME!" : display}</b><div>{[30,60,120,300].map((value) => <button className={seconds===value ? "is-active" : ""} onClick={() => { setSeconds(value); setRunning(false); }} key={value}>{value<60?`${value}${t("table.seconds")}`:`${value/60}${t("table.minutes")}`}</button>)}</div><button className="button button-primary" onClick={() => setRunning((value) => !value)}>{running ? t("table.pause") : t("table.start")}</button></section></main><footer><span>{wakeLock ? t("table.wakeOn") : t("table.wakeOff")}</span></footer></div>;
}
