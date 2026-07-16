import Link from "next/link";
import { ArrowRight, BookOpenText, Compass, Dices, ListFilter, MessageCircleQuestion, Sparkles, Target } from "lucide-react";
import { MobileHeader } from "@/components/mobile-header";

const features = [
  { href:"/missions", title:"오늘의 미션 3개", description:"오늘 대화에서 직접 도전할 목표를 확인하세요.", icon:Target },
  { href:"/expressions", title:"오늘의 영어표현", description:"오늘 꼭 익혀볼 표현을 확인하세요.", icon:BookOpenText },
  { href:"/practice-expressions", title:"오늘 실전에서 사용할 표현 5개", description:"오늘 대화에서 직접 사용할 표현을 연습하세요.", icon:Sparkles },
  { href:"/conversation-help", title:"대화가 막혔나요?", description:"랜덤 질문으로 바로 대화를 이어가세요.", icon:MessageCircleQuestion },
  { href:"/recommended", title:"Recommended for Today", description:"오늘 하기 좋은 활동을 빠르게 확인하세요.", icon:Compass },
];

export function ToolkitHome(){return <><MobileHeader/><main className="mobile-home section-shell">
  <section className="compact-hero"><span>LANGUAGE EXCHANGE 101</span><h1>언어교환101</h1><p>오늘의 대화와 영어 학습을 가볍게 시작해 보세요.</p></section>
  <section className="primary-actions" aria-label="주요 기능">
    <Link href="/random" className="primary-action is-random"><Dices/><span><b>Random Activity</b><small>돌림판으로 바로 골라보세요</small></span><ArrowRight/></Link>
    <Link href="/tools" className="primary-action"><Sparkles/><span><b>Study Tools</b><small>목적에 맞는 도구 찾기</small></span><ArrowRight/></Link>
    <Link href="/activities" className="primary-action"><ListFilter/><span><b>Browse All Activities</b><small>검색하고 조건별로 살펴보기</small></span><ArrowRight/></Link>
  </section>
  <section className="quick-feature-section"><h2>Quick Start</h2><div className="quick-feature-grid">{features.map(({href,title,description,icon:Icon})=><Link href={href} className="home-action-card" key={href}><span className="home-action-icon"><Icon/></span><span><b>{title}</b><small>{description}</small></span><ArrowRight/></Link>)}</div></section>
  <div className="home-small-links"><Link href="/notes">학습 메모</Link><Link href="/end-session">모임 마무리</Link><Link href="/qr">QR 페이지</Link></div>
 </main></>}
