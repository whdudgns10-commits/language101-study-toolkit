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
        {activity.sourceType === "naver-cafe" && <small className="naver-card-notice">네이버 로그인이나 카페 가입이 필요할 수 있습니다.</small>}
      </div>
      <div className="activity-meta">
        <span>{activity.level}</span>
        <span><Clock3 size={15} /> {activity.durationMinutes} min</span>
        <span><Users size={15} /> {activity.groupSizes[0]}</span>
      </div>
      <Link href={`/activities/${activity.id}`} className="card-link">Start Activity <ArrowRight size={17} /></Link>
    </article>
  );
}
