import type { FunnyQuestion, FunnyQuestionCategory, FunnyQuestionDifficulty, FunnyQuestionSensitivity } from "@/data/2026-07-17-funny-questions";

export const FUNNY_STORAGE={favorites:"funnyQuestionsFavorites",ratings:"funnyQuestionsRatings",stats:"funnyQuestionsStats",session:"funnyQuestionsSession",study:"funnyQuestionsStudySessions"} as const;
export type FunnyFavorite={questionId:string;questionEn:string;questionKo:string;category:FunnyQuestionCategory;difficulty:FunnyQuestionDifficulty;sensitivity:FunnyQuestionSensitivity;favoriteDate:string};
export type FunnyRating="very-funny"|"fun"|"easy"|"interesting";
export type FunnySessionRecord={id:string;activity:"funny-questions";date:string;mode:string;participants:string[];viewedCount:number;answeredQuestionIds:string[];categories:FunnyQuestionCategory[];favoriteQuestionIds:string[];funniestQuestionId?:string;reactions:string[];memo:string;createdAt:string};

function read<T>(key:string,fallback:T):T{if(typeof window==="undefined")return fallback;try{return JSON.parse(localStorage.getItem(key)||"") as T}catch{return fallback}}
function write<T>(key:string,value:T){if(typeof window!=="undefined"){localStorage.setItem(key,JSON.stringify(value));window.dispatchEvent(new CustomEvent("language101-study-sync",{detail:{key}}));}}
export const readFunnyFavorites=()=>read<FunnyFavorite[]>(FUNNY_STORAGE.favorites,[]);
export function toggleFunnyFavorite(question:FunnyQuestion){const items=readFunnyFavorites();const exists=items.some(item=>item.questionId===question.id);const next=exists?items.filter(item=>item.questionId!==question.id):[...items,{questionId:question.id,questionEn:question.question.en,questionKo:question.question.ko,category:question.category,difficulty:question.difficulty,sensitivity:question.sensitivity,favoriteDate:new Date().toISOString()}];write(FUNNY_STORAGE.favorites,next);return next;}
export const readFunnyRatings=()=>read<Record<string,FunnyRating>>(FUNNY_STORAGE.ratings,{});
export function saveFunnyRating(id:string,rating:FunnyRating){const next={...readFunnyRatings(),[id]:rating};write(FUNNY_STORAGE.ratings,next);return next;}
export function incrementFunnyStat(id:string,field:"viewed"|"skipped"){const stats=read<Record<string,{viewed:number;skipped:number}>>(FUNNY_STORAGE.stats,{});const current=stats[id]||{viewed:0,skipped:0};stats[id]={...current,[field]:current[field]+1};write(FUNNY_STORAGE.stats,stats);}
export function saveFunnySession(record:FunnySessionRecord){const records=read<FunnySessionRecord[]>(FUNNY_STORAGE.study,[]);write(FUNNY_STORAGE.study,[record,...records]);const legacy=read<unknown[]>("studyActivitySessions",[]);write("studyActivitySessions",[record,...legacy]);}
