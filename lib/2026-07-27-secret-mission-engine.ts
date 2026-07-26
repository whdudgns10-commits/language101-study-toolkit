import type {
  SecretMission,
  SecretMissionAssignment,
  SecretMissionPlayer,
} from "@/types/2026-07-27-secret-mission";

export function shuffleSecretMissions<T>(items: readonly T[], random = Math.random) {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [next[index], next[target]] = [next[target], next[index]];
  }
  return next;
}

export function normalizeSecretMissionPlayers(names: string[], count: number): SecretMissionPlayer[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `player-${index + 1}`,
    name: names[index]?.trim() || `Player ${index + 1}`,
  }));
}

export function assignSecretMissions(
  players: readonly SecretMissionPlayer[],
  pool: readonly SecretMission[],
  random = Math.random,
): SecretMissionAssignment[] {
  if (!pool.length) throw new Error("At least one secret mission is required.");
  const shuffled = shuffleSecretMissions(pool, random);
  return players.map((player, index) => ({
    player,
    mission: shuffled[index % shuffled.length],
    completed: false,
  }));
}

export function validateSecretMissions(missions: readonly SecretMission[]) {
  const errors: string[] = [];
  const ids = new Set<string>();
  missions.forEach((mission) => {
    if (!mission.id || !mission.ko.trim() || !mission.en.trim()) errors.push(`Incomplete mission: ${mission.id || "unknown"}`);
    if (ids.has(mission.id)) errors.push(`Duplicate mission id: ${mission.id}`);
    ids.add(mission.id);
  });
  return errors;
}
