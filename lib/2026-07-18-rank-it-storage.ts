import type { RankItCategory,RankItDifficulty } from "@/data/rank-it-topics";

export const RANK_IT_KEYS={favorites:"language101-rank-it-favorites",history:"language101-rank-it-history",session:"language101-rank-it-session"} as const;
export type RankItSavedRanking={player:string;optionIds:string[]};
export type RankItPracticeRecord={id:string;activity:"rank-it";date:string;topicId:string;topicTitle:string;ranking:string[];participantRankings:RankItSavedRanking[];averageRanking:Array<{option:string;average:number}>;mostPopular:string;mostDivisive:string;followUps:string[];memo:string;favorite:boolean;category:RankItCategory;difficulty:RankItDifficulty;createdAt:string};
export type RankItSessionDraft={topicId:string;order:string[];mode:"quick"|"group";players:string[];playerIndex:number;rankings:RankItSavedRanking[];seen:string[];history:string[];historyIndex:number;funOn:boolean;timer:number;category:RankItCategory|"all";difficulty:RankItDifficulty|"all";updatedAt:string};

function read<T>(key:string,fallback:T):T{if(typeof window==="undefined")return fallback;try{const value=localStorage.getItem(key);return value?JSON.parse(value) as T:fallback}catch{return fallback}}
function write(key:string,value:unknown){localStorage.setItem(key,JSON.stringify(value));window.dispatchEvent(new CustomEvent("language101-study-change",{detail:{key}}))}
export const readRankItFavorites=()=>read<string[]>(RANK_IT_KEYS.favorites,[]);
export function toggleRankItFavorite(id:string){const next=new Set(readRankItFavorites());if(next.has(id))next.delete(id);else next.add(id);write(RANK_IT_KEYS.favorites,[...next]);return[...next]}
export const readRankItHistory=()=>read<RankItPracticeRecord[]>(RANK_IT_KEYS.history,[]);
export function saveRankItPractice(record:RankItPracticeRecord){write(RANK_IT_KEYS.history,[record,...readRankItHistory().filter(item=>item.id!==record.id)].slice(0,100))}
export const readRankItDraft=()=>read<RankItSessionDraft|null>(RANK_IT_KEYS.session,null);
export const saveRankItDraft=(draft:RankItSessionDraft)=>write(RANK_IT_KEYS.session,draft);
export const clearRankItDraft=()=>{if(typeof window!=="undefined"){localStorage.removeItem(RANK_IT_KEYS.session);window.dispatchEvent(new CustomEvent("language101-study-change"))}};

export function calculateRankItStats(rankings:RankItSavedRanking[],labels:Record<string,string>){
 const ids=[...new Set(rankings.flatMap(item=>item.optionIds))];
 const averageRanking=ids.map(id=>{const values=rankings.map(item=>item.optionIds.indexOf(id)+1).filter(rank=>rank>0);return{option:labels[id]||id,average:values.reduce((sum,value)=>sum+value,0)/Math.max(1,values.length)}}).sort((a,b)=>a.average-b.average);
 const firstCounts=new Map<string,number>();for(const ranking of rankings){const first=ranking.optionIds[0];if(first)firstCounts.set(first,(firstCounts.get(first)||0)+1)}
 const mostPopularId=[...firstCounts].sort((a,b)=>b[1]-a[1])[0]?.[0]||ids[0]||"";
 const spread=ids.map(id=>{const values=rankings.map(item=>item.optionIds.indexOf(id)+1).filter(rank=>rank>0);const mean=values.reduce((sum,value)=>sum+value,0)/Math.max(1,values.length);return{id,variance:values.reduce((sum,value)=>sum+(value-mean)**2,0)/Math.max(1,values.length)}}).sort((a,b)=>b.variance-a.variance);
 const distance=(a:RankItSavedRanking,b:RankItSavedRanking)=>a.optionIds.reduce((sum,id)=>sum+Math.abs(a.optionIds.indexOf(id)-b.optionIds.indexOf(id)),0);
 const pairs=rankings.flatMap((a,index)=>rankings.slice(index+1).map(b=>({names:`${a.player} & ${b.player}`,distance:distance(a,b)}))).sort((a,b)=>a.distance-b.distance);
 return{averageRanking,mostPopular:labels[mostPopularId]||mostPopularId,mostDivisive:labels[spread[0]?.id]||spread[0]?.id||"",mostSimilar:pairs[0]?.names||"—",mostDifferent:pairs.at(-1)?.names||"—"};
}
