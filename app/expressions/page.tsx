import { DailyExpressionTabs } from "@/components/daily-expression-tabs";
import { PageHeader } from "@/components/page-header";
export const metadata={title:"영어 표현 연습 | Language101 Study Toolkit",description:"난이도별 오늘의 영어 표현과 실전에서 사용할 표현을 준비하세요."};
export default function ExpressionsPage(){return <main className="subpage"><PageHeader title="오늘의 영어표현" description="초급·중급·상급 표현을 매일 하나씩 배워보세요." titleKey="expression.title" descriptionKey="home.expressionDesc"/><DailyExpressionTabs/></main>}
