"use client";
import { useCallback,useEffect,useMemo,useRef,useState } from "react";
import { CheckCircle2,Dices,RotateCcw,Shuffle,SlidersHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { randomEligibleActivities } from "@/data/activities";
import { useLanguage } from "@/hooks/use-language";
import { localizeActivity } from "@/lib/activity-localization";
import { activityFilterOptions,defaultFilters,filterActivities,type ActivityFilters } from "@/lib/activity-utils";
import { FILTER_STORAGE_KEY,RANDOM_HISTORY_KEY,RECENT_RANDOM_KEY } from "@/lib/navigation";
import { nextRandomHistory,pickRandomActivityIndex } from "@/lib/random-activity";
import type { Activity } from "@/types/activity";

const readJson=<T,>(key:string,fallback:T):T=>{try{return JSON.parse(localStorage.getItem(key)||"") as T}catch{return fallback}};

export function ActivityWheel(){
 const {language,t}=useLanguage();const router=useRouter();
 const shuffleIntervalRef=useRef<ReturnType<typeof setInterval>|null>(null);const shuffleTimeoutRef=useRef<ReturnType<typeof setTimeout>|null>(null);const navigationTimerRef=useRef<ReturnType<typeof setTimeout>|null>(null);const finalActivityRef=useRef<Activity|null>(null);const navigationStartedRef=useRef(false);
 const [filters,setFilters]=useState<ActivityFilters>(defaultFilters);const [history,setHistory]=useState<string[]>([]);const [displayActivity,setDisplayActivity]=useState<Activity|null>(null);const [finalActivity,setFinalActivity]=useState<Activity|null>(null);const [isShuffling,setIsShuffling]=useState(false);const [showFilters,setShowFilters]=useState(false);
 const eligibleActivities=useMemo(()=>filterActivities(randomEligibleActivities,filters),[filters]);const hasFilters=Object.keys(filters).some(key=>filters[key as keyof ActivityFilters]!==defaultFilters[key as keyof ActivityFilters]);

 const clearTimers=useCallback(()=>{if(shuffleIntervalRef.current)clearInterval(shuffleIntervalRef.current);if(shuffleTimeoutRef.current)clearTimeout(shuffleTimeoutRef.current);if(navigationTimerRef.current)clearTimeout(navigationTimerRef.current);shuffleIntervalRef.current=null;shuffleTimeoutRef.current=null;navigationTimerRef.current=null},[]);
 const clearSelection=useCallback(()=>{clearTimers();navigationStartedRef.current=false;finalActivityRef.current=null;setIsShuffling(false);setDisplayActivity(null);setFinalActivity(null)},[clearTimers]);
 useEffect(()=>{const timer=setTimeout(()=>{const saved={...defaultFilters,...readJson<Partial<ActivityFilters>>(FILTER_STORAGE_KEY,{})};setFilters(saved);setHistory(readJson<string[]>(RANDOM_HISTORY_KEY,[]))},0);return()=>clearTimeout(timer)},[]);
 useEffect(()=>{const timer=setTimeout(()=>clearSelection(),0);return()=>clearTimeout(timer)},[language,clearSelection]);
 useEffect(()=>()=>clearTimers(),[clearTimers]);
 function update<K extends keyof ActivityFilters>(key:K,value:ActivityFilters[K]){const next={...filters,[key]:value};clearSelection();setFilters(next);localStorage.setItem(FILTER_STORAGE_KEY,JSON.stringify(next))}
 function resetFilters(){clearSelection();setFilters(defaultFilters);localStorage.setItem(FILTER_STORAGE_KEY,JSON.stringify(defaultFilters))}
 function finishShuffle(chosen:Activity){if(finalActivityRef.current!==chosen||navigationStartedRef.current)return;clearTimers();setDisplayActivity(chosen);setFinalActivity(chosen);setIsShuffling(false);const next=nextRandomHistory(history,chosen.id);setHistory(next);localStorage.setItem(RANDOM_HISTORY_KEY,JSON.stringify(next));localStorage.setItem(RECENT_RANDOM_KEY,chosen.id);navigationStartedRef.current=true;const targetSlug=chosen.slug||chosen.id;navigationTimerRef.current=setTimeout(()=>{clearTimers();router.push(`/activities/${targetSlug}`)},800)}
 function spin(){if(isShuffling||finalActivity||!eligibleActivities.length)return;clearSelection();const selectedIndex=pickRandomActivityIndex(eligibleActivities,history);if(selectedIndex<0)return;const chosen=eligibleActivities[selectedIndex];finalActivityRef.current=chosen;setIsShuffling(true);setDisplayActivity(eligibleActivities[(selectedIndex+1)%eligibleActivities.length]||chosen);const started=Date.now();let cursor=selectedIndex+1;let lastChange=0;shuffleIntervalRef.current=setInterval(()=>{const elapsed=Date.now()-started;const delay=elapsed<1000?90:elapsed<1700?160:280;if(elapsed-lastChange<delay)return;lastChange=elapsed;cursor=(cursor+1)%eligibleActivities.length;const preview=eligibleActivities[cursor];if(preview&&preview.id!==chosen.id)setDisplayActivity(preview)},40);shuffleTimeoutRef.current=setTimeout(()=>finishShuffle(chosen),2200)}

 const localized=displayActivity?localizeActivity(displayActivity,language):null;const filterLabels={level:t("filter.level"),duration:t("activity.duration"),groupSize:t("filter.group"),category:t("filter.category")};
 return <section className="wheel-section activity-shuffle-section">
  <header className="shuffle-toolbar"><div><b>{t("randomActivity.title")}</b><p>{eligibleActivities.length} {t("randomActivity.available")}</p></div><button type="button" disabled={isShuffling||Boolean(finalActivity)} onClick={()=>setShowFilters(value=>!value)}><SlidersHorizontal/>{t("randomActivity.filters")}</button></header>
  {showFilters&&<div className="wheel-filter-panel shuffle-filters"><header><b>{t("randomActivity.filters")}</b>{hasFilters&&<button disabled={isShuffling||Boolean(finalActivity)} onClick={resetFilters}><RotateCcw/>{t("randomActivity.reset")}</button>}</header><div>{(["level","duration","groupSize","category"] as const).map(key=><label key={key}>{filterLabels[key]}<select value={filters[key]} disabled={isShuffling||Boolean(finalActivity)} onChange={event=>update(key,event.target.value as never)}>{activityFilterOptions[key].map(value=><option key={value}>{value}</option>)}</select></label>)}</div></div>}
  {!eligibleActivities.length?<div className="wheel-empty"><h2>{t("randomActivity.noMatches")}</h2><button className="button button-primary" onClick={resetFilters}>{t("randomActivity.reset")}</button></div>:<>
   <div className={`activity-shuffle-card${isShuffling?" is-shuffling":""}${finalActivity?" is-selected":""}`} aria-live="polite">
    <span className="shuffle-card-icon">{finalActivity?<CheckCircle2/>:isShuffling?<Shuffle/>:<Dices/>}</span>
    {!displayActivity?<><em>{t("randomActivity.ready")}</em><h2>{t("randomActivity.title")}</h2><p>{t("randomActivity.readyDesc")}</p></>:<><em>{displayActivity.category}</em><h2 key={displayActivity.id}>{finalActivity?localized?.title:localized?.shortTitle}</h2><p>{localized?.description}</p></>}
    {finalActivity&&<strong>{localized?.title} {t("randomActivity.selected")}<small>{t("randomActivity.opening")}</small></strong>}
   </div>
   <button className="shuffle-spin-button" type="button" onClick={spin} disabled={isShuffling||Boolean(finalActivity)}>{isShuffling?<><Shuffle/>{t("randomActivity.shuffling")}</>:<><Dices/>{t("randomActivity.spin")}</>}</button>
  </>}
 </section>
}
