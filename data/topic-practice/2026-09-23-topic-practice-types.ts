export type TopicPracticeCategory =
  | "Food & Drinks" | "Travel" | "Dating & Relationships" | "Friends & Social Life"
  | "Work & Career" | "School & Learning" | "Entertainment" | "Technology & Social Media"
  | "Money & Shopping" | "Home & Lifestyle" | "Health & Fitness" | "Daily Life"
  | "Personality" | "Culture" | "Life Experiences";

export type TopicPracticeQuestion = { id:string; question:string; korean:string; followUps:string[] };
export type TopicPracticeVocabulary = { word:string; korean:string; example:string };
export type TopicPracticeExpression = { expression:string; korean:string; example:string; practice:string };
export type TopicPracticeRolePlay = { id:string; title:string; koreanTitle:string; situation:string; koreanSituation:string; roleA:string; roleB:string; mission:string; usefulExpressions:string[] };
export type TopicPracticeChallenge = { id:string; title:string; instruction:string; korean:string; seconds:number; words?:string[] };
export type TopicPractice = {
  id:string; title:string; koreanTitle:string; emoji:string; category:TopicPracticeCategory; tags:string[];
  level:"easy"|"medium"|"mixed";
  conversationQuestions:TopicPracticeQuestion[]; vocabulary:TopicPracticeVocabulary[];
  expressions:TopicPracticeExpression[]; rolePlays:TopicPracticeRolePlay[];
  challenges:TopicPracticeChallenge[];
};
