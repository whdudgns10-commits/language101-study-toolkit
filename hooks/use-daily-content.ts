"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { expressions } from "@/data/expressions";
import { missions } from "@/data/missions";
import { dailyStorageKey, getLocalDateKey, selectDailyItem, selectDistinctCategoryItems, shiftDateKey } from "@/lib/daily-content";
import { clearMissionProgress } from "@/lib/study-storage";
import { useLanguage } from "@/hooks/use-language";

export type DailyBrowserState = { expressionOffset: number; missionOffset: number; expressionUsed: boolean; usedExpressionIds:string[]; completedMissionIds: string[] };
const emptyState: DailyBrowserState = { expressionOffset: 0, missionOffset: 0, expressionUsed: false, usedExpressionIds:[], completedMissionIds: [] };
const readJson=(key:string)=>{try{return JSON.parse(localStorage.getItem(key)||"{}") as Partial<DailyBrowserState>}catch{return{}}};
const readState = (dateKey: string,language:string): DailyBrowserState => { const languageState=readJson(dailyStorageKey(dateKey,language));const legacy=readJson(dailyStorageKey(dateKey));const shared=language==="en"?{...legacy,...languageState}:readJson(dailyStorageKey(dateKey,"en"));return { ...emptyState,...languageState,expressionOffset:shared.expressionOffset??0,expressionUsed:shared.expressionUsed??false,usedExpressionIds:shared.usedExpressionIds??[] }; };
const writeState = (dateKey: string,language:string,value: DailyBrowserState) => { const languageKey=dailyStorageKey(dateKey,language);const languageState=readJson(languageKey);localStorage.setItem(languageKey,JSON.stringify({...languageState,missionOffset:value.missionOffset,completedMissionIds:value.completedMissionIds,...(language==="en"?{expressionOffset:value.expressionOffset,expressionUsed:value.expressionUsed,usedExpressionIds:value.usedExpressionIds}:{})}));if(language!=="en"){const sharedKey=dailyStorageKey(dateKey,"en");localStorage.setItem(sharedKey,JSON.stringify({...readJson(sharedKey),expressionOffset:value.expressionOffset,expressionUsed:value.expressionUsed,usedExpressionIds:value.usedExpressionIds}))}window.dispatchEvent(new CustomEvent("language101-study-change")); };

export function useDailyContent() {
  const {language}=useLanguage();
  const [dateKey, setDateKey] = useState(() => getLocalDateKey());
  const [browserState, setBrowserState] = useState<DailyBrowserState>(emptyState);
  useEffect(() => { const timer = setTimeout(() => setBrowserState(readState(dateKey,language)), 0); return () => clearTimeout(timer); }, [dateKey,language]);
  useEffect(() => { const sync=()=>setBrowserState(readState(dateKey,language)); window.addEventListener("language101-study-change",sync); window.addEventListener("storage",sync); return()=>{window.removeEventListener("language101-study-change",sync);window.removeEventListener("storage",sync)}; },[dateKey,language]);
  useEffect(() => {
    const refreshDate = () => { const next = getLocalDateKey(); if (next !== dateKey) setDateKey(next); };
    const nextMidnight = new Date(`${shiftDateKey(dateKey, 1)}T00:00:00`).getTime();
    const timer = window.setTimeout(refreshDate, Math.max(250, nextMidnight - Date.now() + 100));
    document.addEventListener("visibilitychange", refreshDate);
    return () => { clearTimeout(timer); document.removeEventListener("visibilitychange", refreshDate); };
  }, [dateKey]);
  const update = useCallback((next: DailyBrowserState) => { setBrowserState(next); writeState(dateKey,language,next); }, [dateKey,language]);
  const expressionPool=useMemo(()=>expressions.filter(item=>item.level==="beginner"),[]);
  const primaryExpression = useMemo(() => selectDailyItem(expressionPool, dateKey, "daily-english-expression", browserState.expressionOffset,30), [dateKey,browserState.expressionOffset,expressionPool]);
  const relatedExpressions = useMemo(() => { if(!primaryExpression.expression)return[];const named = primaryExpression.similarExpressions.map((name) => expressions.find((item) => item.expression === name)).filter((item): item is (typeof expressions)[number] => item !== undefined && item.id !== primaryExpression.id); const fallback = expressions.filter((item) => item.category === primaryExpression.category && item.id !== primaryExpression.id); return [...named, ...fallback].filter((item, index, all) => all.findIndex((candidate) => candidate.id === item.id) === index).slice(0, 2); }, [primaryExpression]);
  const yesterdayExpression = useMemo(() => selectDailyItem(expressions, shiftDateKey(dateKey, -1), "daily-english-expression"), [dateKey]);
  const missionPool=useMemo(()=>language==="en"?missions.map(item=>({...item,textKo:item.textEn})):language==="ko"?missions.map(item=>({...item,textEn:item.textKo})):[],[language]);
  const dailyMissions = useMemo(() => selectDistinctCategoryItems(missionPool, 3, dateKey, `${language}:missions`, browserState.missionOffset), [dateKey,language,browserState.missionOffset,missionPool]);
  return { dateKey, primaryExpression, relatedExpressions, yesterdayExpression, dailyMissions, expressionUsed: browserState.expressionUsed, completedMissionIds: browserState.completedMissionIds,
    showAnotherExpression: () => update({ ...browserState, expressionOffset: browserState.expressionOffset + 1, expressionUsed: false }),
    rerollMissions: () => { clearMissionProgress(dateKey,language);update({ ...browserState, missionOffset: browserState.missionOffset + 1, completedMissionIds: [] }); },
    toggleExpressionUsed: () => update({ ...browserState, expressionUsed: !browserState.expressionUsed }),
    toggleDailyExpression: (id:string) => update({ ...browserState, usedExpressionIds:browserState.usedExpressionIds.includes(id)?browserState.usedExpressionIds.filter((item)=>item!==id):[...browserState.usedExpressionIds,id] }),
    usedExpressionIds:browserState.usedExpressionIds,
    toggleMission: (id: string) => update({ ...browserState, completedMissionIds: browserState.completedMissionIds.includes(id) ? browserState.completedMissionIds.filter((item) => item !== id) : [...browserState.completedMissionIds, id] }),
  };
}

export function getDailyBrowserState(dateKey = getLocalDateKey(),language="en") { if (typeof window === "undefined") return emptyState; return readState(dateKey,language); }
