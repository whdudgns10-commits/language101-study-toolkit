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
    phase: "handoff" as const,
    currentExperience: spokenOnly ? "" : experience.trim(),
    spokenOnly,
    judgeIds,
    judgeIndex: 0,
    pendingJudgements: [],
    secondsLeft: null,
    updatedAt: Date.now(),
  };
}

export function recordJudgement(state: ExperienceSurvivalState, judgement: ExperienceJudgement) {
  const pendingJudgements = [...state.pendingJudgements.filter((item) => item.playerId !== judgement.playerId), judgement];
  const isLast = state.judgeIndex >= state.judgeIds.length - 1;
  return {
    ...state,
    pendingJudgements,
    phase: isLast ? "result" as const : "handoff" as const,
    judgeIndex: isLast ? state.judgeIndex : state.judgeIndex + 1,
    updatedAt: Date.now(),
  };
}

export function resolveTurn(state: ExperienceSurvivalState) {
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
  return { ...state, players, history: [...state.history, turn], updatedAt: Date.now() };
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
    secondsLeft: state.settings.turnSeconds || null,
    updatedAt: Date.now(),
  };
}

export function currentLeaders(state: ExperienceSurvivalState) {
  const maxLives = Math.max(0, ...state.players.map((player) => player.lives));
  return state.players.filter((player) => player.lives === maxLives);
}
