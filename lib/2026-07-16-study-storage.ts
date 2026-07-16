import { dailyStorageKey, getSeoulDateKey } from "@/lib/daily-content";
import type { DailyStudyProgress, ExpressionUsageLog, SavedExpression, StudyNote, StudyProgressEntry, StudyStatus } from "@/types/2026-07-16-study";

export const STUDY_EVENT = "language101-study-change";
export const STUDY_KEYS = {
  notes: "studyNotes", savedExpressions: "savedExpressions", usageLogs: "expressionUsageLogs",
  progress: "missionProgress", favoriteActivities: "language101-favorites",
  favoriteExpressions: "language101-expression-favorites", favoriteQuestions: "favoriteQuestions",
  favoritePracticeExpressions: "favoritePracticeExpressions",
} as const;

const read = <T,>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  try { const value = localStorage.getItem(key); return value ? JSON.parse(value) as T : fallback; } catch { return fallback; }
};
const write = (key: string, value: unknown) => {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent(STUDY_EVENT, { detail: { key } }));
};
export const studyId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
export const getStudyNotes = () => read<StudyNote[]>(STUDY_KEYS.notes, []);
export const saveStudyNote = (note: StudyNote) => write(STUDY_KEYS.notes, [note, ...getStudyNotes().filter((item) => item.id !== note.id)]);
export const deleteStudyNote = (id: string) => write(STUDY_KEYS.notes, getStudyNotes().filter((item) => item.id !== id));
export const getSavedExpressions = () => read<SavedExpression[]>(STUDY_KEYS.savedExpressions, []);
export const saveExpression = (entry: SavedExpression) => write(STUDY_KEYS.savedExpressions, [entry, ...getSavedExpressions().filter((item) => item.id !== entry.id && item.expression.toLowerCase() !== entry.expression.toLowerCase())]);
export const deleteSavedExpression = (id: string) => write(STUDY_KEYS.savedExpressions, getSavedExpressions().filter((item) => item.id !== id));
export const getUsageLogs = () => read<ExpressionUsageLog[]>(STUDY_KEYS.usageLogs, []);
export const saveUsageLog = (log: ExpressionUsageLog) => write(STUDY_KEYS.usageLogs, [log, ...getUsageLogs()]);
export const getIdList = (key: string) => read<string[]>(key, []);
export const setIdList = (key: string, ids: string[]) => write(key, ids);
export const toggleId = (key: string, id: string) => { const next = new Set(getIdList(key)); if (next.has(id)) next.delete(id); else next.add(id); setIdList(key, [...next]); };

const blankProgress = (date: string): DailyStudyProgress => ({ date, missions: {}, dailyExpression: {}, practiceExpressions: {} });
export const getProgressMap = () => read<Record<string, DailyStudyProgress>>(STUDY_KEYS.progress, {});
export const getDailyProgress = (date = getSeoulDateKey()) => getProgressMap()[date] || blankProgress(date);
export function setProgress(group: "missions" | "dailyExpression" | "practiceExpressions", id: string, status: StudyStatus, memo?: string, date = getSeoulDateKey()) {
  const all = getProgressMap(); const current = all[date] || blankProgress(date);
  const entry: StudyProgressEntry = { ...current[group][id], status, memo: memo ?? current[group][id]?.memo };
  if (status !== "not-started") entry.completedAt = new Date().toISOString();
  all[date] = { ...current, [group]: { ...current[group], [id]: entry } };
  write(STUDY_KEYS.progress, all);
  if (group === "missions" || group === "dailyExpression") {
    const key=dailyStorageKey(date); const legacy=read<{completedMissionIds?:string[];usedExpressionIds?:string[]}>(key,{});
    const field=group === "missions" ? "completedMissionIds" : "usedExpressionIds";
    const ids=new Set(legacy[field]||[]); if(status==="not-started")ids.delete(id);else ids.add(id);
    localStorage.setItem(key,JSON.stringify({...legacy,[field]:[...ids]}));
    window.dispatchEvent(new CustomEvent(STUDY_EVENT));
  }
}

export function migrateLegacyNotes() {
  if (typeof window === "undefined" || localStorage.getItem("language101-study-notes-migrated")) return;
  const legacy = read<Array<{id:string;date:string;activityId:string;activityTitle:string;learned:string;corrected:string;nextTime:string;createdAt:string}>>("language101-learning-notes", []);
  const existing = getStudyNotes();
  const converted = legacy.filter((item) => !existing.some((note) => note.id === item.id)).map((item) => ({ id:item.id,title:item.activityTitle,date:item.date,content:[item.learned&&`새로 배운 표현: ${item.learned}`,item.corrected&&`수정받은 문장: ${item.corrected}`,item.nextTime&&`다음에 쓸 표현: ${item.nextTime}`].filter(Boolean).join("\n"),relatedExpressionIds:[],relatedMissionIds:[],createdAt:item.createdAt,updatedAt:item.createdAt }));
  if (converted.length) write(STUDY_KEYS.notes, [...converted, ...existing]);
  localStorage.setItem("language101-study-notes-migrated", "1");
}
