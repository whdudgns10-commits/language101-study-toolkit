"use client";

import Link from "next/link";
import { Dices, X } from "lucide-react";
import type { Activity } from "@/types/activity";
import { Button } from "./ui/button";

export function RandomReveal({ activity, onAgain, onClose }: { activity: Activity; onAgain: () => void; onClose: () => void }) {
  return (
    <div className="reveal-backdrop" role="dialog" aria-modal="true" aria-labelledby="random-title">
      <div className="reveal-card">
        <button className="reveal-close" onClick={onClose} aria-label="Close random activity"><X /></button>
        <div className="reveal-icon"><Dices /></div>
        <span className="eyebrow">Your activity is…</span>
        <h2 id="random-title">{activity.title}</h2>
        <p>{activity.description}</p>
        <Link href={`/activities/${activity.id}`} className="button button-primary">Open Activity</Link>
        <Button variant="ghost" onClick={onAgain}>Try Another</Button>
      </div>
    </div>
  );
}
