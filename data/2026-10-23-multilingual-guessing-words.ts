import type { SupportedLanguage } from "@/types/language";

export type MultilingualGuessingWord={
 id:string;
 level:"beginner"|"intermediate"|"upper-intermediate"|"advanced";
 term:Record<SupportedLanguage,string>;
 meaning:Record<SupportedLanguage,string>;
};

const word=(id:string,level:MultilingualGuessingWord["level"],en:string,ja:string,zh:string,ko:string,enMeaning:string,koMeaning:string):MultilingualGuessingWord=>({
 id,level,term:{en,ja,zh,ko},meaning:{en:enMeaning,ja:koMeaning,zh:koMeaning,ko:enMeaning}
});

// High-frequency concepts that work naturally in small-group speaking games.
// Add one row to extend every language at the same time without changing UI code.
export const multilingualGuessingWords:MultilingualGuessingWord[]=[
 word("multi-001","beginner","friend","友達","朋友","친구","a person you know and like","알고 지내며 좋아하는 사람"),
 word("multi-002","beginner","family","家族","家人","가족","people related to you","혈연이나 관계로 맺어진 사람들"),
 word("multi-003","beginner","hobby","趣味","爱好","취미","an activity you enjoy in your free time","여가 시간에 즐기는 활동"),
 word("multi-004","beginner","travel","旅行","旅行","여행","going to another place for pleasure or work","다른 지역이나 나라로 떠나는 일"),
 word("multi-005","beginner","restaurant","レストラン","餐厅","식당","a place where meals are served","음식을 주문해 먹는 장소"),
 word("multi-006","beginner","weekend","週末","周末","주말","Saturday and Sunday","토요일과 일요일"),
 word("multi-007","beginner","weather","天気","天气","날씨","the condition of the air outside","비나 온도 같은 대기의 상태"),
 word("multi-008","beginner","exercise","運動","运动","운동","physical activity that keeps you healthy","건강을 위한 신체 활동"),
 word("multi-009","beginner","movie","映画","电影","영화","a story shown on a screen","화면으로 보는 이야기 작품"),
 word("multi-010","beginner","promise","約束","约定","약속","something you agree to do","하기로 정한 일"),
 word("multi-011","intermediate","experience","経験","经历","경험","knowledge gained by doing something","직접 겪으며 얻은 지식"),
 word("multi-012","intermediate","opportunity","機会","机会","기회","a good chance to do something","무언가를 할 수 있는 좋은 때"),
 word("multi-013","intermediate","confidence","自信","自信","자신감","belief in your own ability","자신의 능력을 믿는 마음"),
 word("multi-014","intermediate","culture","文化","文化","문화","the customs and ideas of a group","한 사회의 생활 방식과 생각"),
 word("multi-015","intermediate","decision","決断","决定","결정","a choice made after thinking","생각한 뒤 내린 선택"),
 word("multi-016","intermediate","challenge","挑戦","挑战","도전","something difficult that tests you","능력을 시험하는 어려운 일"),
 word("multi-017","intermediate","relationship","人間関係","关系","관계","the connection between people","사람과 사람 사이의 연결"),
 word("multi-018","intermediate","recommendation","おすすめ","推荐","추천","advice about a good choice","좋은 선택을 권하는 말"),
 word("multi-019","intermediate","communication","コミュニケーション","沟通","소통","sharing information and feelings","정보와 감정을 주고받는 일"),
 word("multi-020","intermediate","habit","習慣","习惯","습관","something you do regularly","반복해서 하는 행동"),
 word("multi-021","upper-intermediate","perspective","視点","观点","관점","a particular way of seeing an issue","문제를 바라보는 방식"),
 word("multi-022","upper-intermediate","responsibility","責任","责任","책임","a duty you are expected to handle","맡아서 해야 하는 의무"),
 word("multi-023","upper-intermediate","achievement","達成","成就","성취","something important completed successfully","노력하여 이룬 결과"),
 word("multi-024","upper-intermediate","adaptability","適応力","适应能力","적응력","the ability to adjust to change","변화에 맞추는 능력"),
 word("multi-025","upper-intermediate","negotiation","交渉","谈判","협상","discussion aimed at reaching agreement","합의를 위한 대화"),
 word("multi-026","upper-intermediate","expectation","期待","期待","기대","a belief about what will happen","앞으로 일어날 일에 대한 예상"),
 word("multi-027","upper-intermediate","priority","優先事項","优先事项","우선순위","something more important than other things","먼저 처리해야 할 중요한 것"),
 word("multi-028","upper-intermediate","consequence","結果","后果","결과","what happens because of an action","행동으로 인해 생기는 일"),
 word("multi-029","upper-intermediate","collaboration","協力","协作","협업","working together toward a goal","목표를 위해 함께 일하는 것"),
 word("multi-030","upper-intermediate","impression","印象","印象","인상","an idea or feeling formed about someone","누군가에게서 받은 느낌"),
 word("multi-031","advanced","sustainability","持続可能性","可持续性","지속 가능성","the ability to continue without exhausting resources","자원을 고갈시키지 않고 지속하는 성질"),
 word("multi-032","advanced","accountability","説明責任","问责","책무성","being responsible for decisions and results","결정과 결과에 책임지는 태도"),
 word("multi-033","advanced","misconception","誤解","误解","오해","an idea that is incorrect","사실과 다르게 이해한 생각"),
 word("multi-034","advanced","compromise","妥協","妥协","타협","an agreement where each side gives up something","서로 양보해 이루는 합의"),
 word("multi-035","advanced","inequality","不平等","不平等","불평등","an unfair difference in opportunity or treatment","기회나 대우의 공정하지 않은 차이"),
 word("multi-036","advanced","innovation","革新","创新","혁신","a new idea or method","새로운 생각이나 방법"),
 word("multi-037","advanced","credibility","信頼性","可信度","신뢰성","the quality of being believable","믿을 수 있는 정도"),
 word("multi-038","advanced","assumption","思い込み","假设","가정","something accepted as true without proof","증거 없이 사실이라 여기는 생각"),
 word("multi-039","advanced","resilience","回復力","韧性","회복력","the ability to recover from difficulty","어려움에서 다시 일어나는 힘"),
 word("multi-040","advanced","controversy","論争","争议","논란","strong public disagreement","의견이 크게 맞서는 상황")
];

export function multilingualSpeakingQuestions(item:MultilingualGuessingWord,language:SupportedLanguage){
 const term=item.term[language];
 if(language==="ja")return [`「${term}」を自分の言葉で説明できますか？`,`「${term}」に関する経験を教えてください。`,`日常生活で「${term}」が大切なのはなぜですか？`];
 if(language==="zh")return [`你能用自己的话解释“${term}”吗？`,`请分享一次与“${term}”有关的经历。`,`为什么“${term}”在日常生活中很重要？`];
 if(language==="ko")return [`‘${term}’을 자신의 말로 설명해 보세요.`,`‘${term}’과 관련된 경험이 있나요?`,`일상에서 ‘${term}’이 중요한 이유는 무엇인가요?`];
 return [`How would you explain “${term}” in your own words?`,`What experience have you had with “${term}”?`,`Why is “${term}” important in everyday life?`];
}
