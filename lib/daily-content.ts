export const SEOUL_TIME_ZONE = "Asia/Seoul";

export function getSeoulDateKey(date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: SEOUL_TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}

/** Browser-local YYYY-MM-DD key without UTC conversion shifting the day. */
export function getLocalDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
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
  void avoidDays;
  const rank = (reroll: number) => [...items].sort((a,b) => seededHash(`${dateKey}:${namespace}:${reroll}:${JSON.stringify(a)}`)-seededHash(`${dateKey}:${namespace}:${reroll}:${JSON.stringify(b)}`));
  const previouslyUsed = new Set<T>();
  for (let reroll=0;reroll<offset;reroll+=1) { const categories=new Set<string>(); for (const item of rank(reroll)) { if(!categories.has(item.category)){categories.add(item.category);previouslyUsed.add(item);if(categories.size===count)break;} } }
  const categories=new Set<string>(); const selected:T[]=[];
  for (const item of rank(offset)) { if(!previouslyUsed.has(item)&&!categories.has(item.category)){categories.add(item.category);selected.push(item);if(selected.length===count)break;} }
  if(selected.length<count){for(const item of rank(offset)){if(!selected.includes(item)&&!categories.has(item.category)){categories.add(item.category);selected.push(item);if(selected.length===count)break;}}}
  return selected;
}

export function selectDistinctDailyItems<T extends { id: string }>(items: readonly T[], count: number, dateKey: string, namespace: string, avoidDays=5): T[] {
  const selectForDate=(key:string)=>[...items].sort((a,b)=>seededHash(`${key}:${namespace}:${a.id}`)-seededHash(`${key}:${namespace}:${b.id}`)).slice(0,count);
  const recentIds=new Set(Array.from({length:avoidDays},(_,day)=>selectForDate(shiftDateKey(dateKey,-(day+1))).map(item=>item.id)).flat());
  const ranked=[...items].sort((a,b)=>seededHash(`${dateKey}:${namespace}:${a.id}`)-seededHash(`${dateKey}:${namespace}:${b.id}`));
  return [...ranked.filter(item=>!recentIds.has(item.id)),...ranked.filter(item=>recentIds.has(item.id))].slice(0,Math.min(count,items.length));
}

export const dailyStorageKey = (dateKey: string,language?:string) => language?`language101-daily-${language}-${dateKey}`:`language101-daily-${dateKey}`;
