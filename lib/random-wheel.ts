import type { Activity } from "@/types/activity";
export function selectWheelItems(items:Activity[],limit=10,random=Math.random){return [...items].sort(()=>random()-.5).slice(0,limit)}
export function pickWheelIndex(length:number,lastId:string|null,items:Activity[],random=Math.random){if(!length)return -1;const allowed=items.map((_,i)=>i).filter(i=>items[i]?.id!==lastId);const pool=allowed.length?allowed:items.map((_,i)=>i);return pool[Math.floor(random()*pool.length)]}
export function wheelRotation(index:number,total:number,turns=6){const slice=360/total;return turns*360-(index*slice+slice/2)}
