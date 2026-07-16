"use client";
import { useCallback,useEffect,useMemo,useRef,useState } from "react";
import { usePathname,useRouter } from "next/navigation";
import { TutorialContext } from "@/hooks/use-tutorial";
import { tutorialSteps } from "@/data/tutorial-steps";
import { TutorialOverlay } from "@/components/tutorial/tutorial-overlay";

export const TUTORIAL_COMPLETED_KEY="language101-tutorial-completed";
export const TUTORIAL_STEP_KEY="language101-tutorial-step";
export function TutorialProvider({children}:{children:React.ReactNode}){
  const pathname=usePathname();const router=useRouter();const [isOpen,setOpen]=useState(false);const [stepIndex,setStepIndex]=useState(0);const [completed,setCompleted]=useState(true);const checked=useRef(false);const returnFocus=useRef<HTMLElement|null>(null);
  const openTutorial=useCallback(()=>{setStepIndex(0);setOpen(true)},[]);
  const startTutorial=useCallback(()=>{returnFocus.current=document.activeElement as HTMLElement;if(pathname!=="/"){router.push("/");window.setTimeout(openTutorial,350);return}openTutorial()},[pathname,router,openTutorial]);
  const close=useCallback(()=>{localStorage.setItem(TUTORIAL_COMPLETED_KEY,"true");localStorage.removeItem(TUTORIAL_STEP_KEY);setCompleted(true);setOpen(false);requestAnimationFrame(()=>returnFocus.current?.focus())},[]);
  useEffect(()=>{if(checked.current)return;checked.current=true;const done=localStorage.getItem(TUTORIAL_COMPLETED_KEY)==="true";setCompleted(done);if(!done&&pathname==="/"){const timer=window.setTimeout(startTutorial,650);return()=>clearTimeout(timer)}},[pathname,startTutorial]);
  useEffect(()=>{if(isOpen)localStorage.setItem(TUTORIAL_STEP_KEY,String(stepIndex))},[isOpen,stepIndex]);
  const finishTutorial=useCallback(()=>{close();router.push("/conversation-help")},[close,router]);
  const value=useMemo(()=>({isOpen,stepIndex,completed,startTutorial,nextStep:()=>stepIndex<tutorialSteps.length-1?setStepIndex(value=>value+1):finishTutorial(),previousStep:()=>setStepIndex(value=>Math.max(0,value-1)),finishTutorial,skipTutorial:close}),[isOpen,stepIndex,completed,startTutorial,close,finishTutorial]);
  return <TutorialContext.Provider value={value}>{children}{isOpen&&<TutorialOverlay/>}</TutorialContext.Provider>;
}
