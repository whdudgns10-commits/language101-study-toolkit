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
  | "school-subjects";

export type SpyfallCategory = {
  id: SpyfallCategoryId;
  title: string;
  titleKo: string;
  items: string[];
};

export type SpyfallRound = 1 | 2;
export type SpyfallWinner = "citizens" | "spies";
export type SpyfallVoteStage = "mid" | "final";

export type SpyfallQuestionLog = {
  id: string;
  round: SpyfallRound;
  asker: number;
  target: number;
  question: string;
  answer: string;
  createdAt: number;
};

export type SpyfallVoteResult = {
  totals: Record<number, number>;
  leaders: number[];
  highest: number;
  majority: boolean;
};

