"use client";
import { createContext,useContext } from "react";
import type { TutorialContextValue } from "@/types/tutorial";
export const TutorialContext=createContext<TutorialContextValue|undefined>(undefined);
export function useTutorial(){const context=useContext(TutorialContext);if(!context)throw new Error("useTutorial must be used inside TutorialProvider");return context}
