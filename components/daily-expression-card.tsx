"use client";

import { BookHeart,Check,Copy,Heart,Plus } from "lucide-react";
import { useEffect,useState } from "react";
import { getRelatedExpressions } from "@/lib/daily-expression";
import { getExpressionFavorites,toggleExpressionFavorite } from "@/lib/storage";
import { useDailyContent } from "@/hooks/use-daily-content";
import { usePracticeExpressions } from "@/hooks/use-practice-expressions";
import type { Expression } from "@/types/expression";
import { saveExpression,studyId } from "@/lib/study-storage";
import { useLanguage } from "@/hooks/use-language";

export function DailyExpressionCard({item}:{item:Expression}) { const {language,t}=useLanguage(); const related=language==="en"?getRelatedExpressions(item):[]; const {usedExpressionIds,toggleDailyExpression}=useDailyContent(); const {items,addExpressions}=usePracticeExpressions(); const [favorites,setFavorites]=useState<string[]>([]); const [copied,setCopied]=useState(false); const [message,setMessage]=useState(""); const used=usedExpressionIds.includes(item.id);
  useEffect(()=>{const timer=setTimeout(()=>setFavorites(getExpressionFavorites()),0);return()=>clearTimeout(timer);},[]);
  async function copy(){await navigator.clipboard.writeText(`${item.expression}\n${item.koreanMeaning}\n${item.example}\n${item.exampleTranslation}`);setCopied(true);setTimeout(()=>setCopied(false),1200);}
  function add(){if(items.length>=5){setMessage("최대 5개까지 등록할 수 있습니다.");return;} const count=addExpressions([item],"recommendation");setMessage(count?"오늘 실전 표현에 추가했어요.":"이미 등록된 표현입니다.");setTimeout(()=>setMessage(""),1800);}
  function favorite(){toggleExpressionFavorite(item.id);setFavorites(getExpressionFavorites());}
  function saveMine(){const now=new Date().toISOString();saveExpression({id:studyId(),expression:item.expression,meaning:item.koreanMeaning,example:item.example,situation:"오늘의 영어표현",language:"영어",difficulty:item.level,tags:item.tags||[],note:item.usageTip,status:"new",source:"daily",createdAt:now,updatedAt:now});setMessage("내 표현에 저장했어요.");setTimeout(()=>setMessage(""),1800)}
  return <article className="level-expression-card"><div className="level-expression-main"><div className="expression-card-head"><span>{t("expression.title")}</span><button className={favorites.includes(item.id)?"mini-action is-active":"mini-action"} onClick={favorite} aria-label={t("common.favorite")}><Heart fill={favorites.includes(item.id)?"currentColor":"none"}/></button></div><h3>{item.expression}</h3><strong>{item.koreanMeaning}</strong><div className="example-box"><p>{item.example}</p><small>{item.exampleTranslation}</small></div><div className="usage-tip"><b>{t("expression.tip")}</b><p>{item.usageTip}</p></div><div className="daily-expression-actions"><button onClick={copy}>{copied?<Check/>:<Copy/>}{copied?t("common.completed"):t("common.copy")}</button><button className={used?"is-checked":""} onClick={()=>toggleDailyExpression(item.id)}><Check/>{used?t("study.used"):t("study.learned")}</button><button onClick={add}><Plus/>{t("expression.practice")}</button><button onClick={saveMine}><BookHeart/>{t("expression.save")}</button></div>{message&&<p className="inline-message" role="status">{message}</p>}</div>{related.length>0&&<aside><span>{t("content.expressions")}</span>{related.map((entry)=><div key={entry.id}><b>{entry.expression}</b><p>{entry.koreanMeaning}</p></div>)}</aside>}</article>;
}
