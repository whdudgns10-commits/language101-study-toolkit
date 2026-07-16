export type LearningNote = { id: string; date: string; activityId: string; activityTitle: string; learned: string; corrected: string; nextTime: string; createdAt: string };
const NOTES_KEY = "language101-learning-notes";
const EXPRESSION_KEY = "language101-expression-favorites";
const SESSION_KEY = "language101-session-activities";

import { getLocalDateKey } from "@/lib/daily-content";
export const todayKey = () => getLocalDateKey();
const read = <T,>(key: string, fallback: T): T => { if (typeof window === "undefined") return fallback; try { return JSON.parse(localStorage.getItem(key) || "") as T; } catch { return fallback; } };
const write = (key: string, value: unknown) => { localStorage.setItem(key, JSON.stringify(value)); window.dispatchEvent(new CustomEvent("language101-study-change")); };

export const getNotes = () => read<LearningNote[]>(NOTES_KEY, []);
export const saveNote = (note: LearningNote) => { const notes = getNotes().filter((item) => item.id !== note.id); write(NOTES_KEY, [note, ...notes]); };
export const deleteNote = (id: string) => write(NOTES_KEY, getNotes().filter((item) => item.id !== id));
export const getExpressionFavorites = () => read<string[]>(EXPRESSION_KEY, []);
export const toggleExpressionFavorite = (id: string) => { const values = new Set(getExpressionFavorites()); if (values.has(id)) values.delete(id); else values.add(id); write(EXPRESSION_KEY, [...values]); return values.has(id); };
export const getSessionActivities = () => { const value = read<{ date: string; ids: string[] }>(SESSION_KEY, { date: todayKey(), ids: [] }); return value.date === todayKey() ? value.ids : []; };
export const recordSessionActivity = (id: string) => write(SESSION_KEY, { date: todayKey(), ids: [...new Set([...getSessionActivities(), id])] });
