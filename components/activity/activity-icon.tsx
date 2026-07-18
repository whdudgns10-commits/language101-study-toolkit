import type { ComponentType, CSSProperties } from "react";
import { Brain, CircleHelp, Lightbulb, ListChecks, Medal, MessageCircleQuestion, MessagesSquare, NotebookPen, Scale, Smile, Sparkles, Swords, Users } from "lucide-react";
import type { ActivityIconKey } from "@/types/activity";

type ActivityIconProps = { iconKey:ActivityIconKey; size?:"sm"|"md"|"lg"; className?:string };
const sizes = { sm:24, md:34, lg:40 } as const;
const svgProps = { fill:"none", viewBox:"0 0 48 48", stroke:"currentColor", strokeWidth:2, strokeLinecap:"round" as const, strokeLinejoin:"round" as const, "aria-hidden":true };

function TrueFalseIcon(){return <svg {...svgProps}><circle cx="15" cy="24" r="10"/><path d="m10.5 24 3 3 6-7"/><circle cx="34" cy="24" r="10"/><path d="m30 20 8 8m0-8-8 8"/></svg>}
function TimedSpeakingIcon(){return <svg {...svgProps}><path d="M9 12h21a7 7 0 0 1 7 7v7a7 7 0 0 1-7 7H20l-8 6v-6H9a7 7 0 0 1-7-7v-7a7 7 0 0 1 7-7Z"/><circle cx="35" cy="13" r="9" fill="white"/><path d="M35 8v5l3 2m-7-9h8M35 4v2"/></svg>}
function AlphabetTilesIcon(){return <svg {...svgProps}><rect x="5" y="8" width="18" height="18" rx="4"/><rect x="25" y="8" width="18" height="18" rx="4"/><rect x="15" y="28" width="18" height="16" rx="4"/><text x="14" y="21" textAnchor="middle" fill="currentColor" stroke="none" fontSize="12" fontWeight="800">A</text><text x="34" y="21" textAnchor="middle" fill="currentColor" stroke="none" fontSize="12" fontWeight="800">B</text><text x="24" y="40" textAnchor="middle" fill="currentColor" stroke="none" fontSize="12" fontWeight="800">C</text></svg>}
function DebateIcon(){return <svg {...svgProps}><path d="M3 9h18a6 6 0 0 1 6 6v6a6 6 0 0 1-6 6H13l-6 5v-5H3a6 6 0 0 1-6-6v-6a6 6 0 0 1 6-6Z"/><path d="M45 18H30v5a9 9 0 0 1-9 9h6l7 6v-6h11a6 6 0 0 0 6-6v-2a6 6 0 0 0-6-6Z"/><path d="M7 18h12m18 7h6"/></svg>}
function ChooseThreeIcon(){return <svg {...svgProps}><circle cx="9" cy="10" r="6"/><circle cx="24" cy="10" r="6"/><circle cx="39" cy="10" r="6"/><text x="9" y="13" textAnchor="middle" fill="currentColor" stroke="none" fontSize="8" fontWeight="800">1</text><text x="24" y="13" textAnchor="middle" fill="currentColor" stroke="none" fontSize="8" fontWeight="800">2</text><text x="39" y="13" textAnchor="middle" fill="currentColor" stroke="none" fontSize="8" fontWeight="800">3</text><path d="M22 42V25a3 3 0 0 1 6 0v7-4a3 3 0 0 1 6 0v5-3a3 3 0 0 1 6 0v7c0 5-4 8-9 8h-2c-4 0-7-1-9-4l-5-7a3 3 0 0 1 5-3l2 3"/></svg>}
function SituationStoryIcon(){return <svg {...svgProps}><path d="M8 9h23a7 7 0 0 1 7 7v8a7 7 0 0 1-7 7H19l-8 7v-7H8a7 7 0 0 1-7-7v-8a7 7 0 0 1 7-7Z"/><path d="M22 16c-4 0-7 3-7 7 0 5 7 11 7 11s7-6 7-11c0-4-3-7-7-7Z"/><circle cx="22" cy="23" r="2"/></svg>}

type DecorativeIcon = ComponentType<{ "aria-hidden"?: boolean | "true" }>;

const activityIcons:Record<ActivityIconKey,DecorativeIcon> = {
  "true-false":TrueFalseIcon, "timed-speaking":TimedSpeakingIcon, questions:ListChecks,
  imagination:Lightbulb, funny:Smile, icebreaker:Users, discussion:MessagesSquare,
  guessing:Brain, battle:Swords, balance:Scale, "conversation-starter":MessageCircleQuestion,
  alphabet:AlphabetTilesIcon, debate:DebateIcon, "choose-three":ChooseThreeIcon,
  "useful-expressions":Sparkles, "expression-practice":NotebookPen, "situation-story":SituationStoryIcon,
  "rank-it":Medal,
};

export function ActivityIcon({iconKey,size="md",className=""}:ActivityIconProps){
  const Icon=activityIcons[iconKey] as DecorativeIcon|undefined;
  if(!Icon){if(process.env.NODE_ENV!=="production")console.warn(`Unknown activity icon key: ${iconKey}`);return <span className={`activity-meaning-icon is-${size} ${className}`} style={{"--activity-icon-size":`${sizes[size]}px`} as CSSProperties}><CircleHelp aria-hidden="true"/></span>}
  return <span className={`activity-meaning-icon is-${size} ${className}`} style={{"--activity-icon-size":`${sizes[size]}px`} as CSSProperties}><Icon aria-hidden="true"/></span>;
}

export const activityIconKeys=Object.keys(activityIcons) as ActivityIconKey[];
