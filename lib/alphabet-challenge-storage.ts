export const ALPHABET_PRACTICE_KEY = "language101-alphabet-challenge-practice";

export type AlphabetPractice = {
  id: string;
  date: string;
  participantCount: number;
  level: string;
  letters: string[];
  rounds: number;
  correct: number;
  missed: number;
  penalty?: number;
  winner: string;
  memo: string;
  createdAt: string;
};

export function readAlphabetPractices() {
  if (typeof window === "undefined") return [] as AlphabetPractice[];
  try {
    return JSON.parse(localStorage.getItem(ALPHABET_PRACTICE_KEY) || "[]") as AlphabetPractice[];
  } catch {
    return [];
  }
}

export function saveAlphabetPractice(record: AlphabetPractice) {
  localStorage.setItem(ALPHABET_PRACTICE_KEY, JSON.stringify([record, ...readAlphabetPractices()]));
  window.dispatchEvent(new CustomEvent("language101-study-change"));
}
