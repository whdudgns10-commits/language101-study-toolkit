import { expressions } from "@/data/expressions";
import { selectDailyItem, selectDistinctDailyItems, shiftDateKey, seededHash } from "@/lib/daily-content";
import type { Expression, ExpressionLevel } from "@/types/expression";
import { uniqueRecommendations } from "@/lib/expression-rules";

export const levelLabels: Record<ExpressionLevel,string> = { beginner:"초급 Beginner", intermediate:"중급 Intermediate", advanced:"상급 Advanced" };
export function expressionsByLevel(level:ExpressionLevel) { return expressions.filter((item) => item.level === level); }
export function getDailyExpression(level:ExpressionLevel,dateKey:string,offset=0) { return selectDailyItem(expressionsByLevel(level),dateKey,`daily-expression:${level}`,offset,30); }
export function getRelatedExpressions(primary:Expression,count=2) { const named = primary.similarExpressions.map((name) => expressions.find((item) => item.expression === name)).filter((item):item is Expression => item !== undefined && item.id !== primary.id); const same = expressions.filter((item) => item.level === primary.level && item.category === primary.category && item.id !== primary.id); return [...named,...same].filter((item,index,all) => all.findIndex((candidate) => candidate.id === item.id) === index).slice(0,count); }
export function getRecommendedExpressions(level:ExpressionLevel|"mixed",dateKey:string,reroll:number,recentIds:readonly string[],count=5) { const pool = (level === "mixed" ? expressions : expressionsByLevel(level)).filter(item=>item.recommendedForPractice); const ranked = pool.map((item) => ({ item, score:seededHash(`${dateKey}:recommend:${level}:${reroll}:${item.id}`)/(4-(item.practicePriority??3)) })).sort((a,b) => a.score-b.score).map(({item})=>item); const fresh=uniqueRecommendations(ranked,recentIds,ranked.length);const categories=new Set<string>();const diverse=fresh.filter(item=>{if(categories.has(item.category))return false;categories.add(item.category);return true;});return [...diverse,...fresh.filter(item=>!diverse.includes(item))].slice(0,count); }
export function getDailyPracticeExpressions(dateKey:string,count=5){return selectDistinctDailyItems(expressions.filter(item=>item.recommendedForPractice),count,dateKey,"daily-practice",7);}
export function previousDateKeys(dateKey:string,days=14) { return Array.from({length:days},(_,index) => shiftDateKey(dateKey,-(index+1))); }
