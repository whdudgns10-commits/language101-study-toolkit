import { redirect } from "next/navigation";
export const metadata = { title: "학습 메모 | Language101 Study Toolkit", description: "Language101 모임에서 작성한 학습 메모를 날짜별로 확인하세요." };
export default function NotesPage() { redirect("/my-study?tab=notes"); }
