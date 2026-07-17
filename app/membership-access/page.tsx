import { Suspense } from "react";
import { MembershipAccessCard } from "@/components/access/2026-07-17-membership-access-card";

export const metadata = { title: "Members Access | Language101", description: "Language101 membership access verification." };
export default function Page() { return <Suspense fallback={<main className="access-loading"/>}><MembershipAccessCard/></Suspense>; }
