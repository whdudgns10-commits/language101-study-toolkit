import type { SituationLevel,SituationWord } from "@/data/situation-sentence-game";
import type { SituationMode } from "@/lib/situation-sentence-game";
export const SITUATION_DRAFT_KEY="language101-situation-story-draft";
export const SITUATION_SETTINGS_KEY="language101-situation-story-settings";
export const SITUATION_PRACTICE_KEY="language101-sentence-story-practice";
export const SITUATION_FAVORITES_KEY="language101-situation-favorite-combinations";
export type SituationPractice={id:string;date:string;cards:SituationWord[];story:string;level:SituationLevel;mode:SituationMode;confidence:number;favorite:boolean;createdAt:string};
const read=<T>(key:string,fallback:T):T=>{if(typeof window==="undefined")return fallback;try{return JSON.parse(localStorage.getItem(key)||"") as T}catch{return fallback}};
export const readSituationPractices=()=>read<SituationPractice[]>(SITUATION_PRACTICE_KEY,[]);
export function saveSituationPractice(entry:SituationPractice){const items=readSituationPractices();localStorage.setItem(SITUATION_PRACTICE_KEY,JSON.stringify([entry,...items.filter(item=>item.id!==entry.id)]));window.dispatchEvent(new CustomEvent("language101-study-change"));}
export const readSituationFavorites=()=>read<string[]>(SITUATION_FAVORITES_KEY,[]);
export function toggleSituationFavorite(id:string){const values=new Set(readSituationFavorites());if(values.has(id))values.delete(id);else values.add(id);localStorage.setItem(SITUATION_FAVORITES_KEY,JSON.stringify([...values]));window.dispatchEvent(new CustomEvent("language101-study-change"));return values.has(id)}
