"use client";

import { useState } from "react";
import { getDailyExpression,levelLabels } from "@/lib/daily-expression";
import { useDailyContent } from "@/hooks/use-daily-content";
import type { ExpressionLevel } from "@/types/expression";
import { DailyExpressionCard } from "./daily-expression-card";

const levels:ExpressionLevel[]=["beginner","intermediate","advanced"];
export function DailyExpressionTabs(){const [level,setLevel]=useState<ExpressionLevel>("beginner");const {dateKey}=useDailyContent();const item=getDailyExpression(level,dateKey);return <section className="expression-section section-block" id="expressions" aria-labelledby="expressions-title"><div className="section-shell"><div className="section-heading"><div><span className="eyebrow">Daily English · {dateKey} KST</span><h2 id="expressions-title">오늘의 영어 표현</h2></div><p>난이도별로 매일 한 표현씩, 실제 대화에서 바로 사용해 보세요.</p></div><div className="expression-tabs" role="tablist">{levels.map((entry)=><button role="tab" aria-selected={level===entry} className={level===entry?"is-active":""} onClick={()=>setLevel(entry)} key={entry}>{levelLabels[entry]}</button>)}</div><DailyExpressionCard item={item}/></div></section>}
