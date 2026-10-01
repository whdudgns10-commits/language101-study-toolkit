"use client";

import { useCallback,useEffect,useMemo,useState } from "react";
import { LanguageContext } from "@/lib/language-context";
import { documentLanguages,type SupportedLanguage } from "@/types/language";
import { getStoredLanguage,isSupportedLanguage,LANGUAGE_STORAGE_KEY,LEARNING_LANGUAGE_STORAGE_KEY,translate } from "@/lib/i18n";

export function LanguageProvider({children}:{children:React.ReactNode}){
  const [language,setState]=useState<SupportedLanguage>("en");
  const [ready,setReady]=useState(false);
  const [isLanguageMenuOpen,setLanguageMenuOpen]=useState(false);
  const apply=useCallback((value:SupportedLanguage)=>{setState(value);document.documentElement.lang=documentLanguages[value]},[]);
  useEffect(()=>{const timer=setTimeout(()=>{const value=getStoredLanguage();localStorage.setItem(LEARNING_LANGUAGE_STORAGE_KEY,value);localStorage.setItem(LANGUAGE_STORAGE_KEY,value);apply(value);setReady(true)},0);const sync=(event:StorageEvent)=>{if(event.key===LEARNING_LANGUAGE_STORAGE_KEY||event.key===LANGUAGE_STORAGE_KEY)apply(isSupportedLanguage(event.newValue)?event.newValue:"en")};window.addEventListener("storage",sync);return()=>{clearTimeout(timer);window.removeEventListener("storage",sync)}},[apply]);
  const setLanguage=useCallback((value:SupportedLanguage)=>{localStorage.setItem(LEARNING_LANGUAGE_STORAGE_KEY,value);localStorage.setItem(LANGUAGE_STORAGE_KEY,value);apply(value);setLanguageMenuOpen(false);window.dispatchEvent(new CustomEvent("language101-language-change",{detail:value}))},[apply]);
  const toggleLanguageMenu=useCallback(()=>setLanguageMenuOpen(value=>!value),[]);
  const value=useMemo(()=>({language,ready,setLanguage,t:(key:string)=>translate(language,key),isLanguageMenuOpen,setLanguageMenuOpen,toggleLanguageMenu}),[language,ready,setLanguage,isLanguageMenuOpen,toggleLanguageMenu]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
