import { DailyMissions } from "@/components/daily-missions"; import { PageHeader } from "@/components/page-header";
export const metadata={title:"오늘의 미션 | Language101 Study Toolkit"}; export default function Page(){return <main className="subpage"><PageHeader title="오늘의 미션 3개" description="오늘 대화에서 도전할 세 가지 목표예요."/><DailyMissions/></main>}
