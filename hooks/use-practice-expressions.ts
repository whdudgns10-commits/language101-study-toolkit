"use client";

import { useCallback,useEffect,useMemo,useState } from "react";
import { getSeoulDateKey,shiftDateKey } from "@/lib/daily-content";
import { addPracticeItems,expressionToPractice,readPracticeDay,readRecentPracticeDays,writePracticeDay } from "@/lib/practice-expression-storage";
import type { Expression,PracticeDayRecord,PracticeExpression } from "@/types/expression";

export function usePracticeExpressions() {
  const [dateKey,setDateKey]=useState(() => getSeoulDateKey()); const [record,setRecord]=useState<PracticeDayRecord>({date:dateKey,items:[],recommendationIds:[]}); const [ready,setReady]=useState(false);
  useEffect(() => { const timer=setTimeout(() => { setRecord(readPracticeDay(dateKey)); setReady(true); },0); return()=>clearTimeout(timer); },[dateKey]);
  useEffect(() => { const sync=(event:Event)=>{ const detail=(event as CustomEvent<PracticeDayRecord>).detail; if(detail?.date===dateKey)setRecord(detail); }; window.addEventListener("language101-practice-change",sync); return()=>window.removeEventListener("language101-practice-change",sync); },[dateKey]);
  useEffect(() => { const refresh=()=>{ const next=getSeoulDateKey(); if(next!==dateKey)setDateKey(next); }; const midnight=new Date(`${shiftDateKey(dateKey,1)}T00:00:00+09:00`).getTime(); const timer=setTimeout(refresh,Math.max(250,midnight-Date.now()+100)); document.addEventListener("visibilitychange",refresh); return()=>{clearTimeout(timer);document.removeEventListener("visibilitychange",refresh);}; },[dateKey]);
  const persist=useCallback((next:PracticeDayRecord)=>{setRecord(next);writePracticeDay(next);window.dispatchEvent(new CustomEvent("language101-practice-change",{detail:next}));},[]);
  const addManual=(values:{expression:string;koreanMeaning:string;example:string})=>{ if(record.items.length>=5)return false; const item:PracticeExpression={id:`manual-${Date.now()}`,expression:values.expression.trim(),koreanMeaning:values.koreanMeaning.trim(),example:values.example.trim(),note:"",usageCount:0,source:"manual",createdAt:new Date().toISOString()}; if(!item.expression||record.items.some((entry)=>entry.expression.toLowerCase()===item.expression.toLowerCase()))return false; persist({...record,items:[...record.items,item]});return true; };
  const addExpressions=(values:Expression[],source:PracticeExpression["source"]="recommendation")=>{const items=values.map((item)=>expressionToPractice(item,source));const next=addPracticeItems(record,items);persist({...next,recommendationIds:source==="recommendation"?[...new Set([...record.recommendationIds,...values.map((item)=>item.id)])]:record.recommendationIds});return next.items.length-record.items.length;};
  const update=(id:string,patch:Partial<PracticeExpression>)=>persist({...record,items:record.items.map((item)=>item.id===id?{...item,...patch}:item)});
  const remove=(id:string)=>persist({...record,items:record.items.filter((item)=>item.id!==id)});
  const yesterday=readPracticeDay(shiftDateKey(dateKey,-1)); const recent=useMemo(()=>ready?readRecentPracticeDays(dateKey):[],[dateKey,ready]);
  return {dateKey,record,ready,items:record.items,completedCount:record.items.filter((item)=>item.usageCount>0).length,totalUsageCount:record.items.reduce((sum,item)=>sum+item.usageCount,0),addManual,addExpressions,update,remove,yesterday,recent};
}
