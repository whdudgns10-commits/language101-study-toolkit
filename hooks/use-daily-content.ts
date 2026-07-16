"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { expressions } from "@/data/expressions";
import { missions } from "@/data/missions";
import { dailyStorageKey, getSeoulDateKey, selectDailyItem, selectDistinctCategoryItems, shiftDateKey } from "@/lib/daily-content";

export type DailyBrowserState = { expressionOffset: number; missionOffset: number; expressionUsed: boolean; usedExpressionIds:string[]; completedMissionIds: string[] };
const emptyState: DailyBrowserState = { expressionOffset: 0, missionOffset: 0, expressionUsed: false, usedExpressionIds:[], completedMissionIds: [] };
const readState = (dateKey: string): DailyBrowserState => { try { return { ...emptyState, ...JSON.parse(localStorage.getItem(dailyStorageKey(dateKey)) || "{}") }; } catch { return emptyState; } };
const writeState = (dateKey: string, value: DailyBrowserState) => { localStorage.setItem(dailyStorageKey(dateKey), JSON.stringify(value)); window.dispatchEvent(new CustomEvent("language101-study-change")); };

export function useDailyContent() {
  const [dateKey, setDateKey] = useState(() => getSeoulDateKey());
  const [browserState, setBrowserState] = useState<DailyBrowserState>(emptyState);
  useEffect(() => { const timer = setTimeout(() => setBrowserState(readState(dateKey)), 0); return () => clearTimeout(timer); }, [dateKey]);
  useEffect(() => { const sync=()=>setBrowserState(readState(dateKey)); window.addEventListener("language101-study-change",sync); return()=>window.removeEventListener("language101-study-change",sync); },[dateKey]);
  useEffect(() => {
    const refreshDate = () => { const next = getSeoulDateKey(); if (next !== dateKey) setDateKey(next); };
    const nextMidnight = new Date(`${shiftDateKey(dateKey, 1)}T00:00:00+09:00`).getTime();
    const timer = window.setTimeout(refreshDate, Math.max(250, nextMidnight - Date.now() + 100));
    document.addEventListener("visibilitychange", refreshDate);
    return () => { clearTimeout(timer); document.removeEventListener("visibilitychange", refreshDate); };
  }, [dateKey]);
  const update = useCallback((next: DailyBrowserState) => { setBrowserState(next); writeState(dateKey, next); }, [dateKey]);
  const primaryExpression = useMemo(() => selectDailyItem(expressions, dateKey, "expression", browserState.expressionOffset), [dateKey, browserState.expressionOffset]);
  const relatedExpressions = useMemo(() => { const named = primaryExpression.similarExpressions.map((name) => expressions.find((item) => item.expression === name)).filter((item): item is (typeof expressions)[number] => item !== undefined && item.id !== primaryExpression.id); const fallback = expressions.filter((item) => item.category === primaryExpression.category && item.id !== primaryExpression.id); return [...named, ...fallback].filter((item, index, all) => all.findIndex((candidate) => candidate.id === item.id) === index).slice(0, 2); }, [primaryExpression]);
  const yesterdayExpression = useMemo(() => selectDailyItem(expressions, shiftDateKey(dateKey, -1), "expression"), [dateKey]);
  const dailyMissions = useMemo(() => selectDistinctCategoryItems(missions, 3, dateKey, "missions", browserState.missionOffset), [dateKey, browserState.missionOffset]);
  return { dateKey, primaryExpression, relatedExpressions, yesterdayExpression, dailyMissions, expressionUsed: browserState.expressionUsed, completedMissionIds: browserState.completedMissionIds,
    showAnotherExpression: () => update({ ...browserState, expressionOffset: browserState.expressionOffset + 1, expressionUsed: false }),
    rerollMissions: () => update({ ...browserState, missionOffset: browserState.missionOffset + 1, completedMissionIds: [] }),
    toggleExpressionUsed: () => update({ ...browserState, expressionUsed: !browserState.expressionUsed }),
    toggleDailyExpression: (id:string) => update({ ...browserState, usedExpressionIds:browserState.usedExpressionIds.includes(id)?browserState.usedExpressionIds.filter((item)=>item!==id):[...browserState.usedExpressionIds,id] }),
    usedExpressionIds:browserState.usedExpressionIds,
    toggleMission: (id: string) => update({ ...browserState, completedMissionIds: browserState.completedMissionIds.includes(id) ? browserState.completedMissionIds.filter((item) => item !== id) : [...browserState.completedMissionIds, id] }),
  };
}

export function getDailyBrowserState(dateKey = getSeoulDateKey()) { if (typeof window === "undefined") return emptyState; return readState(dateKey); }
