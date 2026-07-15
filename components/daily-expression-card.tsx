"use client";

import { Check,Copy,Heart,Plus } from "lucide-react";
import { useEffect,useState } from "react";
import { getRelatedExpressions } from "@/lib/daily-expression";
import { getExpressionFavorites,toggleExpressionFavorite } from "@/lib/storage";
import { useDailyContent } from "@/hooks/use-daily-content";
import { usePracticeExpressions } from "@/hooks/use-practice-expressions";
import type { Expression } from "@/types/expression";

export function DailyExpressionCard({item}:{item:Expression}) { const related=getRelatedExpressions(item); const {usedExpressionIds,toggleDailyExpression}=useDailyContent(); const {items,addExpressions}=usePracticeExpressions(); const [favorites,setFavorites]=useState<string[]>([]); const [copied,setCopied]=useState(false); const [message,setMessage]=useState(""); const used=usedExpressionIds.includes(item.id);
  useEffect(()=>{const timer=setTimeout(()=>setFavorites(getExpressionFavorites()),0);return()=>clearTimeout(timer);},[]);
  async function copy(){await navigator.clipboard.writeText(`${item.expression}\n${item.koreanMeaning}\n${item.example}\n${item.exampleTranslation}`);setCopied(true);setTimeout(()=>setCopied(false),1200);}
  function add(){if(items.length>=5){setMessage("최대 5개까지 등록할 수 있습니다.");return;} const count=addExpressions([item],"recommendation");setMessage(count?"오늘 실전 표현에 추가했어요.":"이미 등록된 표현입니다.");setTimeout(()=>setMessage(""),1800);}
  function favorite(){toggleExpressionFavorite(item.id);setFavorites(getExpressionFavorites());}
  return <article className="level-expression-card"><div className="level-expression-main"><div className="expression-card-head"><span>TODAY’S KEY EXPRESSION</span><button className={favorites.includes(item.id)?"mini-action is-active":"mini-action"} onClick={favorite} aria-label="오늘의 표현 즐겨찾기"><Heart fill={favorites.includes(item.id)?"currentColor":"none"}/></button></div><h3>{item.expression}</h3><strong>{item.koreanMeaning}</strong><div className="example-box"><p>{item.example}</p><small>{item.exampleTranslation}</small></div><div className="usage-tip"><b>언제 사용하나요?</b><p>{item.usageTip}</p></div><div className="daily-expression-actions"><button onClick={copy}>{copied?<Check/>:<Copy/>}{copied?"복사됨":"복사하기"}</button><button className={used?"is-checked":""} onClick={()=>toggleDailyExpression(item.id)}><Check/>{used?"오늘 사용했어요":"오늘 사용했어요 체크"}</button><button onClick={add}><Plus/>오늘 실전 표현에 추가</button></div>{message&&<p className="inline-message" role="status">{message}</p>}</div><aside><span>비슷한 표현</span>{related.map((entry)=><div key={entry.id}><b>{entry.expression}</b><p>{entry.koreanMeaning}</p></div>)}</aside></article>;
}
