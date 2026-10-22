export type SpyfallCategoryId =
  | "places"
  | "countries"
  | "jobs"
  | "movies"
  | "animals"
  | "foods"
  | "sports"
  | "celebrities"
  | "brands"
  | "history"
  | "space"
  | "school-subjects"
  | "dating-relationships"
  | "funny-situations"
  | "hobbies-activities"
  | "movies-entertainment";

export type SpyfallDifficulty = "beginner" | "intermediate" | "advanced";

export type SpyfallAnswer = {
  id: string;
  english: string;
  korean: string;
  category: SpyfallCategoryId;
  difficulty: SpyfallDifficulty;
};

export type SpyfallExampleQuestion = {
  id: string;
  english: string;
  korean: string;
};

export type SpyfallCategory = {
  id: SpyfallCategoryId;
  title: string;
  titleKo: string;
  items: SpyfallAnswer[];
  questions: SpyfallExampleQuestion[];
};

export type SpyfallRound = 1 | 2;
export type SpyfallWinner = "citizens" | "spies";
export type SpyfallVoteStage = "mid" | "final";

export type SpyfallVoteResult = {
  totals: Record<number, number>;
  leaders: number[];
  highest: number;
  majority: boolean;
};

