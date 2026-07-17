export const ALPHABET = Array.from({ length: 26 }, (_, index) => String.fromCharCode(65 + index));

export type AlphabetPlayer = { id: string; name: string; correct: number; missed: number };
export type AlphabetRoundResult = "correct" | "missed" | "skip";

export function chooseRandomLetter(recent: string[], random = Math.random) {
  const usedInCycle = new Set(recent.slice(-26));
  let availableLetters = ALPHABET.filter((letter) => !usedInCycle.has(letter));
  if (!availableLetters.length) availableLetters = ALPHABET.filter((letter) => letter !== recent.at(-1));
  return availableLetters[Math.floor(random() * availableLetters.length)];
}

export function applyAlphabetResult(player: AlphabetPlayer, result: AlphabetRoundResult) {
  if (result === "correct") return { ...player, correct: player.correct + 1 };
  if (result === "missed") return { ...player, missed: player.missed + 1 };
  return player;
}

export function nextAlphabetPlayer(index: number, count: number) {
  return count ? (index + 1) % count : 0;
}

export function alphabetWinners(players: AlphabetPlayer[]) {
  if (!players.length) return [];
  const bestCorrect = Math.max(...players.map((player) => player.correct));
  const correctLeaders = players.filter((player) => player.correct === bestCorrect);
  const fewestMissed = Math.min(...correctLeaders.map((player) => player.missed));
  return correctLeaders.filter((player) => player.missed === fewestMissed);
}

export function resetAlphabetPlayers(players: AlphabetPlayer[]) {
  return players.map((player) => ({ ...player, correct: 0, missed: 0 }));
}
