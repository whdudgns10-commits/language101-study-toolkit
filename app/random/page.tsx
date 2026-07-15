import { ActivityWheel } from "@/components/activity-wheel"; import { PageHeader } from "@/components/page-header";
export const metadata={title:"랜덤 활동 돌림판 | Language101 Study Toolkit"}; export default function Page(){return <main className="subpage random-page"><PageHeader title="Random Activity" description="현재 필터에 맞는 활동 중 하나를 돌림판으로 골라보세요."/><ActivityWheel/></main>}
