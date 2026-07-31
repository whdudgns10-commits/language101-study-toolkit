import { notFound, redirect } from "next/navigation";
import { ActivityDetail } from "@/components/activity-detail";
import { activeActivities, getActivity } from "@/data/activities";

export function generateStaticParams() {
  return activeActivities.map((activity) => ({ id:activity.slug||activity.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const id=(await params).id;if(id==="balance-game-2")return{title:"Balance Game | Language101 Study Toolkit",description:"Choose between A and B and explain your choice."};if(id==="ice-breaking"||id==="conversation-starter")return{title:"Conversation Starters | Language101 Study Toolkit",description:"Questions that get people talking through thoughtful, natural conversation."};const activity = getActivity(id);
  return activity ? { title: `${activity.title} | Language101 Study Toolkit`, description: activity.description } : {};
}

export default async function ActivityPage({ params }: { params: Promise<{ id: string }> }) {
  const id=(await params).id;if(id==="balance-game-2")redirect("/activities/balance-game");if(id==="ice-breaking"||id==="conversation-starter")redirect("/activities/ice-breaking-3");const activity = getActivity(id);
  if (!activity) notFound();
  return <ActivityDetail activity={activity} />;
}
