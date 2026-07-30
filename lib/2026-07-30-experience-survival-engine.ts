import type {
  ExperienceJudgement,
  ExperienceSurvivalState,
  ExperienceTurn,
  SurvivalPlayer,
  SurvivalSettings,
} from "@/types/2026-07-30-experience-survival";

export function uniquePlayerNames(names: string[], count: number) {
  const used = new Map<string, number>();
  return Array.from({ length: count }, (_, index) => {
    const base = names[index]?.trim() || `Player ${index + 1}`;
    const key = base.toLocaleLowerCase();
    const occurrence = (used.get(key) ?? 0) + 1;
    used.set(key, occurrence);
    return occurrence === 1 ? base : `${base} ${occurrence}`;
  });
}

export function createSurvivalGame(
  names: string[],
  count: number,
  settings: SurvivalSettings,
  random = Math.random,
): ExperienceSurvivalState {
  const players: SurvivalPlayer[] = uniquePlayerNames(names, count).map((name, index) => ({
    id: `survival-player-${index + 1}`,
    name,
    lives: settings.startingLives,
    eliminated: false,
    uniqueWins: 0,
    turns: 0,
  }));
  const currentPlayerIndex = settings.randomStart ? Math.floor(random() * players.length) : 0;
  return {
    version: 1,
    mode: "survival",
    phase: "speaker",
    players,
    settings,
    currentPlayerIndex,
    round: 1,
    currentExperience: "",
    spokenOnly: false,
    judgeIds: [],
    judgeIndex: 0,
    pendingJudgements: [],
    verifiedPlayerIds: [],
    verificationResults: [],
    history: [],
    secondsLeft: settings.turnSeconds || null,
    interrupted: false,
    updatedAt: Date.now(),
  };
}

export function alivePlayers(state: Pick<ExperienceSurvivalState, "players">) {
  return state.players.filter((player) => !player.eliminated);
}

export function currentSpeaker(state: ExperienceSurvivalState) {
  return state.players[state.currentPlayerIndex];
}

export function beginJudging(state: ExperienceSurvivalState, experience: string, spokenOnly = false) {
  const speaker = currentSpeaker(state);
  const judgeIds = state.players
    .filter((player) => !player.eliminated && player.id !== speaker.id)
    .map((player) => player.id);
  return {
    ...state,
    phase: "judging" as const,
    currentExperience: spokenOnly ? "" : experience.trim(),
    spokenOnly,
    judgeIds,
    judgeIndex: 0,
    pendingJudgements: [],
    verifiedPlayerIds: [],
    verificationResults: [],
    secondsLeft: null,
    updatedAt: Date.now(),
  };
}

export function recordJudgement(state: ExperienceSurvivalState, judgement: ExperienceJudgement) {
  const pendingJudgements = [...state.pendingJudgements.filter((item) => item.playerId !== judgement.playerId), judgement];
  return {
    ...state,
    pendingJudgements,
    phase: "judging" as const,
    updatedAt: Date.now(),
  };
}

export function allJudgementsComplete(state: ExperienceSurvivalState) {
  return state.judgeIds.every((id) => state.pendingJudgements.some((item) => item.playerId === id));
}

export function nextAlivePlayer(state: ExperienceSurvivalState) {
  const survivors = alivePlayers(state);
  if (survivors.length <= 1) return null;
  let nextIndex = state.currentPlayerIndex;
  do nextIndex = (nextIndex + 1) % state.players.length;
  while (state.players[nextIndex].eliminated);
  return state.players[nextIndex];
}

export function verificationPlayerIds(state: ExperienceSurvivalState) {
  const speakerId = currentSpeaker(state).id;
  return state.pendingJudgements
    .filter((item) => item.hasDoneIt && item.playerId !== speakerId)
    .map((item) => item.playerId);
}

export function toggleExperienceVerified(state: ExperienceSurvivalState, playerId: string) {
  const allowed = verificationPlayerIds(state);
  if (!allowed.includes(playerId)) return state;
  const verifiedPlayerIds = state.verifiedPlayerIds.includes(playerId)
    ? state.verifiedPlayerIds.filter((id) => id !== playerId)
    : [...state.verifiedPlayerIds, playerId];
  return { ...state, verifiedPlayerIds, updatedAt: Date.now() };
}

export function recordExperienceVerification(
  state: ExperienceSurvivalState,
  playerId: string,
  status: "verified" | "failed",
) {
  if (!verificationPlayerIds(state).includes(playerId)) return state;
  const previous = state.verificationResults.find((item) => item.playerId === playerId)?.status;
  if (previous === status) return state;
  const verificationResults = [
    ...state.verificationResults.filter((item) => item.playerId !== playerId),
    { playerId, status },
  ];
  const players = state.players.map((player) => {
    if (player.id !== playerId) return player;
    const delta = previous === "failed" && status === "verified" ? 1
      : status === "failed" ? -1
      : 0;
    const lives = Math.max(0, Math.min(state.settings.startingLives, player.lives + delta));
    return { ...player, lives, eliminated: lives === 0 };
  });
  return {
    ...state,
    players,
    verificationResults,
    verifiedPlayerIds: verificationResults.filter((item) => item.status === "verified").map((item) => item.playerId),
    updatedAt: Date.now(),
  };
}

export function allVerificationsComplete(state: ExperienceSurvivalState) {
  return verificationPlayerIds(state).every((id) => state.verifiedPlayerIds.includes(id));
}

export function resolveTurn(state: ExperienceSurvivalState) {
  if (!allJudgementsComplete(state)) return state;
  const speaker = currentSpeaker(state);
  const activeJudgements = state.pendingJudgements.filter((item) =>
    state.players.some((player) => player.id === item.playerId && !player.eliminated),
  );
  const everyoneHasDoneIt = activeJudgements.length > 0 && activeJudgements.every((item) => item.hasDoneIt);
  const noOneHasDoneIt = activeJudgements.length > 0 && activeJudgements.every((item) => !item.hasDoneIt);
  const lostLifeIds = everyoneHasDoneIt ? [] : activeJudgements.filter((item) => !item.hasDoneIt).map((item) => item.playerId);
  const bonusApplied = noOneHasDoneIt && state.settings.uniqueBonus && speaker.lives < state.settings.startingLives;
  const players = state.players.map((player) => {
    if (player.id === speaker.id) {
      return {
        ...player,
        lives: bonusApplied ? Math.min(state.settings.startingLives, player.lives + 1) : player.lives,
        uniqueWins: player.uniqueWins + (noOneHasDoneIt ? 1 : 0),
        turns: player.turns + 1,
      };
    }
    if (!lostLifeIds.includes(player.id)) return player;
    const lives = Math.max(0, player.lives - 1);
    return { ...player, lives, eliminated: lives === 0 };
  });
  const eliminatedIds = players
    .filter((player) => player.eliminated && !state.players.find((previous) => previous.id === player.id)?.eliminated)
    .map((player) => player.id);
  const turn: ExperienceTurn = {
    id: `experience-turn-${state.history.length + 1}`,
    round: state.round,
    speakerId: speaker.id,
    experience: state.currentExperience,
    spokenOnly: state.spokenOnly,
    judgements: activeJudgements,
    lostLifeIds,
    eliminatedIds,
    unique: noOneHasDoneIt,
    common: everyoneHasDoneIt,
    bonusApplied,
  };
  return { ...state, phase: "result" as const, players, history: [...state.history, turn], updatedAt: Date.now() };
}

export function advanceTurn(state: ExperienceSurvivalState) {
  const survivors = alivePlayers(state);
  if (survivors.length <= 1) return { ...state, phase: "finished" as const, updatedAt: Date.now() };
  let nextIndex = state.currentPlayerIndex;
  do nextIndex = (nextIndex + 1) % state.players.length;
  while (state.players[nextIndex].eliminated);
  return {
    ...state,
    phase: "speaker" as const,
    currentPlayerIndex: nextIndex,
    round: nextIndex <= state.currentPlayerIndex ? state.round + 1 : state.round,
    currentExperience: "",
    spokenOnly: false,
    judgeIds: [],
    judgeIndex: 0,
    pendingJudgements: [],
    verifiedPlayerIds: [],
    verificationResults: [],
    secondsLeft: state.settings.turnSeconds || null,
    updatedAt: Date.now(),
  };
}

export function currentLeaders(state: ExperienceSurvivalState) {
  const maxLives = Math.max(0, ...state.players.map((player) => player.lives));
  return state.players.filter((player) => player.lives === maxLives);
}
