import type { ExperienceSurvivalState } from "@/types/2026-07-30-experience-survival";

export const EXPERIENCE_SURVIVAL_KEY = "language101-experience-survival-v1";

export function loadExperienceSurvival(): ExperienceSurvivalState | null {
  if (typeof window === "undefined") return null;
  try {
    const value = JSON.parse(localStorage.getItem(EXPERIENCE_SURVIVAL_KEY) ?? "null") as ExperienceSurvivalState | null;
    return value?.version === 1 && Array.isArray(value.players) ? value : null;
  } catch {
    return null;
  }
}

export function saveExperienceSurvival(state: ExperienceSurvivalState) {
  if (typeof window === "undefined") return false;
  try {
    localStorage.setItem(EXPERIENCE_SURVIVAL_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function clearExperienceSurvival() {
  if (typeof window !== "undefined") localStorage.removeItem(EXPERIENCE_SURVIVAL_KEY);
}
