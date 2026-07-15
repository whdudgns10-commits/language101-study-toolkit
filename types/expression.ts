export type ExpressionLevel = "beginner" | "intermediate" | "advanced";
export type ExpressionCategory = "greeting"|"reaction"|"agreement"|"disagreement"|"opinion"|"question"|"clarification"|"suggestion"|"invitation"|"apology"|"gratitude"|"encouragement"|"small-talk"|"travel"|"work"|"study"|"friendship"|"culture"|"emotion"|"daily-life"|"conversation-management"|"conversation"|"social"|"feelings"|"confidence";
export type ExpressionFormality="casual"|"neutral"|"formal";
export type ExpressionFrequency="very-common"|"common"|"useful";
export type PracticePriority=1|2|3;
export type Expression = { id:string; expression:string; koreanMeaning:string; example:string; exampleTranslation:string; usageTip:string; similarExpressions:string[]; level:ExpressionLevel; category:ExpressionCategory; formality?:ExpressionFormality; frequency?:ExpressionFrequency; tags?:string[]; recommendedForPractice?:boolean; practicePriority?:PracticePriority; practiceSituations?:string[] };
export type PracticeExpression = { id:string; expression:string; koreanMeaning:string; example:string; note:string; usageCount:number; source:"manual"|"recommendation"|"favorite"|"history"; createdAt:string };
export type PracticeDayRecord = { date:string; items:PracticeExpression[]; recommendationIds:string[] };
