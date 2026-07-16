"use client";

import { Check,Globe2,X } from "lucide-react";
import { useEffect,useRef } from "react";
import { useLanguage } from "@/hooks/use-language";
import { languageCodes,languageNames,supportedLanguages } from "@/types/language";

export function LanguageSelector(){
  const {language,setLanguage,t,isLanguageMenuOpen:open,setLanguageMenuOpen:setOpen,toggleLanguageMenu}=useLanguage();
  const ref=useRef<HTMLDivElement>(null);
  useEffect(()=>{const close=(event:PointerEvent)=>{if(!ref.current?.contains(event.target as Node))setOpen(false)};const escape=(event:KeyboardEvent)=>{if(event.key==="Escape")setOpen(false)};document.addEventListener("pointerdown",close);document.addEventListener("keydown",escape);return()=>{document.removeEventListener("pointerdown",close);document.removeEventListener("keydown",escape)}},[setOpen]);
  return <div className="language-selector" ref={ref}>
    <button type="button" className="language-trigger" data-tutorial="language-selector" aria-label="Select language" aria-haspopup="menu" aria-expanded={open} aria-controls="language-menu" onClick={toggleLanguageMenu}><Globe2 aria-hidden="true"/><span>{languageCodes[language]}</span></button>
    {open&&<><button type="button" className="language-backdrop" aria-label={t("common.close")} onClick={()=>setOpen(false)}/><div id="language-menu" className="language-menu" role="menu" aria-label="Language"><header><Globe2 aria-hidden="true"/><strong>Language</strong><button type="button" aria-label={t("common.close")} onClick={()=>setOpen(false)}><X/></button></header>{supportedLanguages.map(item=><button type="button" role="menuitemradio" aria-checked={language===item} onClick={()=>setLanguage(item)} key={item}><span className="language-check">{language===item&&<Check aria-hidden="true"/>}</span><span>{languageNames[item]}</span><small>{languageCodes[item]}</small></button>)}</div></>}
  </div>;
}
