"use client";

import { BookHeart,Check,Copy,Heart,Plus } from "lucide-react";
import { useEffect,useState } from "react";
import { getRelatedExpressions,localizeEnglishExpression } from "@/lib/daily-expression";
import { getExpressionFavorites,toggleExpressionFavorite } from "@/lib/storage";
import { useDailyContent } from "@/hooks/use-daily-content";
import { usePracticeExpressions } from "@/hooks/use-practice-expressions";
import type { Expression } from "@/types/expression";
import { saveExpression } from "@/lib/study-storage";
import { useLanguage } from "@/hooks/use-language";

export function DailyExpressionCard({item}:{item:Expression}) { const {language,t}=useLanguage(); const localized=localizeEnglishExpression(item,language);const related=getRelatedExpressions(item); const {usedExpressionIds,toggleDailyExpression}=useDailyContent(); const {items,addExpressions}=usePracticeExpressions(); const [favorites,setFavorites]=useState<string[]>([]); const [copied,setCopied]=useState(false); const [message,setMessage]=useState(""); const used=usedExpressionIds.includes(item.id);
  useEffect(()=>{const timer=setTimeout(()=>setFavorites(getExpressionFavorites()),0);return()=>clearTimeout(timer);},[]);
  async function copy(){await navigator.clipboard.writeText(`${item.expression}\n${localized.meaning}\n${item.example}${localized.exampleTranslation?`\n${localized.exampleTranslation}`:""}`);setCopied(true);setTimeout(()=>setCopied(false),1200);}
  function add(){if(items.length>=5){setMessage("최대 5개까지 등록할 수 있습니다.");return;} const count=addExpressions([item],"recommendation");setMessage(count?"오늘 실전 표현에 추가했어요.":"이미 등록된 표현입니다.");setTimeout(()=>setMessage(""),1800);}
  function favorite(){toggleExpressionFavorite(item.id);setFavorites(getExpressionFavorites());}
  function saveMine(){const now=new Date().toISOString();saveExpression({id:`saved-en-${item.id}`,expression:item.expression,meaning:item.koreanMeaning,example:item.example,situation:"daily-expression",language:"en",difficulty:item.level,tags:item.tags||[],note:item.usageTip,status:"new",source:"daily",createdAt:now,updatedAt:now});setMessage(t("expression.saved"));setTimeout(()=>setMessage(""),1800)}
  return <article className="level-expression-card" data-expression-id={item.id}><div className="level-expression-main"><div className="expression-card-head"><span>{t("expression.title")}</span><button className={favorites.includes(item.id)?"mini-action is-active":"mini-action"} onClick={favorite} aria-label={t("common.favorite")}><Heart fill={favorites.includes(item.id)?"currentColor":"none"}/></button></div><h3>{item.expression}</h3><div className="localized-field"><b>{t("expression.meaning")}</b><strong>{localized.meaning}</strong></div><div className="example-box"><b>{t("expression.example")}</b><p>{item.example}</p>{localized.exampleTranslation&&<small>{localized.exampleTranslation}</small>}</div><div className="usage-tip"><b>{t("expression.tip")}</b><p>{localized.tip}</p></div><div className="daily-expression-actions"><button onClick={copy}>{copied?<Check/>:<Copy/>}{copied?t("common.completed"):t("common.copy")}</button><button className={used?"is-checked":""} onClick={()=>toggleDailyExpression(item.id)}><Check/>{used?t("expression.learned"):t("expression.practiceAction")}</button><button onClick={add}><Plus/>{t("expression.practice")}</button><button onClick={saveMine}><BookHeart/>{t("expression.saveStudy")}</button></div>{message&&<p className="inline-message" role="status">{message}</p>}</div>{related.length>0&&<aside><span>{t("content.expressions")}</span>{related.map((entry)=><div key={entry.id}><b>{entry.expression}</b><p>{localizeEnglishExpression(entry,language).meaning}</p></div>)}</aside>}</article>;
}
