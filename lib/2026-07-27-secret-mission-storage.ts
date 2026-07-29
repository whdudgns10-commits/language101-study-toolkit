import type { SecretMission, SecretMissionSession } from "@/types/2026-07-27-secret-mission";

export const SECRET_MISSION_CUSTOM_KEY = "language101-secret-mission-custom";
export const SECRET_MISSION_SESSION_KEY = "language101-secret-mission-session";

const browser = () => typeof window !== "undefined";

export function loadCustomSecretMissions(): SecretMission[] {
  if (!browser()) return [];
  try {
    const value = JSON.parse(localStorage.getItem(SECRET_MISSION_CUSTOM_KEY) ?? "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export function saveCustomSecretMissions(missions: SecretMission[]) {
  if (browser()) localStorage.setItem(SECRET_MISSION_CUSTOM_KEY, JSON.stringify(missions));
}

export function loadSecretMissionSession(): SecretMissionSession | null {
  if (!browser()) return null;
  try {
    const value = JSON.parse(localStorage.getItem(SECRET_MISSION_SESSION_KEY) ?? "null") as (SecretMissionSession & { version: number }) | null;
    if (!value) return null;
    if (value.version === 2) return value;
    if (value.version === 1) return {
      ...value,
      version: 2,
      initialSeconds: value.timerMinutes === 0 ? null : value.timerMinutes * 60,
      phase: "playing",
      status: "playing",
      revealIndex: 0,
    };
    return null;
  } catch {
    return null;
  }
}

export function saveSecretMissionSession(session: SecretMissionSession) {
  if (!browser()) return false;
  try {
    localStorage.setItem(SECRET_MISSION_SESSION_KEY, JSON.stringify(session));
    return true;
  } catch {
    return false;
  }
}

export function clearSecretMissionSession() {
  if (browser()) localStorage.removeItem(SECRET_MISSION_SESSION_KEY);
}
