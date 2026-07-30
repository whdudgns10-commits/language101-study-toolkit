export type ThreeThingsDifficulty = "beginner" | "intermediate" | "advanced";
export type ThreeThingsQuestion = { id:string; category:string; difficulty:ThreeThingsDifficulty; ko:string; en:string; count:3 };
export type ThreeThingsPlayer = { id:string; name:string; out:boolean };
export type ThreeThingsSettings = { seconds:0|3|5|7|10; randomStart:boolean; category:string };
export type ThreeThingsState = {
  players:ThreeThingsPlayer[]; currentIndex:number; round:number; questionId:string;
  phase:"ready"|"running"|"judging"|"finished"; recentIds:string[]; settings:ThreeThingsSettings;
};
