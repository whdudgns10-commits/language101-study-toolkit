import type { Activity } from "@/types/activity";
import type { SupportedLanguage } from "@/types/language";

const ko:Record<string, { title:string; description:string; instructions?:string[] }> = {
  "true-or-false":{ title:"진실 혹은 거짓", description:"진실과 거짓 문장을 말하고 서로 정답을 맞혀 보세요." },
  "30-second-speaking":{ title:"30초 말하기", description:"무작위 주제로 30초 동안 멈추지 않고 말해 보세요." },
  "20-questions":{ title:"스무고개", description:"예·아니요 질문을 하며 사람, 사물 또는 장소를 맞혀 보세요." },
  "what-if-challenge":{ title:"만약에 챌린지", description:"재미있는 가상 상황을 상상하고 의견을 나눠 보세요." },
  "funny-questions":{ title:"재미있는 질문", description:"뜻밖의 질문으로 가볍게 대화를 시작하세요." },
  "ice-breaking-3":{ title:"아이스브레이킹 질문", description:"처음 만난 사람과 자연스럽게 친해지는 질문 활동입니다." },
  "fun-discuss":{ title:"재미있는 토론", description:"가볍고 흥미로운 주제를 그룹으로 이야기하세요." },
  "guessing-words":{ title:"단어 맞히기", description:"정답 단어를 말하지 않고 설명해 함께 맞혀 보세요." },
  "word-battle":{ title:"단어 배틀", description:"어휘력과 설명 속도로 즐기는 팀 단어 게임입니다." },
  "balance-game":{ title:"밸런스 게임", description:"두 선택지 중 하나를 고르고 이유를 설명하세요." },
  "balance-game-2":{ title:"밸런스 게임 2", description:"새로운 양자택일 질문으로 의견을 비교하세요." },
  "words-game":{ title:"5초 알파벳 게임", description:"랜덤 알파벳이 나오면 5초 안에 그 글자로 시작하는 영어 단어를 말하세요." },
  "debate-pros-cons":{ title:"찬반 토론", description:"한 주제의 찬성과 반대 입장을 근거와 함께 토론하세요." },
  "choose-one-out-of-three":{ title:"세 가지 중 하나", description:"세 선택지 중 하나를 고르고 판단 기준을 설명하세요." },
  "useful-expressions":{ title:"유용한 표현", description:"실제 대화에서 자주 쓰는 표현을 익히고 연습하세요." },
  "practice-of-expressing":{ title:"표현 연습", description:"의견, 반응과 감정을 자연스럽게 표현해 보세요." },
  "describing-picture-game":{ title:"상황 문장 만들기", description:"주어진 단어를 연결해 영어 문장과 이야기를 만들어 보세요." },
};

const shortTitles:Record<SupportedLanguage, Record<string,string>> = {
  en:{},
  ko:{ "true-or-false":"진실/거짓", "30-second-speaking":"30초 말하기", "20-questions":"스무고개", "what-if-challenge":"만약에", "funny-questions":"재미 질문", "ice-breaking-3":"아이스브레이크", "fun-discuss":"재미 토론", "guessing-words":"단어 맞히기", "word-battle":"단어 배틀", "balance-game":"밸런스 게임", "balance-game-2":"밸런스 2", "words-game":"알파벳 게임", "debate-pros-cons":"찬반 토론", "choose-one-out-of-three":"하나 고르기", "useful-expressions":"유용한 표현", "practice-of-expressing":"표현 연습", "describing-picture-game":"상황 문장" },
  zh:{ "true-or-false":"真假游戏", "30-second-speaking":"30秒表达", "20-questions":"20个问题", "what-if-challenge":"如果挑战", "funny-questions":"趣味问题", "ice-breaking-3":"破冰问题", "fun-discuss":"趣味讨论", "guessing-words":"猜单词", "word-battle":"单词对战", "balance-game":"二选一", "balance-game-2":"二选一 2", "words-game":"字母挑战", "debate-pros-cons":"正反辩论", "choose-one-out-of-three":"三选一", "useful-expressions":"实用表达", "practice-of-expressing":"表达练习", "describing-picture-game":"情境造句" },
  ja:{ "true-or-false":"真実か嘘", "30-second-speaking":"30秒トーク", "20-questions":"20の質問", "what-if-challenge":"もしも", "funny-questions":"面白い質問", "ice-breaking-3":"アイスブレイク", "fun-discuss":"楽しい討論", "guessing-words":"単語当て", "word-battle":"単語バトル", "balance-game":"二択ゲーム", "balance-game-2":"二択 2", "words-game":"文字チャレンジ", "debate-pros-cons":"賛否討論", "choose-one-out-of-three":"三択", "useful-expressions":"便利な表現", "practice-of-expressing":"表現練習", "describing-picture-game":"英文作り" },
};

const titles:Partial<Record<SupportedLanguage, Record<string,string>>> = {
  zh:{ "true-or-false":"真假游戏", "30-second-speaking":"30秒英语表达", "20-questions":"20个问题", "what-if-challenge":"如果挑战", "funny-questions":"趣味问题", "ice-breaking-3":"破冰问题", "fun-discuss":"趣味讨论", "guessing-words":"猜单词", "word-battle":"单词对战", "balance-game":"二选一游戏", "balance-game-2":"二选一游戏 2", "words-game":"5秒字母挑战", "debate-pros-cons":"正反方辩论", "choose-one-out-of-three":"三选一", "useful-expressions":"实用表达", "practice-of-expressing":"表达练习", "describing-picture-game":"情境造句游戏" },
  ja:{ "true-or-false":"真実か嘘か", "30-second-speaking":"30秒スピーキング", "20-questions":"20の質問", "what-if-challenge":"もしもチャレンジ", "funny-questions":"面白い質問", "ice-breaking-3":"アイスブレイク質問", "fun-discuss":"楽しいディスカッション", "guessing-words":"単語当て", "word-battle":"単語バトル", "balance-game":"二択ゲーム", "balance-game-2":"二択ゲーム 2", "words-game":"5秒アルファベットチャレンジ", "debate-pros-cons":"賛否討論", "choose-one-out-of-three":"三つから一つ", "useful-expressions":"便利な表現", "practice-of-expressing":"表現練習", "describing-picture-game":"シチュエーション英文作り" },
};

export function localizeActivity(activity:Activity, language:SupportedLanguage) {
  const translated = activity.translations?.[language] || activity.translations?.en;
  const korean = language === "ko" ? ko[activity.id] : undefined;
  const languageTitle = titles[language]?.[activity.id];
  return {
    title:translated?.title || korean?.title || languageTitle || activity.title || activity.id,
    description:translated?.description || korean?.description || activity.description,
    shortTitle:translated?.shortTitle || shortTitles[language]?.[activity.id] || activity.shortTitle || korean?.title || languageTitle || activity.title || activity.id,
    instructions:translated?.instructions || korean?.instructions || activity.instructions,
  };
}
