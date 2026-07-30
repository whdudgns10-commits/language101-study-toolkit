import { experienceHints } from "@/data/2026-07-30-experience-hints";

export type NeverHaveIEverQuestion = {
  id: string;
  category: string;
  en: string;
  ko: string;
  followUpEn: string;
  followUpKo: string;
};

const variants = [
  {
    en: (value: string) => value,
    ko: (value: string) => value,
    followUpEn: "What happened, and why do you still remember it?",
    followUpKo: "무슨 일이 있었고, 왜 아직도 기억에 남나요?",
  },
  {
    en: (value: string) => `${value} without planning it in advance`,
    ko: (value: string) => `${value}을(를) 계획 없이 즉흥적으로 해본 경험`,
    followUpEn: "How did the spontaneous decision change the experience?",
    followUpKo: "즉흥적인 결정이 그 경험을 어떻게 바꾸었나요?",
  },
  {
    en: (value: string) => `${value} and had an unexpected result`,
    ko: (value: string) => `${value}을(를) 했다가 예상 밖의 결과를 겪은 경험`,
    followUpEn: "What surprised you most, and what did you learn?",
    followUpKo: "무엇이 가장 놀라웠고, 무엇을 배웠나요?",
  },
  {
    en: (value: string) => `${value} with someone I had just met`,
    ko: (value: string) => `${value}을(를) 처음 만난 사람과 함께 해본 경험`,
    followUpEn: "How did you meet, and did you stay in touch afterward?",
    followUpKo: "어떻게 만났고, 그 후에도 연락을 이어갔나요?",
  },
  {
    en: (value: string) => `${value} and wanted to do it again`,
    ko: (value: string) => `${value}을(를) 해보고 다시 하고 싶었던 경험`,
    followUpEn: "What made it worth doing again, and what would you change?",
    followUpKo: "다시 하고 싶었던 이유와 다음에 바꾸고 싶은 점은 무엇인가요?",
  },
];

const requestedCategories = [
  "dating", "travel", "school", "work", "friends", "culture", "overseas-life",
  "working-holiday", "hobbies", "mistakes", "funny", "food", "social-media",
  "international-friends", "blind-date", "first-love", "relationships", "marriage",
  "ideal-type", "mbti", "life-in-korea", "english-study", "language-exchange",
  "scary", "money", "shopping", "games", "exercise", "challenges", "bucket-list",
] as const;

export const neverHaveIEverQuestions: NeverHaveIEverQuestion[] = Array.from({ length: 525 }, (_, index) => {
  const hint = experienceHints[index % experienceHints.length];
  const variant = variants[Math.floor(index / experienceHints.length)];
  const category = requestedCategories[index % requestedCategories.length];
  return {
    id: `never-question-${String(index + 1).padStart(3, "0")}`,
    category,
    en: `Never have I ever had this experience: ${variant.en(hint.en.replace(/^[A-Z]/, (letter) => letter.toLowerCase()))}.`,
    ko: `나는 이런 경험을 해본 적이 있다: ${variant.ko(hint.ko)}.`,
    followUpEn: variant.followUpEn,
    followUpKo: variant.followUpKo,
  };
});

export const neverHaveIEverCategories = [...requestedCategories];

export function validateNeverHaveIEverQuestions() {
  const errors: string[] = [];
  if (neverHaveIEverQuestions.length < 500) errors.push("At least 500 questions are required.");
  if (new Set(neverHaveIEverQuestions.map((item) => item.id)).size !== neverHaveIEverQuestions.length) errors.push("Duplicate question id.");
  if (new Set(neverHaveIEverQuestions.map((item) => item.en.toLowerCase())).size !== neverHaveIEverQuestions.length) errors.push("Duplicate English question.");
  if (neverHaveIEverQuestions.some((item) => !item.en || !item.ko || !item.followUpEn || !item.followUpKo)) errors.push("Incomplete question.");
  return errors;
}
