import type {
  FunnyQuestion,
  FunnyQuestionCategory,
  FunnyQuestionLevel,
} from "@/data/2026-07-17-funny-questions";

export const FUNNY_DATA_VERSION = 2;
export const FUNNY_STORAGE = {
  version: "funnyQuestionsDataVersion",
  state: "funnyQuestionsStateV2",
  favorites: "funnyQuestionsFavorites",
  study: "funnyQuestionsStudySessions",
} as const;

export type FunnyFavorite = {
  questionId: string;
  question: string;
  category: FunnyQuestionCategory;
  level: FunnyQuestionLevel;
  favoriteDate: string;
};

export type FunnyPracticeState = {
  currentId: string;
  history: string[];
  historyIndex: number;
  recentIds: string[];
  category: FunnyQuestionCategory | "all";
  level: FunnyQuestionLevel | "all";
  answerStyle: "everyone" | "one" | "pair" | "vote";
  favoritesOnly: boolean;
};

export type FunnySessionRecord = {
  id: string;
  activity: "funny-questions";
  date: string;
  viewedCount: number;
  answeredQuestionIds: string[];
  categories: FunnyQuestionCategory[];
  favoriteQuestionIds: string[];
  memo: string;
  createdAt: string;
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    return JSON.parse(localStorage.getItem(key) || "") as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("language101-study-sync", { detail: { key } }));
  window.dispatchEvent(new CustomEvent("language101-study-change"));
}

export function migrateFunnyQuestionStorage(validIds: Set<string>) {
  if (typeof window === "undefined") return;
  const rawFavorites = read<Array<Record<string, unknown>>>(FUNNY_STORAGE.favorites, []);
  const favorites = rawFavorites.flatMap(item => {
    const id = typeof item.questionId === "string" ? item.questionId : "";
    if (!validIds.has(id)) return [];
    return [{
      questionId: id,
      question: String(item.question || item.questionEn || ""),
      category: item.category as FunnyQuestionCategory,
      level: (item.level || item.difficulty) as FunnyQuestionLevel,
      favoriteDate: String(item.favoriteDate || new Date().toISOString()),
    }];
  });
  write(FUNNY_STORAGE.favorites, favorites);
  localStorage.setItem(FUNNY_STORAGE.version, String(FUNNY_DATA_VERSION));
}

export function readFunnyFavorites(validIds?: Set<string>): FunnyFavorite[] {
  const favorites = read<FunnyFavorite[]>(FUNNY_STORAGE.favorites, []);
  return validIds ? favorites.filter(item => validIds.has(item.questionId)) : favorites;
}

export function toggleFunnyFavorite(question: FunnyQuestion): FunnyFavorite[] {
  const items = readFunnyFavorites();
  const exists = items.some(item => item.questionId === question.id);
  const next = exists
    ? items.filter(item => item.questionId !== question.id)
    : [...items, {
      questionId: question.id,
      question: question.question,
      category: question.category,
      level: question.level,
      favoriteDate: new Date().toISOString(),
    }];
  write(FUNNY_STORAGE.favorites, next);
  return next;
}

export const readFunnyState = (fallback: FunnyPracticeState) =>
  read<FunnyPracticeState>(FUNNY_STORAGE.state, fallback);

export const saveFunnyState = (state: FunnyPracticeState) =>
  write(FUNNY_STORAGE.state, state);

export function saveFunnySession(record: FunnySessionRecord) {
  const records = read<FunnySessionRecord[]>(FUNNY_STORAGE.study, []);
  write(FUNNY_STORAGE.study, [record, ...records]);
  const legacy = read<unknown[]>("studyActivitySessions", []);
  write("studyActivitySessions", [record, ...legacy]);
}
