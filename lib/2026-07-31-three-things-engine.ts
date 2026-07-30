import questionsJson from "@/data/2026-07-31-three-things.json";
import type { ThreeThingsQuestion,ThreeThingsSettings,ThreeThingsState } from "@/types/2026-07-31-three-things";

export const threeThingsQuestions=questionsJson as ThreeThingsQuestion[];
export const threeThingsCategories=["전체",...new Set(threeThingsQuestions.map(item=>item.category))];
export function createThreeThingsGame(names:string[],settings:ThreeThingsSettings,random=Math.random):ThreeThingsState{
 const players=names.map((name,index)=>({id:`three-player-${index+1}`,name:name.trim()||`Player ${index+1}`,out:false}));
 const currentIndex=settings.randomStart?Math.floor(random()*players.length):0;
 return {players,currentIndex,round:1,questionId:"",phase:"ready",recentIds:[],settings};
}
export function activeThreeThingsPlayers(state:ThreeThingsState){return state.players.filter(player=>!player.out)}
export function nextThreeThingsPlayerIndex(state:ThreeThingsState){
 if(activeThreeThingsPlayers(state).length<=1)return state.currentIndex;
 let index=state.currentIndex;do index=(index+1)%state.players.length;while(state.players[index].out);return index;
}
export function pickThreeThingsQuestion(state:ThreeThingsState,random=Math.random){
 const filtered=threeThingsQuestions.filter(item=>state.settings.category==="전체"||item.category===state.settings.category);
 const recent=new Set(state.recentIds.slice(-30));let pool=filtered.filter(item=>!recent.has(item.id)&&item.id!==state.questionId);
 if(!pool.length)pool=filtered;const question=pool[Math.floor(random()*pool.length)]??threeThingsQuestions[0];
 return {...state,questionId:question.id,recentIds:[...state.recentIds,question.id].slice(-30),phase:"ready" as const};
}
export function judgeThreeThingsTurn(state:ThreeThingsState,success:boolean){
 const players=state.players.map((player,index)=>index===state.currentIndex&&!success?{...player,out:true}:player);
 const next={...state,players};const alive=activeThreeThingsPlayers(next);
 if(alive.length<=1)return {...next,phase:"finished" as const};
 const currentIndex=nextThreeThingsPlayerIndex(next);
 return {...next,currentIndex,round:currentIndex<=state.currentIndex?state.round+1:state.round,phase:"ready" as const};
}
export function validateThreeThingsQuestions(){
 const errors:string[]=[];if(threeThingsQuestions.length<100)errors.push("At least 100 questions required.");
 if(new Set(threeThingsQuestions.map(item=>item.id)).size!==threeThingsQuestions.length)errors.push("Duplicate id.");
 if(threeThingsQuestions.some(item=>!item.ko||!item.en||item.count!==3))errors.push("Incomplete question.");
 return errors;
}
