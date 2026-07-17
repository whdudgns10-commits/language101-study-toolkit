import type { AlphabetDifficulty, AlphabetPlayer, WordLengthLevel } from "@/lib/alphabet-challenge";

export const ALPHABET_PRACTICE_KEY = "language101-alphabet-challenge-practice";
export const ALPHABET_SETTINGS_KEY = "language101-alphabet-challenge-settings";

export type AlphabetRoundRecord = { round:number; letter:string; words:string[]; successfulCount:number; failedPlayerId:string; startingPlayerId:string };
export type AlphabetPractice = {
  id:string; activityId:"words-game"; activityName:"Alphabet Challenge"; date:string;
  difficulty:AlphabetDifficulty; wordLengthLevel:WordLengthLevel; minimumWordLength:number;
  participantCount:number; players:AlphabetPlayer[]; letters:string[]; roundHistory:AlphabetRoundRecord[];
  rounds:number; correct:number; missed:number; penalties:number; failedPlayerIds:string[];
  longestRound:number; winner:string; memo:string; createdAt:string; level?:string; penalty?:number;
};

export function readAlphabetPractices() {
  if (typeof window === "undefined") return [] as AlphabetPractice[];
  try { return JSON.parse(localStorage.getItem(ALPHABET_PRACTICE_KEY) || "[]") as AlphabetPractice[]; }
  catch { return []; }
}

export function saveAlphabetPractice(record:AlphabetPractice) {
  localStorage.setItem(ALPHABET_PRACTICE_KEY, JSON.stringify([record, ...readAlphabetPractices()]));
  window.dispatchEvent(new CustomEvent("language101-study-change"));
}
