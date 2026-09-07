import {
  defaultSpyfallLocations,
  defaultSpyfallQuestions,
  getDefaultSpyCount,
  type SpyfallLocation,
  type SpyfallQuestion,
} from "@/data/2026-07-26-spyfall";
import type {
  SpyfallQuestionLog,
  SpyfallRound,
  SpyfallVoteStage,
  SpyfallWinner,
} from "@/types/2026-07-26-spyfall";

export const SPYFALL_SETTINGS_KEY = "language101-spyfall-settings";
export const SPYFALL_SESSION_KEY = "language101-spyfall-active-session";
export const SPYFALL_LAST_LOCATION_KEY = "language101-spyfall-last-location";
export const SPYFALL_ANSWER_HISTORY_KEY = "language101-spyfall-answer-history";

export type SpyfallSettings = {
  locations: SpyfallLocation[];
  questions: SpyfallQuestion[];
  defaultMinutes: 5 | 8 | 10;
  spyCounts: Record<number, number>;
};

export type SpyfallSessionSnapshot = {
  version: 3;
  phase: "handoff" | "reveal" | "ready" | "playing" | "voting" | "vote-summary" | "round-result" | "final";
  playerCount: number;
  playerNames: string[];
  spyCount: number;
  spyNumbers: number[];
  categoryId: string;
  answer: string;
  candidates: string[];
  durationMinutes: 5 | 8 | 10;
  roleIndex: number;
  questioner: number;
  secondsLeft: number;
  timerRunning: boolean;
  votes: number[];
  voterIndex: number;
  round: SpyfallRound;
  voteStage: SpyfallVoteStage;
  eliminatedPlayers: number[];
  questionLogs: SpyfallQuestionLog[];
  accusedPlayer: number | null;
  revealedRole: "citizen" | "spy" | null;
  winner: SpyfallWinner | null;
  winnerReason: "vote" | "guess-correct" | "guess-wrong" | "final-miss" | null;
  savedAt: number;
};

const defaultSpyCounts = Object.fromEntries(
  Array.from({ length: 9 }, (_, index) => {
    const players = index + 4;
    return [players, getDefaultSpyCount(players)];
  }),
) as Record<number, number>;

export function createDefaultSpyfallSettings(): SpyfallSettings {
  return {
    locations: defaultSpyfallLocations.map((location) => ({ ...location })),
    questions: defaultSpyfallQuestions.map((question) => ({ ...question })),
    defaultMinutes: 8,
    spyCounts: { ...defaultSpyCounts },
  };
}

function isBrowser() {
  return typeof window !== "undefined";
}

export function loadSpyfallSettings(): SpyfallSettings {
  const fallback = createDefaultSpyfallSettings();
  if (!isBrowser()) return fallback;
  try {
    const parsed = JSON.parse(localStorage.getItem(SPYFALL_SETTINGS_KEY) ?? "{}") as Partial<SpyfallSettings>;
    return {
      locations: Array.isArray(parsed.locations) && parsed.locations.length ? parsed.locations : fallback.locations,
      questions: Array.isArray(parsed.questions) && parsed.questions.length ? parsed.questions : fallback.questions,
      defaultMinutes: [5, 8, 10].includes(Number(parsed.defaultMinutes))
        ? parsed.defaultMinutes as 5 | 8 | 10
        : fallback.defaultMinutes,
      spyCounts: { ...fallback.spyCounts, ...(parsed.spyCounts ?? {}) },
    };
  } catch {
    return fallback;
  }
}

export function saveSpyfallSettings(settings: SpyfallSettings) {
  if (!isBrowser()) return;
  localStorage.setItem(SPYFALL_SETTINGS_KEY, JSON.stringify(settings));
  window.dispatchEvent(new CustomEvent("language101-study-change"));
}

export function loadSpyfallSession(): SpyfallSessionSnapshot | null {
  if (!isBrowser()) return null;
  try {
    const parsed = JSON.parse(localStorage.getItem(SPYFALL_SESSION_KEY) ?? "null") as SpyfallSessionSnapshot | null;
    if (!parsed || ![2, 3].includes(Number(parsed.version))) return null;
    return {
      ...parsed,
      version: 3,
      playerNames: Array.isArray(parsed.playerNames) && parsed.playerNames.length === parsed.playerCount
        ? parsed.playerNames
        : Array.from({ length: parsed.playerCount }, (_, index) => `Player ${index + 1}`),
    } as SpyfallSessionSnapshot;
  } catch {
    return null;
  }
}

export function saveSpyfallSession(session: SpyfallSessionSnapshot) {
  if (!isBrowser()) return;
  localStorage.setItem(SPYFALL_SESSION_KEY, JSON.stringify({ ...session, savedAt: Date.now() }));
}

export function clearSpyfallSession() {
  if (!isBrowser()) return;
  localStorage.removeItem(SPYFALL_SESSION_KEY);
}

export function loadLastSpyfallLocationId() {
  return isBrowser() ? localStorage.getItem(SPYFALL_LAST_LOCATION_KEY) : null;
}

export function saveLastSpyfallLocationId(id: string) {
  if (isBrowser()) localStorage.setItem(SPYFALL_LAST_LOCATION_KEY, id);
}

export function loadSpyfallAnswerHistory(categoryId: string) {
  if (!isBrowser()) return [];
  try {
    const value = JSON.parse(localStorage.getItem(SPYFALL_ANSWER_HISTORY_KEY) ?? "{}") as Record<string, string[]>;
    return Array.isArray(value[categoryId]) ? value[categoryId] : [];
  } catch {
    return [];
  }
}

export function saveSpyfallAnswerHistory(categoryId: string, answer: string) {
  if (!isBrowser()) return;
  let value: Record<string, string[]> = {};
  try { value = JSON.parse(localStorage.getItem(SPYFALL_ANSWER_HISTORY_KEY) ?? "{}"); } catch { value = {}; }
  const limit = categoryId === "places" ? 50 : 30;
  value[categoryId] = [answer, ...(value[categoryId] ?? []).filter((item) => item !== answer)].slice(0, limit);
  localStorage.setItem(SPYFALL_ANSWER_HISTORY_KEY, JSON.stringify(value));
}
