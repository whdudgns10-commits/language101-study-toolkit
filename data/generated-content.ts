import type { Expression,ExpressionCategory,ExpressionLevel } from "@/types/expression";

const topics=[
 ["plans for Saturday","주말 계획"],["regional dishes","현지 음식"],["memorable cinema","좋아하는 영화"],["morning routines","아침 습관"],["travel memories","여행 추억"],["language practice","언어 학습"],["work-life balance","일과 삶의 균형"],["music tastes","음악 취향"],
 ["neighborhood cafés","동네 카페"],["healthy habits","건강한 습관"],["future goals","미래 목표"],["cultural differences","문화 차이"],["teamwork","팀워크"],["public transport","대중교통"],["online learning","온라인 학습"],["seasonal weather","계절 날씨"],
 ["childhood games","어린 시절 놀이"],["career choices","진로 선택"],["favorite books","좋아하는 책"],["home cooking","집밥 요리"],["weekend markets","주말 시장"],["daily exercise","일상 운동"],["social media","소셜 미디어"],["city life","도시 생활"],
 ["quiet hobbies","조용한 취미"],["local traditions","지역 전통"],["meeting new people","새로운 사람 만나기"],["saving money","저축"],["creative projects","창작 프로젝트"],["remote work","원격 근무"],["family celebrations","가족 행사"],["personal growth","개인적인 성장"]
] as const;

type Frame={say:(topic:string)=>string;ko:(topic:string)=>string;category:ExpressionCategory;tip:string};
const frames:Record<ExpressionLevel,Frame[]>={
 beginner:[
  {say:t=>`I like talking about ${t}.`,ko:t=>`${t}에 관해 이야기하는 것을 좋아해요.`,category:"small-talk",tip:"관심 있는 주제를 간단히 소개할 때 사용해요."},
  {say:t=>`What do you think about ${t}?`,ko:t=>`${t}에 대해 어떻게 생각하세요?`,category:"question",tip:"상대의 의견을 자연스럽게 물을 때 좋아요."},
  {say:t=>`I want to learn more about ${t}.`,ko:t=>`${t}에 대해 더 알고 싶어요.`,category:"study",tip:"호기심과 학습 의지를 표현할 때 사용해요."},
  {say:t=>`I'm interested in ${t}.`,ko:t=>`${t}에 관심이 있어요.`,category:"small-talk",tip:"공통 관심사를 찾으며 대화를 시작할 때 써요."},
  {say:t=>`Can you tell me about ${t}?`,ko:t=>`${t}에 관해 이야기해 줄래요?`,category:"question",tip:"상대에게 편하게 설명을 요청할 때 사용해요."},
  {say:t=>`I have a question about ${t}.`,ko:t=>`${t}에 관해 질문이 있어요.`,category:"clarification",tip:"질문을 꺼내기 전에 주제를 분명히 할 때 좋아요."},
  {say:t=>`Let's talk about ${t}.`,ko:t=>`${t}에 관해 이야기해 봐요.`,category:"invitation",tip:"새로운 대화 주제를 제안할 때 사용해요."},
  {say:t=>`I know a little about ${t}.`,ko:t=>`${t}에 관해 조금 알아요.`,category:"daily-life",tip:"완벽히 알지는 않지만 대화에 참여하고 싶을 때 써요."},
  {say:t=>`My experience with ${t} was good.`,ko:t=>`${t}에 대한 제 경험은 좋았어요.`,category:"reaction",tip:"개인적인 경험을 짧게 평가할 때 사용해요."},
  {say:t=>`I'd like your advice about ${t}.`,ko:t=>`${t}에 관한 조언을 듣고 싶어요.`,category:"suggestion",tip:"상대의 경험을 존중하며 조언을 구할 때 좋아요."},
 ],
 intermediate:[
  {say:t=>`I'm curious to hear your take on ${t}.`,ko:t=>`${t}에 대한 당신의 생각이 궁금해요.`,category:"opinion",tip:"상대의 관점을 자연스럽게 끌어낼 때 사용해요."},
  {say:t=>`I can see both sides when it comes to ${t}.`,ko:t=>`${t}에 관해서는 양쪽 입장이 모두 이해돼요.`,category:"agreement",tip:"균형 잡힌 의견을 말하며 토론을 시작할 때 좋아요."},
  {say:t=>`My view on ${t} has changed over time.`,ko:t=>`${t}에 대한 제 생각은 시간이 지나며 바뀌었어요.`,category:"opinion",tip:"생각이 변한 경험과 이유를 이어 말할 때 써요."},
  {say:t=>`There's a lot to consider with ${t}.`,ko:t=>`${t}에는 고려할 점이 많아요.`,category:"reaction",tip:"주제가 단순하지 않음을 인정할 때 사용해요."},
  {say:t=>`What shaped your opinion on ${t}?`,ko:t=>`${t}에 대한 생각에 무엇이 영향을 주었나요?`,category:"question",tip:"의견의 배경을 묻는 깊이 있는 후속 질문이에요."},
  {say:t=>`I have mixed feelings about ${t}.`,ko:t=>`${t}에 대해 복잡한 감정이 들어요.`,category:"emotion",tip:"장단점이 모두 느껴지는 상황을 표현할 때 좋아요."},
  {say:t=>`One thing I appreciate about ${t} is the variety.`,ko:t=>`${t}에서 제가 좋게 보는 점 하나는 다양성이에요.`,category:"gratitude",tip:"구체적인 장점을 들어 긍정적인 의견을 말할 때 사용해요."},
  {say:t=>`I'd be interested in exploring ${t} further.`,ko:t=>`${t}을 더 깊이 알아보고 싶어요.`,category:"study",tip:"주제에 대한 지속적인 관심을 정중하게 표현해요."},
  {say:t=>`It depends on what you value about ${t}.`,ko:t=>`${t}에서 무엇을 중요하게 여기느냐에 따라 달라요.`,category:"opinion",tip:"조건에 따라 답이 달라진다고 설명할 때 써요."},
  {say:t=>`Could you walk me through your experience with ${t}?`,ko:t=>`${t}에 대한 경험을 차근차근 들려줄 수 있나요?`,category:"clarification",tip:"상대의 경험을 자세히 듣고 싶을 때 사용해요."},
 ],
 advanced:[
  {say:t=>`There's a compelling case to be made for ${t}.`,ko:t=>`${t}을 지지할 만한 설득력 있는 근거가 있어요.`,category:"opinion",tip:"토론에서 한 입장의 타당성을 정교하게 제시할 때 사용해요."},
  {say:t=>`I wouldn't underestimate the impact of ${t}.`,ko:t=>`${t}의 영향을 과소평가해서는 안 된다고 생각해요.`,category:"opinion",tip:"주제의 중요성을 강조하면서 신중한 판단을 권할 때 써요."},
  {say:t=>`The way we approach ${t} reveals our priorities.`,ko:t=>`${t}에 접근하는 방식은 우리의 우선순위를 보여줘요.`,category:"culture",tip:"행동과 가치관의 관계를 분석할 때 좋아요."},
  {say:t=>`It's worth questioning our assumptions about ${t}.`,ko:t=>`${t}에 관한 우리의 전제를 되짚어 볼 필요가 있어요.`,category:"question",tip:"당연하게 여긴 생각을 비판적으로 검토하자고 제안해요."},
  {say:t=>`The broader implications of ${t} are easy to overlook.`,ko:t=>`${t}의 더 넓은 영향을 놓치기 쉬워요.`,category:"opinion",tip:"논의를 개인 경험에서 사회적 맥락으로 넓힐 때 사용해요."},
  {say:t=>`I'm not convinced that we fully understand ${t}.`,ko:t=>`우리가 ${t}을 충분히 이해하고 있는지는 확신이 없어요.`,category:"disagreement",tip:"현재 설명이나 이해가 불충분하다고 정중히 지적해요."},
  {say:t=>`A nuanced discussion of ${t} needs more context.`,ko:t=>`${t}을 세밀하게 논의하려면 더 많은 맥락이 필요해요.`,category:"clarification",tip:"단순한 결론보다 배경 정보를 먼저 요청할 때 좋아요."},
  {say:t=>`What tends to get lost in debates about ${t} is personal experience.`,ko:t=>`${t}에 관한 토론에서 개인의 경험이 종종 빠져요.`,category:"conversation-management",tip:"논의에서 간과된 관점을 다시 중심에 놓을 때 사용해요."},
  {say:t=>`I'd hesitate to draw a firm conclusion about ${t}.`,ko:t=>`${t}에 대해 확정적인 결론을 내리기는 조심스러워요.`,category:"disagreement",tip:"근거가 부족할 때 판단을 유보하는 세련된 표현이에요."},
  {say:t=>`Our perspective on ${t} is shaped by more than personal preference.`,ko:t=>`${t}에 대한 관점은 개인 취향 이상의 요인에 영향을 받아요.`,category:"culture",tip:"문화와 환경의 영향을 포함해 복합적으로 분석할 때 써요."},
 ]
};

export const generatedExpressions:Expression[]=(['beginner','intermediate','advanced'] as ExpressionLevel[]).flatMap(level=>frames[level].flatMap((frame,frameIndex)=>topics.map(([topic,topicKo],topicIndex)=>{const expression=frame.say(topic);return {id:`expanded-${level}-${frameIndex+1}-${topicIndex+1}`,expression,koreanMeaning:frame.ko(topicKo),example:expression,exampleTranslation:frame.ko(topicKo),usageTip:frame.tip,similarExpressions:[],level,category:frame.category,formality:level==="advanced"?"formal":"neutral",frequency:level==="beginner"?"very-common":"useful",tags:["international","conversation"],recommendedForPractice:frameIndex<4,practicePriority:(frameIndex<2?1:frameIndex<6?2:3) as 1|2|3,practiceSituations:["small-talk",frame.category]};})));

export const missionCategoryNames=["speaking","listening","expression","social","confidence","culture","pronunciation","vocabulary","question","storytelling","networking","reflection"] as const;
export type ExpandedMissionCategory=(typeof missionCategoryNames)[number];
const contexts=["첫 대화에서","새로운 파트너와","그룹 활동 중","가벼운 주제로","익숙하지 않은 주제로","모임 전반부에","모임 후반부에","한 명과 차분히 대화하며","작은 그룹 안에서 돌아가며","5분 동안","1분 동안","질문에 답하며","의견을 나누며","경험을 설명하며","서로 다른 예절을 소재로","낯선 여행 관습을 소재로","취미 선택의 차이를 소재로","평범한 하루의 차이를 소재로","직장 분위기의 차이를 소재로","식사 방식의 차이를 소재로","새 표현을 배우며","대화를 마치기 전에","파트너를 바꾼 뒤","휴식 시간 뒤","오늘 마지막 대화에서","처음 고른 활동을 시작하며","예상 밖의 답변을 들은 뒤","공통 관심사를 발견한 순간","조용한 참가자를 초대하며","테이블 전체가 집중할 때","오늘 배운 내용을 정리하며"];
const missionFrames:Record<ExpandedMissionCategory,{title:(c:string)=>string;en:(c:string)=>string}>={
 speaking:{title:c=>`${c} 영어로 세 문장 이상 이어 말하기`,en:c=>`Speak at least three connected sentences ${c}.`}, listening:{title:c=>`${c} 상대의 핵심 내용을 한 문장으로 확인하기`,en:c=>`Confirm your partner's main point in one sentence ${c}.`}, expression:{title:c=>`${c} 새로 배운 표현을 자연스럽게 사용하기`,en:c=>`Use a newly learned expression naturally ${c}.`}, social:{title:c=>`${c} 먼저 인사하고 열린 질문 건네기`,en:c=>`Greet someone first and ask an open question ${c}.`}, confidence:{title:c=>`${c} 실수를 걱정하지 않고 문장 끝까지 말하기`,en:c=>`Finish each sentence without worrying about mistakes ${c}.`}, culture:{title:c=>`${c} 서로의 문화 차이 한 가지 비교하기`,en:c=>`Compare one cultural difference ${c}.`}, pronunciation:{title:c=>`${c} 핵심 문장의 강세와 리듬 확인하기`,en:c=>`Check the stress and rhythm of a key sentence ${c}.`}, vocabulary:{title:c=>`${c} 새로운 단어 두 개를 다른 문장에 사용하기`,en:c=>`Use two new words in different sentences ${c}.`}, question:{title:c=>`${c} 답변을 바탕으로 후속 질문 두 번 하기`,en:c=>`Ask two follow-up questions based on an answer ${c}.`}, storytelling:{title:c=>`${c} 시작·전개·결말이 있는 짧은 이야기 들려주기`,en:c=>`Tell a short story with a beginning, middle, and end ${c}.`}, networking:{title:c=>`${c} 상대의 이름과 관심사 하나 기억하기`,en:c=>`Remember your partner's name and one interest ${c}.`}, reflection:{title:c=>`${c} 잘한 점과 개선할 점을 하나씩 기록하기`,en:c=>`Record one success and one thing to improve ${c}.`}
};
export type ExpandedMission={id:string;title:string;description:string;category:ExpandedMissionCategory;level:"beginner"|"intermediate"|"advanced"|"all";estimatedMinutes:number;difficulty:"easy"|"medium"|"hard";tags:string[];textKo:string;textEn:string};
export const generatedMissions:ExpandedMission[]=missionCategoryNames.flatMap(category=>contexts.map((context,index)=>{const title=missionFrames[category].title(context);return {id:`expanded-${category}-${index+1}`,title,description:`${title}. 완료한 뒤 가장 기억에 남는 문장도 메모해 보세요.`,category,level:index%4===3?"all":(["beginner","intermediate","advanced"] as const)[index%3],estimatedMinutes:3+(index%5),difficulty:(["easy","medium","hard"] as const)[index%3],tags:[category,"meetup"],textKo:title,textEn:missionFrames[category].en(context)};}));
