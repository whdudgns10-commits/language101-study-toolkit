"use client";

import Link from "next/link";
import { ArrowRight, Clock3, Users } from "lucide-react";
import type { Activity } from "@/types/activity";
import { FavoriteButton } from "./favorite-button";
import { ActivityIcon } from "@/components/activity/activity-icon";
import { useLanguage } from "@/hooks/use-language";

export function ActivityCard({ activity }: { activity: Activity }) {
  const {t}=useLanguage();
  return (
    <article className="activity-card">
      <div className="activity-card-top">
        <div><ActivityIcon iconKey={activity.iconKey}/><span className="eyebrow">{activity.category}</span></div>
        <FavoriteButton id={activity.id} />
      </div>
      <div>
        <h3>{activity.title}</h3>
        <p>{activity.description}</p>
      </div>
      <div className="activity-meta">
        <span>{activity.level}</span>
        <span><Clock3 size={15} /> {activity.durationMinutes} min</span>
        <span><Users size={15} /> {activity.groupSizes[0]}</span>
      </div>
      <Link href={`/activities/${activity.id}`} className="card-link">{t("activity.startPractice")} <ArrowRight size={17} /></Link>
    </article>
  );
}
