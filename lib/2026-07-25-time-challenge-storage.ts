import { defaultTimeChallengePenalties,type TimeChallengeDifficulty,type TimeChallengePenalty } from "@/data/2026-07-25-time-challenge";

export const TIME_CHALLENGE_KEYS={settings:"language101-time-challenge-settings",penalties:"language101-time-challenge-penalties"} as const;
export type TimeChallengeSettings={minutes:1|2|3|4|5;sound:boolean;difficulty:TimeChallengeDifficulty;lastUsedAt:string};
const defaults:TimeChallengeSettings={minutes:1,sound:true,difficulty:"beginner",lastUsedAt:""};
function read<T>(key:string,fallback:T):T{if(typeof window==="undefined")return fallback;try{const value=localStorage.getItem(key);return value?JSON.parse(value) as T:fallback}catch{return fallback}}
function write(key:string,value:unknown){localStorage.setItem(key,JSON.stringify(value));window.dispatchEvent(new CustomEvent("language101-study-change",{detail:{key}}))}
export const readTimeChallengeSettings=()=>read<TimeChallengeSettings>(TIME_CHALLENGE_KEYS.settings,defaults);
export const saveTimeChallengeSettings=(settings:TimeChallengeSettings)=>write(TIME_CHALLENGE_KEYS.settings,settings);
export const readTimeChallengePenalties=()=>read<TimeChallengePenalty[]>(TIME_CHALLENGE_KEYS.penalties,defaultTimeChallengePenalties);
export const saveTimeChallengePenalties=(items:TimeChallengePenalty[])=>write(TIME_CHALLENGE_KEYS.penalties,items);
