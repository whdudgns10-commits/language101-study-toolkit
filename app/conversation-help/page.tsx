import { ConversationGenerator } from "@/components/conversation-generator"; import { PageHeader } from "@/components/page-header";
export const metadata={title:"대화 질문 도우미 | Language101 Study Toolkit"}; export default function Page(){return <main className="subpage"><PageHeader title="대화가 막혔나요?" description="카테고리를 고르고 질문 하나로 대화를 이어가세요."/><ConversationGenerator/></main>}
