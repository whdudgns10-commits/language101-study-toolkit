export const ALPHABET = Array.from({ length:26 }, (_, index) => String.fromCharCode(65 + index));

export type AlphabetDifficulty = "beginner" | "intermediate";
export type WordLengthLevel = 0 | 1 | 2 | 3;
export type AlphabetPlayer = {
  id:string;
  name:string;
  correctCount:number;
  failedCount:number;
  penaltyCount:number;
  roundsStarted:number;
};

export function chooseRandomLetter(recent:string[], random = Math.random) {
  const excluded = new Set(recent.slice(-5));
  let availableLetters = ALPHABET.filter((letter) => !excluded.has(letter));
  if (!availableLetters.length) availableLetters = ALPHABET.filter((letter) => letter !== recent.at(-1));
  return availableLetters[Math.floor(random() * availableLetters.length)];
}

export function minimumWordLength(difficulty:AlphabetDifficulty, level:WordLengthLevel) {
  if (difficulty === "beginner" || level === 0) return 0;
  return level === 1 ? 3 : level === 2 ? 4 : 5;
}

export function validateRoundWord(word:string, letter:string, minimumLength:number, roundWords:string[]) {
  const normalized = word.trim().toLowerCase();
  if (!normalized) return { valid:true, error:null };
  if (!normalized.startsWith(letter.toLowerCase())) return { valid:false, error:"letter" as const };
  if (normalized.length < minimumLength) return { valid:false, error:"length" as const };
  if (roundWords.some((value) => value.toLowerCase() === normalized)) return { valid:false, error:"duplicate" as const };
  return { valid:true, error:null };
}

export function recordCorrect(players:AlphabetPlayer[], currentPlayerIndex:number) {
  return players.map((player, index) => index === currentPlayerIndex ? { ...player, correctCount:player.correctCount + 1 } : player);
}

export function recordFailure(players:AlphabetPlayer[], currentPlayerIndex:number) {
  return players.map((player, index) => index === currentPlayerIndex ? { ...player, failedCount:player.failedCount + 1, penaltyCount:player.penaltyCount + 1 } : player);
}

export function recordRoundStart(players:AlphabetPlayer[], startingPlayerIndex:number) {
  return players.map((player, index) => index === startingPlayerIndex ? { ...player, roundsStarted:player.roundsStarted + 1 } : player);
}

export function nextAlphabetPlayer(index:number, count:number) {
  return count ? (index + 1) % count : 0;
}

export function alphabetWinners(players:AlphabetPlayer[]) {
  if (!players.length) return [];
  const fewestPenalties = Math.min(...players.map((player) => player.penaltyCount));
  const penaltyLeaders = players.filter((player) => player.penaltyCount === fewestPenalties);
  const mostCorrect = Math.max(...penaltyLeaders.map((player) => player.correctCount));
  return penaltyLeaders.filter((player) => player.correctCount === mostCorrect);
}

export function resetAlphabetPlayers(players:AlphabetPlayer[]) {
  return players.map((player) => ({ ...player, correctCount:0, failedCount:0, penaltyCount:0, roundsStarted:0 }));
}
