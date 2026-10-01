import type { SupportedLanguage } from "@/types/language";
import type { ContentCategory,ContentLevel,ConversationContent } from "@/types/conversation-content";
import type { DailyMission,MissionCategory } from "@/data/missions";

export type LearningContentText=Record<SupportedLanguage,string>;
type QuestionSeed={id:string;category:ContentCategory;level:ContentLevel;prompt:LearningContentText;followUps:Record<SupportedLanguage,[string,string]>};

const q=(id:string,category:ContentCategory,level:ContentLevel,en:string,ja:string,zh:string,ko:string,enFollow:[string,string],jaFollow:[string,string],zhFollow:[string,string],koFollow:[string,string]):QuestionSeed=>({id,category,level,prompt:{en,ja,zh,ko},followUps:{en:enFollow,ja:jaFollow,zh:zhFollow,ko:koFollow}});
const simpleFollow={
 en:["Why?","Can you give an example?"],ja:["どうしてですか。","具体的な例を教えてください。"],zh:["为什么？","可以举个例子吗？"],ko:["왜 그런가요?","구체적인 예를 들어주세요."]
} as const;
const make=(id:string,category:ContentCategory,level:ContentLevel,text:[string,string,string,string],follow=simpleFollow)=>q(id,category,level,text[0],text[1],text[2],text[3],[...follow.en],[...follow.ja],[...follow.zh],[...follow.ko]);

export const learningConversationPrompts:QuestionSeed[]=[
 make("weekend-routine","일상대화","beginner",["What do you usually do on weekends?","週末は普段何をしますか？","你周末一般做什么？","주말에는 보통 뭐 해요?"]),
 make("morning-first","일상대화","beginner",["What is the first thing you do after waking up?","起きて最初に何をしますか？","你起床后第一件事做什么？","일어나서 가장 먼저 무엇을 해요?"]),
 make("recent-good-news","일상대화","beginner",["What is some good news you heard recently?","最近聞いたうれしいニュースは何ですか？","你最近听到什么好消息？","최근에 들은 좋은 소식은 무엇인가요?"]),
 make("favorite-food","문화","beginner",["What food could you eat every week?","毎週食べても飽きない料理は何ですか？","什么食物每周吃也不会腻？","매주 먹어도 질리지 않을 음식은 무엇인가요?"]),
 make("local-food","문화","intermediate",["What local food would you recommend to a visitor?","旅行者におすすめしたい地元の料理は何ですか？","你会向游客推荐什么当地美食？","여행자에게 추천하고 싶은 지역 음식은 무엇인가요?"]),
 make("culture-surprise","문화","intermediate",["What cultural difference surprised you?","驚いた文化の違いは何ですか？","什么文化差异让你感到意外？","놀랐던 문화 차이는 무엇인가요?"]),
 make("next-trip","여행","beginner",["Where would you like to travel next?","次はどこへ旅行したいですか？","你下次想去哪里旅行？","다음에는 어디로 여행하고 싶어요?"]),
 make("travel-problem","여행","intermediate",["What travel problem have you handled successfully?","旅行中のトラブルをうまく解決した経験はありますか？","你成功解决过什么旅行问题？","여행 중 문제를 잘 해결했던 경험이 있나요?"]),
 make("live-abroad","여행","advanced",["Which country would you live in for one year, and why?","一年住むならどの国を選びますか？理由も教えてください。","如果住一年，你会选择哪个国家？为什么？","1년 동안 산다면 어느 나라를 선택하고 싶나요? 왜인가요?"]),
 make("ideal-job","직장","beginner",["What would your ideal workday look like?","理想の一日はどんな働き方ですか？","你理想中的工作日是什么样的？","이상적인 하루 업무는 어떤 모습인가요?"]),
 make("work-skill","직장","intermediate",["What skill would help you most at work?","仕事で一番役立つスキルは何ですか？","什么技能对你的工作最有帮助？","직장에서 가장 도움이 될 기술은 무엇인가요?"]),
 make("remote-office","직장","intermediate",["Do you prefer working remotely or in an office?","在宅勤務とオフィス勤務、どちらが好きですか？","你更喜欢远程办公还是在办公室工作？","재택근무와 사무실 근무 중 무엇을 선호하나요?"]),
 make("new-friend","아이스브레이킹","beginner",["What is the easiest way to start a conversation with you?","あなたと会話を始める一番簡単な方法は何ですか？","怎样最容易和你开启对话？","당신과 대화를 시작하기 가장 쉬운 방법은 무엇인가요?"]),
 make("friend-quality","깊은 대화","intermediate",["What quality do you value most in a friend?","友達に一番求めるものは何ですか？","你最看重朋友的什么品质？","친구에게서 가장 중요하게 보는 성격은 무엇인가요?"]),
 make("first-impression","연애","intermediate",["What creates a good first impression?","良い第一印象を作るものは何ですか？","什么会给人留下好的第一印象？","좋은 첫인상을 만드는 것은 무엇인가요?"]),
 make("phone-app","일상대화","beginner",["Which phone app do you use most often?","一番よく使うスマホアプリは何ですか？","你最常用哪个手机应用？","가장 자주 사용하는 휴대폰 앱은 무엇인가요?"]),
 make("screen-time","토론","intermediate",["How much screen time feels healthy to you?","健康的なスクリーンタイムはどのくらいだと思いますか？","你觉得每天多长的屏幕时间比较健康？","하루에 어느 정도의 화면 사용 시간이 적당하다고 생각하나요?"]),
 make("ai-use","토론","advanced",["How has AI changed the way you study or work?","AIで勉強や仕事の仕方はどう変わりましたか？","人工智能如何改变了你的学习或工作方式？","AI가 공부나 업무 방식을 어떻게 바꿨나요?"]),
 make("language-reason","일상대화","beginner",["Why are you learning this language?","なぜこの言語を勉強していますか？","你为什么学习这门语言？","왜 이 언어를 배우고 있나요?"]),
 make("language-challenge","깊은 대화","intermediate",["Which part of language learning is hardest for you?","語学学習で一番難しいことは何ですか？","语言学习中哪一部分对你最难？","언어 학습에서 가장 어려운 부분은 무엇인가요?"]),
 make("study-method","일상대화","intermediate",["What study method actually works for you?","自分に本当に合う勉強法は何ですか？","什么学习方法对你真正有效？","실제로 효과가 있는 공부 방법은 무엇인가요?"]),
 make("funny-mistake","재미있는 질문","beginner",["What small mistake makes you laugh now?","今では笑える小さな失敗は何ですか？","现在想起来会笑的小失误是什么？","지금 생각하면 웃음이 나는 작은 실수는 무엇인가요?"]),
 make("unexpected-talent","재미있는 질문","beginner",["What unexpected talent do you have?","意外な特技はありますか？","你有什么让人意外的特长？","의외의 특기가 있나요?"]),
 make("future-goal","깊은 대화","advanced",["What is one goal you want to reach in the next three years?","3年以内に達成したい目標は何ですか？","未来三年内你想实现什么目标？","앞으로 3년 안에 이루고 싶은 목표는 무엇인가요?"])
];

const activityIds=["true-or-false","ice-breaking-3","20-questions","what-if-challenge","fun-discuss","describing-picture-game","useful-expressions"];
const support:Record<SupportedLanguage,{title:string;tip:string;expressions:[string,string]}>= {
 en:{title:"Conversation question",tip:"Answer in two or three sentences, then ask the same question back.",expressions:["In my experience, ...","The main reason is ..."]},
 ja:{title:"会話の質問",tip:"2〜3文で答えてから、相手にも同じ質問をしてみましょう。",expressions:["私の場合は…","一番の理由は…"]},
 zh:{title:"会话问题",tip:"用两三句话回答，然后把同样的问题问给对方。",expressions:["以我的经验来看……","最主要的原因是……"]},
 ko:{title:"대화 질문",tip:"두세 문장으로 답한 뒤 상대에게 같은 질문을 해보세요.",expressions:["제 경험으로는…","가장 큰 이유는…"]}
};

export const multilingualConversationContent:ConversationContent[]=learningConversationPrompts.flatMap(item=>(["en","ja","zh","ko"] as SupportedLanguage[]).map(language=>({
 id:`learning-${language}-${item.id}`,activityIds,type:"question" as const,title:support[language].title,category:item.category,level:item.level,language,groupSizes:["1:1","3~5명","그룹"],moods:["가볍게","친해지기"],prompt:item.prompt[language],followUpQuestions:item.followUps[language],usefulExpressions:support[language].expressions.map(expression=>({expression})),tips:[support[language].tip],tags:[item.category,item.level,"multilingual"]
})));

export const learningContentCounts=Object.fromEntries((["en","ja","zh","ko"] as SupportedLanguage[]).map(language=>[language,multilingualConversationContent.filter(item=>item.language===language).length]));

export function learningPromptFor(key:string){
 const index=[...key].reduce((total,character)=>total+character.charCodeAt(0),0)%learningConversationPrompts.length;
 return learningConversationPrompts[index];
}

type LocalizedBalance={left:LearningContentText;right:LearningContentText;followUps:Record<SupportedLanguage,[string,string]>};
const balance=(left:[string,string,string,string],right:[string,string,string,string]):LocalizedBalance=>({left:{en:left[0],ja:left[1],zh:left[2],ko:left[3]},right:{en:right[0],ja:right[1],zh:right[2],ko:right[3]},followUps:{en:["Why did you choose that option?","When would you choose the other one?"],ja:["なぜそちらを選びましたか？","どんな時ならもう一方を選びますか？"],zh:["你为什么选择这个选项？","什么情况下你会选择另一个？"],ko:["왜 이 선택지를 골랐나요?","어떤 상황이라면 다른 선택을 할까요?"]}});
export const localizedBalanceChoices:LocalizedBalance[]=[
 balance(["Coffee","コーヒー","咖啡","커피"],["Tea","紅茶","茶","차"]),
 balance(["City trip","都会への旅行","城市旅行","도시 여행"],["Nature trip","自然への旅行","自然旅行","자연 여행"]),
 balance(["Morning person","朝型","早起型","아침형"],["Night person","夜型","夜猫子","저녁형"]),
 balance(["Work from home","在宅勤務","居家办公","재택근무"],["Work in an office","オフィス勤務","办公室办公","사무실 근무"]),
 balance(["Plan everything","すべて計画する","提前计划一切","모두 계획하기"],["Be spontaneous","その場で決める","随性决定","즉흥적으로 하기"]),
 balance(["Live by the ocean","海の近くに住む","住在海边","바닷가에 살기"],["Live in the mountains","山の近くに住む","住在山里","산에 살기"]),
 balance(["Read the book","原作を読む","读原著","원작 읽기"],["Watch the movie","映画を見る","看电影","영화 보기"]),
 balance(["Call a friend","友達に電話する","给朋友打电话","친구에게 전화하기"],["Send a message","メッセージを送る","发消息","메시지 보내기"]),
 balance(["Travel alone","一人旅","独自旅行","혼자 여행하기"],["Travel with friends","友達と旅行","和朋友旅行","친구와 여행하기"],),
 balance(["A stable job","安定した仕事","稳定的工作","안정적인 직업"],["A challenging job","挑戦できる仕事","有挑战的工作","도전적인 직업"]),
 balance(["Save money","貯金する","存钱","돈 모으기"],["Spend on experiences","経験にお金を使う","为体验花钱","경험에 돈 쓰기"]),
 balance(["Speak every language","すべての言語を話す","会说所有语言","모든 언어 말하기"],["Play every instrument","すべての楽器を演奏する","会演奏所有乐器","모든 악기 연주하기"])
];

export const localizedActivityCopy={
 en:{all:"All",allLevels:"All Levels",favorites:"Favorites",followUps:"Follow-up questions",previous:"Previous",next:"Next",shuffle:"Shuffle",shuffling:"Finding a great question...",empty:"No questions match these filters.",reset:"Reset filters"},
 ja:{all:"すべて",allLevels:"すべてのレベル",favorites:"お気に入り",followUps:"追加質問",previous:"前へ",next:"次へ",shuffle:"シャッフル",shuffling:"質問を選んでいます…",empty:"条件に合う質問がありません。",reset:"フィルターをリセット"},
 zh:{all:"全部",allLevels:"所有级别",favorites:"收藏",followUps:"追加问题",previous:"上一个",next:"下一个",shuffle:"随机抽取",shuffling:"正在选择问题…",empty:"没有符合条件的问题。",reset:"重置筛选"},
 ko:{all:"전체",allLevels:"모든 레벨",favorites:"즐겨찾기",followUps:"추가 질문",previous:"이전",next:"다음",shuffle:"랜덤 뽑기",shuffling:"질문을 고르는 중…",empty:"조건에 맞는 질문이 없습니다.",reset:"필터 초기화"}
} as const;

const missionText:Record<Exclude<SupportedLanguage,"en"|"ko">,Partial<Record<MissionCategory,[string,string,string]>>>={
 ja:{speaking:["30秒間止まらずに話す","一つの意見と二つの理由を話す","質問に3文以上で答える"],listening:["相手の要点を一文でまとめる","答えに合わせて追加質問を二つする","聞き取れない文を丁寧に聞き返す"],expression:["今日の表現を会話で一度使う","新しい表現で自分の文を作る","相手が使った自然な表現をメモする"],social:["初対面の二人に質問する","共通の興味を一つ見つける","新しい人に3文で自己紹介する"],confidence:["間違えても文を最後まで言う","知らない単語を別の言葉で説明する","いつもより先に会話を始める"],culture:["相手の国の食文化について質問する","自分の国の祝日を一つ紹介する","異なる挨拶の仕方を比べる"]},
 zh:{speaking:["连续说30秒不中断","表达一个观点并给出两个理由","用至少三句话回答一个问题"],listening:["用一句话总结对方的重点","根据对方的回答追问两个问题","礼貌地请对方重复没听清的句子"],expression:["在对话中使用一次今日表达","用新表达造一个自己的句子","记下对方使用的一个自然表达"],social:["向两位初次见面的人提问","找到一个共同兴趣","用三句话向新朋友介绍自己"],confidence:["即使说错也把句子说完","用其他说法解释不会的词","比平时更主动地开始对话"],culture:["询问对方国家的饮食文化","介绍自己国家的一个特别节日","比较不同的问候方式"]}
};
export function localizedMissionPool(items:DailyMission[],language:SupportedLanguage){if(language==="en")return items.map(item=>({...item,textKo:item.textEn}));if(language==="ko")return items;const counters=new Map<MissionCategory,number>();return items.slice(0,60).map(item=>{const index=counters.get(item.category)||0;counters.set(item.category,index+1);const values=missionText[language][item.category]||missionText[language].speaking!;const text=values[index%3];return{...item,id:`${language}-${item.id}`,title:text,description:text,textKo:text,textEn:text}})}
