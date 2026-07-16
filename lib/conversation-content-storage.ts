import { getLocalDateKey } from "@/lib/daily-content";
import { getStoredLanguage } from "@/lib/i18n";
export const CONTENT_EVENT="language101-content-change";
export const CONTENT_KEYS={favorites:"favoriteConversationContent",questions:"favoriteQuestions",roleplays:"favoriteRoleplays",recent:"recentConversationContent",completed:"completedConversationContent",used:"usedConversationContent",notes:"conversationContentNotes"} as const;
const read=<T,>(key:string,fallback:T):T=>{if(typeof window==="undefined")return fallback;try{return JSON.parse(localStorage.getItem(key)||"") as T}catch{return fallback}};
const write=(key:string,value:unknown)=>{localStorage.setItem(key,JSON.stringify(value));window.dispatchEvent(new CustomEvent(CONTENT_EVENT));window.dispatchEvent(new CustomEvent("language101-study-change"))};
const scoped=(key:string)=>`${key}:${getStoredLanguage()}`;
export const readIds=(key:string)=>{const current=read<string[]>(scoped(key),[]);return current.length||getStoredLanguage()!=="en"?current:read<string[]>(key,[])};
export function toggleContentId(key:string,id:string){const values=new Set(readIds(key));if(values.has(id))values.delete(id);else values.add(id);write(scoped(key),[...values]);return values.has(id)}
export function recordRecentContent(id:string){write(scoped(CONTENT_KEYS.recent),[id,...readIds(CONTENT_KEYS.recent).filter(item=>item!==id)].slice(0,30))}
export function markContent(id:string,key:typeof CONTENT_KEYS.completed|typeof CONTENT_KEYS.used){const date=getLocalDateKey();const map=readContentProgress(key);map[date]=[...new Set([...(map[date]||[]),id])];write(scoped(key),map)}
export const readContentProgress=(key:typeof CONTENT_KEYS.completed|typeof CONTENT_KEYS.used)=>{const current=read<Record<string,string[]>>(scoped(key),{});return Object.keys(current).length||getStoredLanguage()!=="en"?current:read<Record<string,string[]>>(key,{})};
export const readContentNotes=()=>{const current=read<Record<string,string>>(scoped(CONTENT_KEYS.notes),{});return Object.keys(current).length||getStoredLanguage()!=="en"?current:read<Record<string,string>>(CONTENT_KEYS.notes,{})};
export function saveContentNote(id:string,note:string){write(scoped(CONTENT_KEYS.notes),{...readContentNotes(),[id]:note})}
