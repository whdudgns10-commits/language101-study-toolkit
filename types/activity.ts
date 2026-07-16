export const activityCategories = [
  "Ice Breaking",
  "Speaking",
  "Games",
  "Discussion",
  "Expression Practice",
  "Picture Activities",
] as const;

export const activityLevels = [
  "All Level",
  "Beginner",
  "Intermediate",
  "Upper-Intermediate",
] as const;

export type ActivityCategory = (typeof activityCategories)[number];
export type ActivityLevel = (typeof activityLevels)[number];
export type SourceType = "interactive" | "naver-cafe" | "internal";

export type Activity = {
  id: string;
  slug?: string;
  title: string;
  category: ActivityCategory;
  level: ActivityLevel;
  durationMinutes: number;
  groupSizes: string[];
  description: string;
  instructions: string[];
  externalUrl: string;
  sourceType: SourceType;
  tags: string[];
  featured: boolean;
  enabled?: boolean;
  randomEligible?: boolean;
  shortTitle?: string;
  translations?:Partial<Record<"en"|"ko"|"zh"|"ja",{title:string;description?:string;shortTitle?:string}>>;
};
