import type { Activity } from "@/types/activity";

export function uniqueActivities(items:Activity[]){return[...new Map(items.filter(item=>String(item.id||"").trim()&&String(item.title||item.id).trim()&&item.enabled!==false&&item.randomEligible!==false).map(item=>[item.id,item])).values()]}
export function pickRandomActivityIndex(items:Activity[],history:string[],random=Math.random){if(!items.length)return-1;let indices=items.map((_,index)=>index).filter(index=>!history.slice(0,5).includes(items[index].id));if(!indices.length)indices=items.map((_,index)=>index).filter(index=>items[index].id!==history[0]);if(!indices.length)indices=items.map((_,index)=>index);return indices[Math.floor(random()*indices.length)]}
export function nextRandomHistory(history:string[],id:string){return[id,...history.filter(value=>value!==id)].slice(0,5)}
