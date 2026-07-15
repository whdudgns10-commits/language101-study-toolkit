import { ActivityBrowser } from "@/components/activity-browser"; import { PageHeader } from "@/components/page-header";
export const metadata={title:"전체 활동 | Language101 Study Toolkit"}; export default function Page(){return <main className="subpage"><PageHeader title="Browse Activities" description="검색과 필터로 지금 필요한 활동을 찾아보세요."/><ActivityBrowser/></main>}
