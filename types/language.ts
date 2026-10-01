export type SupportedLanguage="en"|"ko"|"zh"|"ja";
export type LearningLanguage=SupportedLanguage;
export const supportedLanguages:SupportedLanguage[]=["en","ja","zh","ko"];
export const languageCodes:Record<SupportedLanguage,string>={en:"EN",ko:"KR",ja:"JP",zh:"CN"};
export const languageFlags:Record<SupportedLanguage,string>={en:"🇺🇸",ko:"🇰🇷",ja:"🇯🇵",zh:"🇨🇳"};
export const languageNames:Record<SupportedLanguage,string>={en:"English",ko:"한국어",ja:"日本語",zh:"中文"};
export const documentLanguages:Record<SupportedLanguage,string>={en:"en-US",ko:"ko-KR",ja:"ja-JP",zh:"zh-CN"};
