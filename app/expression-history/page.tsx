import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ExpressionHistory } from "@/components/expression-history";
export const metadata={title:"최근 표현 기록 | Language101 Study Toolkit",description:"날짜별 실전 영어 표현과 사용 기록을 확인하세요."};
export default function ExpressionHistoryPage(){return <main className="history-page"><div className="history-shell"><Link href="/expressions" className="back-link"><ArrowLeft/>표현 연습으로</Link><header><span className="eyebrow">Expression history</span><h1>최근 표현 기록</h1><p>이전 모임에서 준비하고 사용한 표현을 날짜별로 확인하세요.</p></header><ExpressionHistory/></div></main>}
