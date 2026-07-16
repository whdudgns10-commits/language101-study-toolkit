import { dailyStorageKey, getLocalDateKey, shiftDateKey } from "@/lib/daily-content";
import { getDailyPracticeExpressions } from "@/lib/daily-expression";
import type { Expression, PracticeDayRecord, PracticeExpression } from "@/types/expression";
import { addUniqueUpToFive } from "@/lib/expression-rules";

export const practiceStorageKey = (dateKey:string) => `language101-practice-expressions-${dateKey}`;
const blank = (date:string):PracticeDayRecord => ({ date,items:[],recommendationIds:[] });
export function readPracticeDay(date=getLocalDateKey()):PracticeDayRecord { if (typeof window === "undefined") return blank(date); try { const stored=localStorage.getItem(practiceStorageKey(date));if(stored)return{...blank(date),...JSON.parse(stored)};const selected=getDailyPracticeExpressions(date);const record={date,items:selected.map(item=>({id:`daily-${item.id}`,expression:item.expression,koreanMeaning:item.koreanMeaning,example:item.example,note:"",usageCount:0,source:"recommendation" as const,createdAt:`${date}T00:00:00`})),recommendationIds:selected.map(item=>item.id)};writePracticeDay(record);return record; } catch { return blank(date); } }
export function writePracticeDay(record:PracticeDayRecord) { localStorage.setItem(practiceStorageKey(record.date),JSON.stringify(record)); window.dispatchEvent(new CustomEvent("language101-study-change")); }
export function expressionToPractice(item:Expression,source:PracticeExpression["source"]="recommendation"):PracticeExpression { return { id:`${item.id}-${Date.now()}`,expression:item.expression,koreanMeaning:item.koreanMeaning,example:item.example,note:"",usageCount:0,source,createdAt:new Date().toISOString() }; }
function readStoredPracticeDay(date:string):PracticeDayRecord { if(typeof window==="undefined")return blank(date);try{const value=localStorage.getItem(practiceStorageKey(date));return value?{...blank(date),...JSON.parse(value)}:blank(date)}catch{return blank(date)} }
export function readRecentPracticeDays(date=getLocalDateKey(),days=30) { return Array.from({length:days},(_,index) => readStoredPracticeDay(shiftDateKey(date,-(index+1)))).filter((record) => record.items.length); }
export function readRecentRecommendationIds(date=getLocalDateKey(),days=7) { return readRecentPracticeDays(date,days).flatMap((record) => record.recommendationIds); }
export function addPracticeItems(record:PracticeDayRecord,items:PracticeExpression[]) { return { ...record,items:addUniqueUpToFive(record.items,items) }; }
export function migrateLegacyDailyState(date=getLocalDateKey()) { try { const key=dailyStorageKey(date); return JSON.parse(localStorage.getItem(key)||"{}"); } catch { return {}; } }
