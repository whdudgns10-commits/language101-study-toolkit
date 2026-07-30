export type ExperienceLanguage = "ko" | "en" | "both";
export type ExperienceDifficulty = "beginner" | "intermediate" | "advanced";
export type ExperienceMode = "classic" | "survival";
export type ExperiencePhase = "setup" | "speaker" | "judging" | "handoff" | "result" | "finished";

export type ExperienceHint = {
  id: string;
  category: string;
  ko: string;
  en: string;
  difficulty: ExperienceDifficulty;
};

export type SurvivalPlayer = {
  id: string;
  name: string;
  lives: number;
  eliminated: boolean;
  uniqueWins: number;
  turns: number;
};

export type ExperienceJudgement = {
  playerId: string;
  hasDoneIt: boolean;
};

export type ExperienceTurn = {
  id: string;
  round: number;
  speakerId: string;
  experience: string;
  spokenOnly: boolean;
  judgements: ExperienceJudgement[];
  lostLifeIds: string[];
  eliminatedIds: string[];
  unique: boolean;
  common: boolean;
  bonusApplied: boolean;
};

export type SurvivalSettings = {
  startingLives: number;
  uniqueBonus: boolean;
  language: ExperienceLanguage;
  turnSeconds: 0 | 30 | 45 | 60 | 90;
  randomStart: boolean;
};

export type ExperienceSurvivalState = {
  version: 1;
  mode: ExperienceMode;
  phase: ExperiencePhase;
  players: SurvivalPlayer[];
  settings: SurvivalSettings;
  currentPlayerIndex: number;
  round: number;
  currentExperience: string;
  spokenOnly: boolean;
  judgeIds: string[];
  judgeIndex: number;
  pendingJudgements: ExperienceJudgement[];
  history: ExperienceTurn[];
  secondsLeft: number | null;
  interrupted: boolean;
  updatedAt: number;
};
