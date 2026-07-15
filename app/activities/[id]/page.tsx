import { notFound } from "next/navigation";
import { ActivityDetail } from "@/components/activity-detail";
import { activities, getActivity } from "@/data/activities";

export function generateStaticParams() {
  return activities.map(({ id }) => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const activity = getActivity((await params).id);
  return activity ? { title: `${activity.title} | Language101 Study Toolkit`, description: activity.description } : {};
}

export default async function ActivityPage({ params }: { params: Promise<{ id: string }> }) {
  const activity = getActivity((await params).id);
  if (!activity) notFound();
  return <ActivityDetail activity={activity} />;
}
