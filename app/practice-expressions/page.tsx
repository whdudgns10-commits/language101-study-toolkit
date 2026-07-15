import { PracticeExpressions } from "@/components/practice-expressions"; import { PageHeader } from "@/components/page-header";
export const metadata={title:"오늘의 실전 표현 | Language101 Study Toolkit"}; export default function Page(){return <main className="subpage"><PageHeader title="오늘 실전 표현 5개" description="오늘 꼭 써볼 표현을 직접 고르고 기록하세요."/><PracticeExpressions/></main>}
