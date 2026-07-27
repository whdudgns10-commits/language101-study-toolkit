export const secretMissionDifficulties = ["easy", "medium", "hard"] as const;
export const secretMissionCategories = [
  "conversation", "action", "expression", "get-to-know", "culture",
  "photo", "humor", "mystery", "teamwork", "english-expression",
  "getting-to-know", "observation", "memory", "networking",
  "storytelling", "language-exchange",
] as const;

export type SecretMissionDifficulty = (typeof secretMissionDifficulties)[number];
export type SecretMissionCategory = (typeof secretMissionCategories)[number];
export type SecretMissionLanguage = "ko" | "en" | "both";
export type SecretMissionTimer = 0 | 10 | 15 | 20 | 30;

export type SecretMission = {
  id: string;
  difficulty: SecretMissionDifficulty;
  category: SecretMissionCategory;
  ko: string;
  en: string;
  custom?: boolean;
};

export type SecretMissionPlayer = {
  id: string;
  name: string;
};

export type SecretMissionAssignment = {
  player: SecretMissionPlayer;
  mission: SecretMission;
  completed: boolean;
};

export type SecretMissionSession = {
  version: 1;
  assignments: SecretMissionAssignment[];
  language: SecretMissionLanguage;
  timerMinutes: SecretMissionTimer;
  secondsLeft: number | null;
  startedAt: number;
};
