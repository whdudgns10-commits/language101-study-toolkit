export type TutorialTarget="language-selector"|"daily-content"|"activity-selector"|"my-study"|"conversation-start";
export type TutorialStep={id:string;target:TutorialTarget;titleKey:string;descriptionKey:string};
export type TutorialContextValue={isOpen:boolean;stepIndex:number;completed:boolean;startTutorial:()=>void;nextStep:()=>void;previousStep:()=>void;finishTutorial:()=>void;skipTutorial:()=>void};
