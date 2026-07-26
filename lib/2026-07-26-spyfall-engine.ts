import categoryData from "../data/2026-07-26-spyfall-categories.json";
import type {
  SpyfallCategory,
  SpyfallVoteResult,
  SpyfallWinner,
} from "../types/2026-07-26-spyfall";

export const spyfallCategories = categoryData as SpyfallCategory[];
export const SPYFALL_CANDIDATE_COUNT = 20;

export function normalizeSpyfallAnswer(value: string) {
  return value
    .normalize("NFKC")
    .toLocaleLowerCase()
    .replace(/[^a-z0-9가-힣]/g, "");
}

export function shuffleSpyfallItems<T>(items: readonly T[], random = Math.random) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

export function chooseSpyfallAnswer(
  category: SpyfallCategory,
  previousAnswer: string | null,
  random = Math.random,
) {
  const choices = category.items.filter((item) => item !== previousAnswer);
  const pool = choices.length ? choices : category.items;
  return pool[Math.floor(random() * pool.length)];
}

export function buildSpyfallCandidates(
  category: SpyfallCategory,
  answer: string,
  count = SPYFALL_CANDIDATE_COUNT,
  random = Math.random,
) {
  const uniqueItems = [...new Set(category.items)];
  if (!uniqueItems.includes(answer)) {
    throw new Error(`Spyfall answer "${answer}" is not in category "${category.id}".`);
  }
  if (uniqueItems.length < count) {
    throw new Error(`Spyfall category "${category.id}" needs at least ${count} items.`);
  }
  const distractors = shuffleSpyfallItems(
    uniqueItems.filter((item) => item !== answer),
    random,
  ).slice(0, count - 1);
  return shuffleSpyfallItems([...distractors, answer], random);
}

export function calculateSpyfallVote(
  votes: number[],
  alivePlayers: number[],
): SpyfallVoteResult {
  const totals = Object.fromEntries(alivePlayers.map((number) => [number, 0])) as Record<number, number>;
  votes.forEach((number) => {
    if (number in totals) totals[number] += 1;
  });
  const highest = Math.max(0, ...Object.values(totals));
  const leaders = alivePlayers.filter((number) => totals[number] === highest);
  return {
    totals,
    leaders,
    highest,
    majority: highest > alivePlayers.length / 2,
  };
}

export function evaluateSpyfallVote(
  votedPlayer: number,
  spyNumbers: number[],
  stage: "mid" | "final",
): { winner: SpyfallWinner | null; eliminate: number | null; continueToRoundTwo: boolean } {
  if (spyNumbers.includes(votedPlayer)) {
    return { winner: "citizens", eliminate: null, continueToRoundTwo: false };
  }
  if (stage === "final") {
    return { winner: "spies", eliminate: null, continueToRoundTwo: false };
  }
  return { winner: null, eliminate: votedPlayer, continueToRoundTwo: true };
}

export function evaluateSpyfallGuess(input: string, answer: string): SpyfallWinner {
  return normalizeSpyfallAnswer(input) === normalizeSpyfallAnswer(answer)
    ? "spies"
    : "citizens";
}

export function validateSpyfallCategories() {
  const errors: string[] = [];
  const ids = new Set<string>();
  spyfallCategories.forEach((category) => {
    if (ids.has(category.id)) errors.push(`Duplicate category id: ${category.id}`);
    ids.add(category.id);
    const minimum = category.id === "places" ? 100 : 50;
    if (category.items.length < minimum) {
      errors.push(`${category.id} has ${category.items.length}; expected at least ${minimum}`);
    }
    if (new Set(category.items.map(normalizeSpyfallAnswer)).size !== category.items.length) {
      errors.push(`${category.id} contains duplicate items`);
    }
  });
  return errors;
}
