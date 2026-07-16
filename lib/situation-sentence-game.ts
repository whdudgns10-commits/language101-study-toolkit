import { situationPools,type SituationCategory,type SituationLevel,type SituationWord } from "../data/situation-sentence-game";
export type SituationMode="one"|"three"|"story"|"group";
export const cardCountForLevel=(level:SituationLevel)=>level==="beginner"?3:level==="intermediate"?5:8;
const hash=(value:string)=>{let result=2166136261;for(const char of value){result^=char.charCodeAt(0);result=Math.imul(result,16777619)}return result>>>0};
const pick=(category:SituationCategory,seed:string)=>situationPools[category][hash(`${seed}:${category}`)%situationPools[category].length];
export function createSituationCards(level:SituationLevel,seed:string):SituationWord[]{const categories:SituationCategory[]=level==="beginner"?["country","place","situation"]:level==="intermediate"?["country","place","situation","person",hash(seed)%2?"emotion":"time"]:["country","place","situation","person","time","emotion","expression","event"];return categories.map(category=>pick(category,seed));}
export const containsCard=(text:string,card:SituationWord)=>text.toLocaleLowerCase().includes(card.value.replace(/[?.…]/g,"").toLocaleLowerCase());
export const situationCombinationId=(cards:SituationWord[])=>cards.map(card=>card.id).join("+");
