"use client";
import Link from "next/link";
import { Check, Target } from "lucide-react";
import { useDailyContent } from "@/hooks/use-daily-content";
export function MissionHeaderButton(){const {dailyMissions,completedMissionIds}=useDailyContent();const remaining=dailyMissions.length-completedMissionIds.length;return <Link href="/missions" className="mission-header-button" aria-label="오늘의 미션 보기"><Target/>{remaining===0?<Check className="mission-complete"/>:<span>{remaining}</span>}</Link>}
