import type { ExperienceDifficulty, ExperienceHint } from "@/types/2026-07-30-experience-survival";

type HintRow = [string, string, ExperienceDifficulty];

const groups: Record<string, HintRow[]> = {
  travel: [
    ["혼자 해외여행을 해본 경험","Traveling abroad alone","beginner"],["비행기나 기차를 놓쳐본 경험","Missing a flight or train","beginner"],["여행 중 길을 잃어본 경험","Getting lost while traveling","beginner"],["계획 없이 당일 여행을 떠난 경험","Taking a spontaneous day trip","intermediate"],["공항에서 밤을 보내본 경험","Spending a night at an airport","intermediate"],["낯선 사람의 도움으로 여행 문제를 해결한 경험","Solving a travel problem with a stranger’s help","intermediate"],["세 나라 이상을 한 여행에서 방문한 경험","Visiting three or more countries on one trip","advanced"],
  ],
  school: [
    ["학교에서 발표해본 경험","Giving a presentation at school","beginner"],["시험 날짜를 착각한 경험","Mixing up an exam date","beginner"],["동아리를 직접 만들어본 경험","Starting a school club","intermediate"],["학교 행사에서 공연한 경험","Performing at a school event","intermediate"],["교환학생으로 공부한 경험","Studying as an exchange student","advanced"],["좋아하지 않던 과목을 나중에 좋아하게 된 경험","Learning to enjoy a subject you once disliked","intermediate"],["밤새 과제를 끝낸 경험","Staying up all night to finish an assignment","beginner"],
  ],
  work: [
    ["첫 아르바이트를 해본 경험","Having a first part-time job","beginner"],["직장에서 실수하고 직접 해결한 경험","Fixing a mistake you made at work","intermediate"],["외국어로 면접을 본 경험","Having a job interview in another language","advanced"],["재택근무를 해본 경험","Working from home","beginner"],["완전히 새로운 업무를 하루 만에 배운 경험","Learning a completely new task in one day","intermediate"],["고객의 칭찬을 받은 경험","Receiving a compliment from a customer","beginner"],["여러 나라 사람들과 함께 일한 경험","Working with people from several countries","advanced"],
  ],
  food: [
    ["직접 빵이나 케이크를 만든 경험","Baking bread or a cake","beginner"],["처음 보는 음식을 주문한 경험","Ordering a food you had never seen","beginner"],["매운 음식 도전에 성공한 경험","Completing a spicy food challenge","intermediate"],["다른 나라 가정식을 먹어본 경험","Eating a home-cooked meal from another country","intermediate"],["직접 재배한 재료로 요리한 경험","Cooking with ingredients you grew","advanced"],["레시피 없이 요리한 경험","Cooking without a recipe","beginner"],["예상 밖의 음식 조합을 좋아하게 된 경험","Discovering an unusual food combination you enjoy","intermediate"],
  ],
  culture: [
    ["다른 나라의 명절을 함께 보낸 경험","Celebrating another country’s holiday","intermediate"],["전통 의상을 입어본 경험","Wearing traditional clothing","beginner"],["문화 차이로 오해가 생겼던 경험","Having a misunderstanding because of cultural differences","advanced"],["해외 결혼식에 참석한 경험","Attending a wedding abroad","advanced"],["다른 나라의 예절을 새로 배운 경험","Learning etiquette from another country","intermediate"],["통역 없이 문화 행사를 즐긴 경험","Enjoying a cultural event without an interpreter","intermediate"],["외국 친구에게 한국 문화를 소개한 경험","Introducing Korean culture to an international friend","beginner"],
  ],
  language: [
    ["새로운 언어로 길을 물어본 경험","Asking for directions in a new language","beginner"],["외국어로 농담해본 경험","Making a joke in another language","intermediate"],["번역 없이 영화를 이해한 경험","Understanding a movie without subtitles","advanced"],["잘못 발음해서 웃긴 오해가 생긴 경험","Causing a funny misunderstanding with pronunciation","beginner"],["외국어로 전화 통화한 경험","Making a phone call in another language","intermediate"],["처음 배운 표현을 바로 실전에서 사용한 경험","Using a newly learned phrase right away","beginner"],["두 언어 사이에서 통역을 도운 경험","Helping interpret between two languages","advanced"],
  ],
  mistakes: [
    ["다른 사람에게 메시지를 잘못 보낸 경험","Sending a message to the wrong person","beginner"],["약속 장소를 잘못 찾아간 경험","Going to the wrong meeting place","beginner"],["이름을 잘못 불러서 당황한 경험","Calling someone by the wrong name","beginner"],["중요한 물건을 두고 나온 경험","Leaving an important item behind","beginner"],["실수를 인정하고 관계가 더 좋아진 경험","Improving a relationship by admitting a mistake","intermediate"],["잘못 탄 교통수단으로 새로운 곳을 발견한 경험","Discovering a new place after taking the wrong transport","intermediate"],["실패한 계획을 더 좋은 기회로 바꾼 경험","Turning a failed plan into a better opportunity","advanced"],
  ],
  challenge: [
    ["무대에서 공연해본 경험","Performing on stage","intermediate"],["높은 곳에 올라가 본 경험","Going somewhere very high","beginner"],["마라톤이나 장거리 걷기를 완주한 경험","Finishing a marathon or long-distance walk","advanced"],["두려움을 극복하고 새로운 활동을 한 경험","Trying something new after overcoming a fear","intermediate"],["한 달 동안 새로운 습관을 유지한 경험","Keeping a new habit for a month","intermediate"],["대회에 참가해본 경험","Entering a competition","beginner"],["혼자 큰 결정을 내린 경험","Making a major decision on your own","advanced"],
  ],
  hobbies: [
    ["악기를 연주해본 경험","Playing a musical instrument","beginner"],["직접 만든 작품을 선물한 경험","Giving someone something you made","beginner"],["새로운 스포츠를 배운 경험","Learning a new sport","beginner"],["취미로 작은 전시나 공연에 참여한 경험","Joining a small exhibition or performance","intermediate"],["온라인으로 취미 친구를 만난 경험","Meeting a hobby friend online","intermediate"],["취미를 다른 사람에게 가르쳐본 경험","Teaching your hobby to someone","intermediate"],["오랫동안 쉬었던 취미를 다시 시작한 경험","Restarting a hobby after a long break","beginner"],
  ],
  family: [
    ["가족과 함께 여행을 계획한 경험","Planning a family trip","beginner"],["가족에게 깜짝 이벤트를 준비한 경험","Planning a surprise for your family","beginner"],["가족의 오래된 레시피를 배운 경험","Learning an old family recipe","intermediate"],["가족과 역할을 바꿔 하루를 보낸 경험","Switching family roles for a day","intermediate"],["멀리 사는 가족을 깜짝 방문한 경험","Surprising a family member who lives far away","intermediate"],["가족의 어린 시절 이야기를 기록한 경험","Recording a family member’s childhood story","advanced"],["가족과 함께 어려운 문제를 해결한 경험","Solving a difficult problem as a family","advanced"],
  ],
  friends: [
    ["친구에게 깜짝 생일 파티를 해준 경험","Planning a surprise birthday party for a friend","beginner"],["오래 연락하지 못한 친구와 다시 만난 경험","Reconnecting with an old friend","beginner"],["친구와 즉흥 여행을 떠난 경험","Taking a spontaneous trip with a friend","intermediate"],["친구의 중요한 결정을 도운 경험","Helping a friend make an important decision","advanced"],["언어교환에서 친한 친구를 만난 경험","Making a close friend through language exchange","intermediate"],["친구와 함께 새로운 취미를 시작한 경험","Starting a new hobby with a friend","beginner"],["서로 다른 문화권의 친구들과 모임을 만든 경험","Creating a meetup with friends from different cultures","advanced"],
  ],
  daily: [
    ["하루 동안 휴대전화 없이 지낸 경험","Going a full day without a phone","intermediate"],["새벽에 일어나 일출을 본 경험","Waking up early to watch the sunrise","beginner"],["모르는 사람에게 친절을 베푼 경험","Helping a stranger","beginner"],["일주일 동안 직접 도시락을 만든 경험","Making your own lunch for a week","intermediate"],["대중교통 없이 하루를 보낸 경험","Going a day without public transportation","intermediate"],["우연히 유명인을 만난 경험","Meeting a celebrity by chance","intermediate"],["하루 계획을 모두 즉흥적으로 정한 경험","Planning an entire day spontaneously","beginner"],
  ],
  workingHoliday: [
    ["워킹홀리데이로 해외에서 살아본 경험","Living abroad on a working holiday","advanced"],["해외에서 첫 월급을 받은 경험","Receiving your first paycheck abroad","intermediate"],["외국인 하우스메이트와 살아본 경험","Living with international housemates","intermediate"],["현지에서 직접 집을 구한 경험","Finding your own housing abroad","advanced"],["워킹홀리데이 중 직업을 바꾼 경험","Changing jobs during a working holiday","advanced"],["해외 직장에서 문화 차이를 해결한 경험","Handling a cultural difference at an overseas workplace","advanced"],["워킹홀리데이에서 평생 친구를 만난 경험","Making a lifelong friend on a working holiday","intermediate"],
  ],
  overseasLife: [
    ["해외에서 한 달 이상 살아본 경험","Living abroad for more than a month","intermediate"],["외국에서 병원이나 약국을 이용한 경험","Using a hospital or pharmacy abroad","advanced"],["해외에서 행정 업무를 혼자 처리한 경험","Handling official paperwork abroad alone","advanced"],["다른 나라에서 이사해본 경험","Moving homes in another country","advanced"],["해외에서 현지 동호회에 가입한 경험","Joining a local club abroad","intermediate"],["외국에서 명절을 혼자 보낸 경험","Spending a holiday alone abroad","intermediate"],["해외 생활 중 예상치 못한 도움을 받은 경험","Receiving unexpected help while living abroad","intermediate"],
  ],
  special: [
    ["방송이나 신문에 나온 경험","Appearing on television or in a newspaper","advanced"],["유명인을 우연히 만나본 경험","Meeting a famous person unexpectedly","intermediate"],["구조되거나 누군가를 도운 경험","Being rescued or helping someone in an emergency","advanced"],["평생 기억할 깜짝 선물을 받은 경험","Receiving an unforgettable surprise gift","beginner"],["직접 만든 아이디어가 실제로 사용된 경험","Seeing your own idea put into practice","advanced"],["완전히 낯선 사람들과 특별한 하루를 보낸 경험","Spending a memorable day with complete strangers","advanced"],["계획에 없던 기회가 인생의 방향을 바꾼 경험","Having an unexpected opportunity change your direction","advanced"],
  ],
};

export const experienceHints: ExperienceHint[] = Object.entries(groups).flatMap(
  ([category, rows]) => rows.map(([ko, en, difficulty], index) => ({
    id: `experience-${category}-${String(index + 1).padStart(2, "0")}`,
    category,
    ko,
    en,
    difficulty,
  })),
);

export const experienceHintCategories = Object.keys(groups);
