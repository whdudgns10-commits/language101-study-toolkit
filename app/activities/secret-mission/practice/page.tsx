import type { Metadata } from "next";
import { SecretMissionGame } from "@/components/2026-07-27-secret-mission-game";

export const metadata: Metadata = {
  title: "비밀 미션 (Secret Mission) | Language101",
  description: "각자 비밀 미션을 받고 대화 속에서 들키지 않게 완료하는 Language101 그룹 게임",
};

export default function SecretMissionPracticePage() {
  return <SecretMissionGame/>;
}
