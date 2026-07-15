export const SEOUL_TIME_ZONE = "Asia/Seoul";

export function getSeoulDateKey(date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: SEOUL_TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}

export function shiftDateKey(dateKey: string, days: number): string {
  const date = new Date(`${dateKey}T12:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function seededHash(seed: string): number {
  let value = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    value ^= seed.charCodeAt(index);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}

function rawIndex(length: number, dateKey: string, namespace: string, offset = 0) {
  return seededHash(`${dateKey}:${namespace}:${offset}`) % length;
}

export function dailyIndex(length: number, dateKey: string, namespace: string, offset = 0, avoidDays = 7): number {
  if (length < 1) throw new Error("Daily content requires at least one item.");
  if (length <= avoidDays) return rawIndex(length, dateKey, namespace, offset);
  const recent = new Set(Array.from({ length: avoidDays }, (_, index) => rawIndex(length, shiftDateKey(dateKey, -(index + 1)), namespace, 0)));
  for (let attempt = 0; attempt < length; attempt += 1) {
    const candidate = rawIndex(length, dateKey, namespace, offset + attempt);
    if (!recent.has(candidate)) return candidate;
  }
  return rawIndex(length, dateKey, namespace, offset);
}

export function selectDailyItem<T>(items: readonly T[], dateKey: string, namespace: string, offset = 0,avoidDays=7): T {
  return items[dailyIndex(items.length, dateKey, namespace, offset,avoidDays)];
}

export function selectDistinctCategoryItems<T extends { category: string }>(items: readonly T[], count: number, dateKey: string, namespace: string, offset = 0,avoidDays=30): T[] {
  const categories = [...new Set(items.map((item) => item.category))];
  const start = dailyIndex(categories.length, dateKey, `${namespace}:categories`, offset, Math.min(5, categories.length - 1));
  const selectedCategories = Array.from({ length: Math.min(count, categories.length) }, (_, index) => categories[(start + index) % categories.length]);
  return selectedCategories.map((category, index) => selectDailyItem(items.filter((item) => item.category === category), dateKey, `${namespace}:${category}`, offset + index,avoidDays));
}

export const dailyStorageKey = (dateKey: string) => `language101-daily-${dateKey}`;
