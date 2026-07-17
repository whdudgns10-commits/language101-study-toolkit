"use client";

import Link from "next/link";
import { ArrowRight, BookOpenText, Coffee, Gamepad2, MessageCircleMore, Scale, Sparkles } from "lucide-react";
import { useState } from "react";
import { activities } from "@/data/activities";

const modes = [
  { id:"new",label:"처음 왔어요",icon:Sparkles,ids:["true-or-false","30-second-speaking","funny-questions"],reason:"부담 없이 서로를 알아가기 좋아요." },
  { id:"casual",label:"가볍게 대화하고 싶어요",icon:Coffee,ids:["what-if-challenge","fun-discuss","balance-game"],reason:"정답 없이 편하게 이야기를 이어갈 수 있어요." },
  { id:"game",label:"게임하고 싶어요",icon:Gamepad2,ids:["guessing-words","word-battle","words-game"],reason:"규칙이 간단하고 모두가 빠르게 참여할 수 있어요." },
  { id:"debate",label:"진지하게 토론하고 싶어요",icon:Scale,ids:["debate-pros-cons","choose-one-out-of-three","20-questions"],reason:"이유를 설명하고 서로의 관점을 깊게 들을 수 있어요." },
  { id:"expression",label:"영어 표현을 연습하고 싶어요",icon:BookOpenText,ids:["useful-expressions","30-second-speaking","conversation-starter"],reason:"새 표현을 바로 문장과 대화에 적용할 수 있어요." },
] as const;

export function QuickStartModes() {
  const [selected, setSelected] = useState<(typeof modes)[number] | null>(null);
  const recommendations = selected ? selected.ids.map((id) => activities.find((item) => item.id === id)).filter(Boolean) : [];
  return <section className="quick-modes section-shell" aria-labelledby="quick-modes-title"><div className="quick-modes-heading"><div><span className="eyebrow">Start in seconds</span><h2 id="quick-modes-title">지금 무엇을 하고 싶나요?</h2></div><MessageCircleMore /></div><div className="mode-scroll">{modes.map((mode) => { const Icon = mode.icon; return <button key={mode.id} className={selected?.id === mode.id ? "mode-button is-active" : "mode-button"} onClick={() => setSelected(mode)}><Icon />{mode.label}</button>; })}</div>
    {selected && <div className="mode-recommendations"><div><b>{selected.label} 추천</b><span>지금 바로 시작하기 좋은 활동 3개예요.</span></div><div className="mode-cards">{recommendations.map((item) => item && <Link href={`/activities/${item.id}`} key={item.id}><span>{item.category}</span><b>{item.title}</b><p>{selected.reason}</p><em>시작하기 <ArrowRight /></em></Link>)}</div></div>}
  </section>;
}
