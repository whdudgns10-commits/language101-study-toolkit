"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ActivityIcon } from "@/components/activity/activity-icon";
import { activeActivities } from "@/data/activities";
import { useLanguage } from "@/hooks/use-language";
import { localizeActivity } from "@/lib/activity-localization";

export function ActivityBrowser(){const {language}=useLanguage();return <section className="activity-button-list section-shell" aria-label="Activities">{activeActivities.map(activity=>{const localized=localizeActivity(activity,language);return <Link href={`/activities/${activity.slug||activity.id}`} className="activity-list-button" data-activity-id={activity.id} key={activity.id}><ActivityIcon iconKey={activity.iconKey} size="lg"/><span>{localized.title}</span><ArrowRight aria-hidden="true"/></Link>})}</section>}
