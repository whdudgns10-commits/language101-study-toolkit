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
  "balance-game":{ title:"밸런스 게임", description:"A와 B 중 하나를 선택하고 이유를 설명하며 함께 대화해보세요." },
  "words-game":{ title:"5초 알파벳 게임", description:"랜덤 알파벳이 나오면 5초 안에 그 글자로 시작하는 영어 단어를 말하세요." },
  "debate-pros-cons":{ title:"찬반 토론", description:"한 주제의 찬성과 반대 입장을 근거와 함께 토론하세요." },
  "choose-one-out-of-three":{ title:"세 가지 중 하나", description:"세 선택지 중 하나를 고르고 판단 기준을 설명하세요." },
  "useful-expressions":{ title:"유용한 표현", description:"실제 대화에서 자주 쓰는 표현을 익히고 연습하세요." },
  "describing-picture-game":{ title:"상황 문장 만들기", description:"주어진 단어를 연결해 영어 문장과 이야기를 만들어 보세요." },
};

const shortTitles:Record<SupportedLanguage, Record<string,string>> = {
  en:{},
  ko:{ "true-or-false":"진실/거짓", "30-second-speaking":"30초 말하기", "20-questions":"스무고개", "what-if-challenge":"만약에", "funny-questions":"재미 질문", "ice-breaking-3":"아이스브레이크", "fun-discuss":"재미 토론", "guessing-words":"단어 맞히기", "word-battle":"단어 배틀", "balance-game":"밸런스 게임", "words-game":"알파벳 게임", "debate-pros-cons":"찬반 토론", "choose-one-out-of-three":"하나 고르기", "useful-expressions":"유용한 표현", "describing-picture-game":"상황 문장" },
  zh:{ "true-or-false":"真假游戏", "30-second-speaking":"30秒表达", "20-questions":"20个问题", "what-if-challenge":"如果挑战", "funny-questions":"趣味问题", "ice-breaking-3":"破冰问题", "fun-discuss":"趣味讨论", "guessing-words":"猜单词", "word-battle":"单词对战", "balance-game":"二选一游戏", "words-game":"字母挑战", "debate-pros-cons":"正反辩论", "choose-one-out-of-three":"三选一", "useful-expressions":"实用表达", "describing-picture-game":"情境造句" },
  ja:{ "true-or-false":"真実か嘘", "30-second-speaking":"30秒トーク", "20-questions":"20の質問", "what-if-challenge":"もしも", "funny-questions":"面白い質問", "ice-breaking-3":"アイスブレイク", "fun-discuss":"楽しい討論", "guessing-words":"単語当て", "word-battle":"単語バトル", "balance-game":"二択ゲーム", "words-game":"文字チャレンジ", "debate-pros-cons":"賛否討論", "choose-one-out-of-three":"三択", "useful-expressions":"便利な表現", "describing-picture-game":"英文作り" },
};

const titles:Partial<Record<SupportedLanguage, Record<string,string>>> = {
  zh:{ "true-or-false":"真假游戏", "30-second-speaking":"30秒英语表达", "20-questions":"20个问题", "what-if-challenge":"如果挑战", "funny-questions":"趣味问题", "ice-breaking-3":"破冰问题", "fun-discuss":"趣味讨论", "guessing-words":"猜单词", "word-battle":"单词对战", "balance-game":"二选一游戏", "words-game":"5秒字母挑战", "debate-pros-cons":"正反方辩论", "choose-one-out-of-three":"三选一", "useful-expressions":"实用表达", "describing-picture-game":"情境造句游戏" },
  ja:{ "true-or-false":"真実か嘘か", "30-second-speaking":"30秒スピーキング", "20-questions":"20の質問", "what-if-challenge":"もしもチャレンジ", "funny-questions":"面白い質問", "ice-breaking-3":"アイスブレイク質問", "fun-discuss":"楽しいディスカッション", "guessing-words":"単語当て", "word-battle":"単語バトル", "balance-game":"二択ゲーム", "words-game":"5秒アルファベットチャレンジ", "debate-pros-cons":"賛否討論", "choose-one-out-of-three":"三つから一つ", "useful-expressions":"便利な表現", "describing-picture-game":"シチュエーション英文作り" },
};

const descriptions:Partial<Record<SupportedLanguage,Record<string,string>>>= {
  ja:{
    "true-or-false":"本当の話と作り話を聞き分け、理由を質問して当てましょう。","30-second-speaking":"ランダムなテーマについて30秒間止まらずに話しましょう。","20-questions":"20個までの質問で人物・物・場所を当てましょう。","what-if-challenge":"もしもの状況を想像して、自分の考えを話しましょう。","funny-questions":"意外で面白い質問から自然な会話を始めましょう。","ice-breaking-3":"初対面でも話しやすい質問で自然に仲良くなりましょう。","fun-discuss":"軽くて興味深いテーマについてグループで話しましょう。","guessing-words":"答えの単語を言わずに説明し、仲間に当ててもらいましょう。","word-battle":"語彙力・スピード・説明力を使うチーム対戦ゲームです。","balance-game":"二つの選択肢から一つを選び、理由を説明しましょう。","words-game":"ランダムな文字から始まる単語を5秒以内に答えましょう。","debate-pros-cons":"一つのテーマについて賛成・反対の根拠を話し合いましょう。","choose-one-out-of-three":"三つの選択肢から一つを選び、その理由を説明しましょう。","useful-expressions":"実際の会話でよく使う自然な表現を覚えて練習しましょう。","describing-picture-game":"提示された単語をつなげて文やストーリーを作りましょう。","rank-it":"五つの項目を順位付けし、選んだ理由を比べましょう。","time-challenge":"制限時間が終わる前に質問へ答えましょう。","3-things-5-seconds":"テーマに合う三つの答えを制限時間内に言いましょう。","spyfall":"質問と推理で秘密の答えを知らないスパイを見つけましょう。","secret-mission":"会話の中で気づかれないように秘密のミッションを達成しましょう。","never-have-i-ever":"実際の経験を共有しながら最後の生存者を目指しましょう。","topic-practice":"質問・単語・表現・ロールプレイで実践会話を練習しましょう。"
  },
  zh:{
    "true-or-false":"分辨真实与虚假陈述，通过提问猜出答案。","30-second-speaking":"围绕随机主题连续说30秒。","20-questions":"最多提出20个问题，猜出人物、物品或地点。","what-if-challenge":"想象有趣的假设情境并分享你的看法。","funny-questions":"用意想不到的有趣问题自然开启对话。","ice-breaking-3":"通过轻松自然的问题认识新朋友。","fun-discuss":"围绕轻松有趣的话题进行小组讨论。","guessing-words":"不说出答案词，用目标语言描述并让队友猜。","word-battle":"用词汇、速度和描述能力进行团队对战。","balance-game":"从两个选项中选择一个并说明理由。","words-game":"在5秒内说出以随机字母开头的单词。","debate-pros-cons":"围绕一个主题提出正反方观点和理由。","choose-one-out-of-three":"从三个选项中选择一个并说明判断理由。","useful-expressions":"学习并练习真实对话中常用的自然表达。","describing-picture-game":"连接给出的词语，创作句子或故事。","rank-it":"给五个选项排序，说明理由并比较结果。","time-challenge":"在倒计时结束前回答问题。","3-things-5-seconds":"在限定时间内说出三个符合主题的答案。","spyfall":"通过提问和推理找出不知道秘密答案的卧底。","secret-mission":"在对话中不被发现地完成秘密任务。","never-have-i-ever":"分享真实经历，挑战成为最后的幸存者。","topic-practice":"通过问题、词汇、表达和角色扮演练习真实对话。"
  }
};

const fallbackInstructions:Record<Exclude<SupportedLanguage,"en">,string[]>={
  ko:["참가자와 난이도를 선택합니다.","화면에 나온 질문이나 주제를 확인합니다.","선택한 학습 언어로 답하고 서로 추가 질문을 합니다.","다음 항목으로 넘어가며 모든 참가자가 말합니다."],
  ja:["参加者と難易度を選びます。","画面に表示された質問やトピックを確認します。","選択した学習言語で答え、お互いに追加質問をします。","次の項目へ進み、参加者全員が話します。"],
  zh:["选择参与者和难度。","查看屏幕上的问题或主题。","使用所选学习语言回答，并互相追问。","继续下一项，让每位参与者都开口练习。"]
};

export function localizeActivity(activity:Activity, language:SupportedLanguage) {
  const translated = activity.translations?.[language] || activity.translations?.en;
  const korean = language === "ko" ? ko[activity.id] : undefined;
  const languageTitle = titles[language]?.[activity.id];
  return {
    title:translated?.title || korean?.title || languageTitle || activity.title || activity.id,
    description:translated?.description || korean?.description || descriptions[language]?.[activity.id] || activity.description,
    shortTitle:translated?.shortTitle || shortTitles[language]?.[activity.id] || activity.shortTitle || korean?.title || languageTitle || activity.title || activity.id,
    instructions:translated?.instructions || korean?.instructions || (language==="en"?activity.instructions:fallbackInstructions[language]),
  };
}
