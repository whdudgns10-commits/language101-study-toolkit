export type SupportedLanguage="en"|"ko"|"ja"|"zh";
export const supportedLanguages:SupportedLanguage[]=["en","ko","ja","zh"];
export const languageCodes:Record<SupportedLanguage,string>={en:"EN",ko:"KO",ja:"JA",zh:"ZH"};
export const languageNames:Record<SupportedLanguage,string>={en:"English",ko:"한국어",ja:"日本語",zh:"中文"};
export const documentLanguages:Record<SupportedLanguage,string>={en:"en-US",ko:"ko-KR",ja:"ja-JP",zh:"zh-CN"};
