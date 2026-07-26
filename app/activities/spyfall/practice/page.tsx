import type { Metadata } from "next";
import { SpyfallGame } from "@/components/2026-07-26-spyfall-game";

export const metadata: Metadata = {
  title: "스파이 찾기 (Find the Spy) | Language101",
  description: "Ask questions, find the spies, and protect the secret location.",
};

export default function SpyfallPracticePage() {
  return <SpyfallGame/>;
}
