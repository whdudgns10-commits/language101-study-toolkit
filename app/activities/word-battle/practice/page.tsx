import { AccessGuard } from "@/components/access/2026-07-17-access-guard";
import { ConversationContentViewer } from "@/components/conversation-content-viewer";

export const metadata = { title: "Word Battle Practice | Language101" };
export default function Page() { return <AccessGuard><main className="member-generic-practice"><ConversationContentViewer activityId="word-battle"/></main></AccessGuard>; }
