"use client";

import Link from "next/link";
import { ArrowRight, Clock3, Users } from "lucide-react";
import type { Activity } from "@/types/activity";
import { FavoriteButton } from "./favorite-button";

export function ActivityCard({ activity }: { activity: Activity }) {
  return (
    <article className="activity-card">
      <div className="activity-card-top">
        <span className="eyebrow">{activity.category}</span>
        <FavoriteButton id={activity.id} />
      </div>
      <div>
        <h3>{activity.title}</h3>
        <p>{activity.description}</p>
        {activity.sourceType === "internal" && <small className="naver-card-notice">사이트 안에서 질문과 대화 자료를 바로 볼 수 있어요.</small>}
        {activity.sourceType === "interactive" && <small className="naver-card-notice">외부 페이지에서 실행되는 도구입니다.</small>}
      </div>
      <div className="activity-meta">
        <span>{activity.level}</span>
        <span><Clock3 size={15} /> {activity.durationMinutes} min</span>
        <span><Users size={15} /> {activity.groupSizes[0]}</span>
      </div>
      <Link href={`/activities/${activity.id}`} className="card-link">{activity.sourceType==="internal"?"대화 자료 보기":"Start Activity"} <ArrowRight size={17} /></Link>
    </article>
  );
}
