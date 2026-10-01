import { translations } from "@/data/translations";import type { SupportedLanguage } from "@/types/language";
export const LANGUAGE_STORAGE_KEY="language101-interface-language";
export const LEARNING_LANGUAGE_STORAGE_KEY="language101-learning-language";
export const isSupportedLanguage=(value:unknown):value is SupportedLanguage=>value==="en"||value==="ko"||value==="ja"||value==="zh";
export function translate(language:SupportedLanguage,key:string){const value=translations[language][key];if(!value&&process.env.NODE_ENV!=="production")console.warn(`[i18n] Missing translation: ${language}.${key}`);return value||translations.en[key]||key}
export const languageDateStorageKey=(base:string,language:SupportedLanguage,date:string)=>`${base}-${language}-${date}`;
export function getStoredLanguage():SupportedLanguage{if(typeof window==="undefined")return"en";const learningLanguage=localStorage.getItem(LEARNING_LANGUAGE_STORAGE_KEY);if(isSupportedLanguage(learningLanguage))return learningLanguage;const legacyLanguage=localStorage.getItem(LANGUAGE_STORAGE_KEY);return isSupportedLanguage(legacyLanguage)?legacyLanguage:"en"}
