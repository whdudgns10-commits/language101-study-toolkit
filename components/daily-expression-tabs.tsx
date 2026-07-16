"use client";

import { useState } from "react";
import { getDailyExpression,levelLabels } from "@/lib/daily-expression";
import { useDailyContent } from "@/hooks/use-daily-content";
import type { ExpressionLevel } from "@/types/expression";
import { DailyExpressionCard } from "./daily-expression-card";
import { useLanguage } from "@/hooks/use-language";

const levels:ExpressionLevel[]=["beginner","intermediate","advanced"];
export function DailyExpressionTabs(){const [level,setLevel]=useState<ExpressionLevel>("beginner");const {dateKey}=useDailyContent();const {t}=useLanguage();const item=getDailyExpression(level,dateKey);return <section className="expression-section section-block" id="expressions" aria-labelledby="expressions-title"><div className="section-shell"><div className="section-heading"><div><span className="eyebrow">{dateKey}</span><h2 id="expressions-title">{t("expression.title")}</h2></div><p>{t("home.expressionDesc")}</p></div><div className="expression-tabs" role="tablist">{levels.map((entry)=><button role="tab" aria-selected={level===entry} className={level===entry?"is-active":""} onClick={()=>setLevel(entry)} key={entry}>{levelLabels[entry]}</button>)}</div><DailyExpressionCard item={item}/></div></section>}
