import { createContext } from "react";import type { SupportedLanguage } from "@/types/language";
export type LanguageContextValue={language:SupportedLanguage;ready:boolean;setLanguage:(value:SupportedLanguage)=>void;t:(key:string)=>string};
export const LanguageContext=createContext<LanguageContextValue|undefined>(undefined);
