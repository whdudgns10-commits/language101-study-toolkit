import { dailyStorageKey, getSeoulDateKey, shiftDateKey } from "@/lib/daily-content";
import type { Expression, PracticeDayRecord, PracticeExpression } from "@/types/expression";
import { addUniqueUpToFive } from "@/lib/expression-rules";

export const practiceStorageKey = (dateKey:string) => `language101-practice-expressions-${dateKey}`;
const blank = (date:string):PracticeDayRecord => ({ date,items:[],recommendationIds:[] });
export function readPracticeDay(date=getSeoulDateKey()):PracticeDayRecord { if (typeof window === "undefined") return blank(date); try { return { ...blank(date),...JSON.parse(localStorage.getItem(practiceStorageKey(date))||"{}") }; } catch { return blank(date); } }
export function writePracticeDay(record:PracticeDayRecord) { localStorage.setItem(practiceStorageKey(record.date),JSON.stringify(record)); }
export function expressionToPractice(item:Expression,source:PracticeExpression["source"]="recommendation"):PracticeExpression { return { id:`${item.id}-${Date.now()}`,expression:item.expression,koreanMeaning:item.koreanMeaning,example:item.example,note:"",usageCount:0,source,createdAt:new Date().toISOString() }; }
export function readRecentPracticeDays(date=getSeoulDateKey(),days=30) { return Array.from({length:days},(_,index) => readPracticeDay(shiftDateKey(date,-(index+1)))).filter((record) => record.items.length); }
export function readRecentRecommendationIds(date=getSeoulDateKey(),days=7) { return readRecentPracticeDays(date,days).flatMap((record) => record.recommendationIds); }
export function addPracticeItems(record:PracticeDayRecord,items:PracticeExpression[]) { return { ...record,items:addUniqueUpToFive(record.items,items) }; }
export function migrateLegacyDailyState(date=getSeoulDateKey()) { try { const key=dailyStorageKey(date); return JSON.parse(localStorage.getItem(key)||"{}"); } catch { return {}; } }
