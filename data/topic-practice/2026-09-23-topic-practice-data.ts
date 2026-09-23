import type { TopicPractice,TopicPracticeCategory } from "./2026-09-23-topic-practice-types";

type TopicSeed={title:string;ko:string;emoji:string;category:TopicPracticeCategory;level:"easy"|"medium"|"mixed";focus?:string[]};
const categories:TopicPracticeCategory[]=["Food & Drinks","Travel","Dating & Relationships","Work & Career","School & Learning","Entertainment","Technology","Money & Lifestyle","Health & Fitness","Daily Life","Culture & Experiences"];
export const topicPracticeCategories=categories;

const rows=`
Food|음식|🍕|Food & Drinks|easy
Restaurants|레스토랑|🍽️|Food & Drinks|easy
Coffee|커피|☕|Food & Drinks|easy
Cooking|요리|👩‍🍳|Food & Drinks|easy
Desserts|디저트|🍰|Food & Drinks|easy
Travel|여행|✈️|Travel|easy
Dream Destinations|꿈의 여행지|🗺️|Travel|easy
Hotels|호텔|🏨|Travel|easy
Airports|공항|🛫|Travel|medium
Road Trips|자동차 여행|🚗|Travel|easy
Dating|연애|❤️|Dating & Relationships|medium
First Dates|첫 데이트|🌹|Dating & Relationships|medium
Ideal Type|이상형|💘|Dating & Relationships|easy
Relationships|연인 관계|💑|Dating & Relationships|medium
Breakups|이별|💔|Dating & Relationships|medium
Marriage|결혼|💍|Dating & Relationships|medium
Friendship|우정|🤝|Dating & Relationships|easy
Making Friends|친구 사귀기|👋|Dating & Relationships|easy
Best Friends|가장 친한 친구|🫶|Dating & Relationships|easy
Social Life|사회생활|🎉|Dating & Relationships|easy
Work|일|💼|Work & Career|easy
Jobs|직업|🧰|Work & Career|easy
Career|커리어|📈|Work & Career|medium
Job Interviews|취업 면접|🤵|Work & Career|medium
Coworkers|직장 동료|👥|Work & Career|easy
Bosses|상사|🧑‍💼|Work & Career|medium
Office Life|회사 생활|🏢|Work & Career|easy
Work-Life Balance|일과 삶의 균형|⚖️|Work & Career|medium
Dream Job|꿈의 직업|🌟|Work & Career|easy
Working Abroad|해외 취업|🌍|Work & Career|medium
School|학교|🏫|School & Learning|easy
University|대학교|🎓|School & Learning|easy
School Memories|학창 시절 추억|📚|School & Learning|easy
Teachers|선생님|🧑‍🏫|School & Learning|easy
Exams|시험|📝|School & Learning|medium
Studying|공부|✏️|School & Learning|easy
Language Learning|언어 학습|🗣️|School & Learning|easy
English|영어|🔤|School & Learning|easy
Study Abroad|유학|🌐|School & Learning|medium
Working Holiday|워킹홀리데이|🧳|School & Learning|medium
Movies|영화|🎬|Entertainment|easy
TV Shows|TV 프로그램|📺|Entertainment|easy
Netflix|넷플릭스|🍿|Entertainment|easy
YouTube|유튜브|▶️|Entertainment|easy
Music|음악|🎵|Entertainment|easy
K-pop|케이팝|🎤|Entertainment|easy
Concerts|콘서트|🎫|Entertainment|easy
Celebrities|유명인|⭐|Entertainment|easy
Games|게임|🎮|Entertainment|easy
Social Media|소셜 미디어|📱|Technology|easy
Instagram|인스타그램|📸|Technology|easy
Smartphones|스마트폰|📲|Technology|easy
Technology|기술|💻|Technology|medium
AI|인공지능|🤖|Technology|medium
Online Shopping|온라인 쇼핑|🛒|Technology|easy
Shopping|쇼핑|🛍️|Money & Lifestyle|easy
Fashion|패션|👗|Money & Lifestyle|easy
Clothes|옷|👕|Money & Lifestyle|easy
Beauty|뷰티|💄|Money & Lifestyle|easy
Gifts|선물|🎁|Money & Lifestyle|easy
Money|돈|💰|Money & Lifestyle|medium
Saving Money|저축|🐷|Money & Lifestyle|medium
Spending Habits|소비 습관|💳|Money & Lifestyle|medium
Investing|투자|📊|Money & Lifestyle|medium
Housing|주거|🏠|Money & Lifestyle|medium
Living Alone|자취|🔑|Money & Lifestyle|easy
Roommates|룸메이트|🚪|Money & Lifestyle|easy
Moving|이사|📦|Money & Lifestyle|easy
Neighborhoods|동네|🏘️|Daily Life|easy
Transportation|교통|🚉|Daily Life|easy
Cars|자동차|🚙|Daily Life|easy
Public Transportation|대중교통|🚌|Daily Life|easy
Exercise|운동|🏃|Health & Fitness|easy
Gym|헬스장|🏋️|Health & Fitness|easy
Sports|스포츠|⚽|Health & Fitness|easy
Health|건강|🩺|Health & Fitness|medium
Sleep|수면|😴|Health & Fitness|easy
Stress|스트레스|🧘|Health & Fitness|medium
Habits|습관|🔁|Health & Fitness|easy
Daily Routine|일상 루틴|⏰|Daily Life|easy
Weekends|주말|🌞|Daily Life|easy
Holidays|휴일|🏖️|Daily Life|easy
Birthdays|생일|🎂|Daily Life|easy
Parties|파티|🥳|Daily Life|easy
Drinking|술자리|🍻|Daily Life|medium
Festivals|축제|🎊|Culture & Experiences|easy
Seasons|계절|🍂|Daily Life|easy
Weather|날씨|🌦️|Daily Life|easy
Pets|반려동물|🐶|Daily Life|easy
Animals|동물|🐾|Daily Life|easy
Personality|성격|🧠|Culture & Experiences|medium
Happiness|행복|😊|Culture & Experiences|easy
Goals|목표|🎯|Culture & Experiences|medium
Dreams|꿈|💭|Culture & Experiences|medium
Future|미래|🔮|Culture & Experiences|medium
Bucket List|버킷리스트|✅|Culture & Experiences|easy
Culture|문화|🌏|Culture & Experiences|medium
Korean Culture|한국 문화|🇰🇷|Culture & Experiences|medium
Life Abroad|해외 생활|🛂|Culture & Experiences|medium
Childhood|어린 시절|🧸|Culture & Experiences|easy`;

const specialFocus:Record<string,string[]>= {
 Food:["your favorite comfort food","what you ate today","Korean food versus Western food","eating out during the week","a dish you can cook","a memorable recent meal","a food you learned to enjoy","your favorite late-night snack","food you recommend to visitors","a dish you would never try"],
 Travel:["your favorite country","your next destination","solo travel versus group travel","your longest trip","planning versus spontaneous travel","food you discovered abroad","missing a flight","a difficult travel moment","living in another country","a place you would revisit"],
 Dating:["an ideal first date","love at first sight","first-date red flags","meeting someone online","paying on a first date","looks versus personality","texting versus calling","blind dates","what makes someone attractive","dating before marriage"],
 "Job Interviews":["your last interview","a strong self-introduction","skills employers value","a difficult interview question","researching a company","choosing interview clothes","talking about weaknesses","asking the interviewer questions","following up after an interview","handling rejection"],
 "Language Learning":["your reason for learning English","the hardest English skill","studying alone versus together","speaking with a stranger","an accent you enjoy","remembering new vocabulary","fear of mistakes","using English outside class","a useful expression","the next language you want to learn"],
 Movies:["a movie you watched recently","your favorite genre","watching at home versus a cinema","a memorable movie ending","a film you watched twice","subtitles versus dubbing","a disappointing movie","an actor you admire","choosing a movie with friends","a film that changed your opinion"],
 Money:["your first memory of money","cash versus cards","a purchase worth the price","something you regret buying","talking about money with friends","budgeting every month","lending money","saving for a goal","money and happiness","a financial habit to change"],
 Gym:["your favorite gym exercise","starting a new routine","working out alone","a helpful trainer","busy gym hours","strength versus cardio","staying motivated","gym etiquette","music while exercising","a fitness goal"],
 "Working Holiday":["a country you would choose","finding a temporary job","living with new roommates","language problems at work","planning a working-holiday budget","making local friends","homesickness","traveling between jobs","skills gained abroad","advice for a first week"],
 "Social Media":["the app you open first","how often you post","content you enjoy","taking a social-media break","online friendships","privacy settings","influencers you trust","comparing yourself online","sharing travel photos","social media in ten years"],
 "Korean Culture":["a Korean custom visitors notice","Korean food culture","age and politeness","holiday traditions","K-pop around the world","public transportation etiquette","group dining","work culture","a Korean place to recommend","a tradition worth preserving"],
 Coffee:["your first cup of the day","how many cups you drink","a cafe you return to","hot versus iced coffee","making coffee at home","caffeine and sleep","specialty coffee prices","ordering coffee abroad","meeting friends at a cafe","a coffee drink you dislike"],
};

const vocabPacks:Record<TopicPracticeCategory,[string,string][]>= {
 "Food & Drinks":[["flavor","맛"],["ingredient","재료"],["portion","양, 1인분"],["crispy","바삭한"],["chewy","쫄깃한"],["spicy","매운"],["fresh","신선한"],["recipe","조리법"],["recommend","추천하다"],["craving","강하게 당김"]],
 Travel:[["destination","목적지"],["itinerary","여행 일정"],["reservation","예약"],["sightseeing","관광"],["local","현지의"],["luggage","짐"],["departure","출발"],["accommodation","숙소"],["explore","둘러보다"],["memorable","기억에 남는"]],
 "Dating & Relationships":[["chemistry","서로 통하는 느낌"],["crush","좋아하는 사람"],["compatible","잘 맞는"],["trust","신뢰"],["supportive","힘이 되어주는"],["honest","솔직한"],["boundary","관계의 경계"],["commitment","진지한 약속"],["conflict","갈등"],["reconnect","다시 가까워지다"]],
 "Work & Career":[["deadline","마감일"],["coworker","직장 동료"],["responsibility","책임"],["promotion","승진"],["flexible","유연한"],["experience","경력, 경험"],["strength","강점"],["feedback","피드백"],["opportunity","기회"],["workload","업무량"]],
 "School & Learning":[["assignment","과제"],["concentrate","집중하다"],["review","복습하다"],["memorize","암기하다"],["fluency","유창함"],["mistake","실수"],["improve","향상하다"],["semester","학기"],["presentation","발표"],["curious","궁금해하는"]],
 Entertainment:[["genre","장르"],["episode","회차"],["performance","공연"],["recommendation","추천"],["audience","관객"],["release","출시, 공개"],["playlist","재생 목록"],["talented","재능 있는"],["entertaining","재미있는"],["review","후기, 평론"]],
 Technology:[["device","기기"],["feature","기능"],["privacy","개인정보 보호"],["update","업데이트"],["convenient","편리한"],["algorithm","알고리즘"],["account","계정"],["screen time","화면 사용 시간"],["reliable","신뢰할 수 있는"],["innovation","혁신"]],
 "Money & Lifestyle":[["budget","예산"],["afford","형편이 되다"],["expense","지출"],["value","가치"],["save up","돈을 모으다"],["rent","집세"],["deposit","보증금"],["habit","습관"],["essential","필수적인"],["worth it","그만한 가치가 있는"]],
 "Health & Fitness":[["routine","루틴"],["stamina","체력"],["balanced","균형 잡힌"],["recover","회복하다"],["motivation","동기"],["stretch","스트레칭하다"],["well-being","건강과 행복"],["energetic","활기찬"],["consistent","꾸준한"],["relieve","완화하다"]],
 "Daily Life":[["routine","일상 루틴"],["commute","통근하다"],["convenient","편리한"],["neighborhood","동네"],["schedule","일정"],["chore","집안일"],["relax","쉬다"],["crowded","붐비는"],["regularly","정기적으로"],["spare time","여가 시간"]],
 "Culture & Experiences":[["tradition","전통"],["custom","관습"],["perspective","관점"],["meaningful","의미 있는"],["adapt","적응하다"],["experience","경험"],["identity","정체성"],["community","공동체"],["respect","존중"],["inspire","영감을 주다"]],
};

const vocabularyExamples:Record<TopicPracticeCategory,string[]>={
 "Food & Drinks":["The soup has a rich flavor.","Fresh ingredients make a big difference.","The portions here are generous.","The chicken is crispy on the outside.","These rice cakes are pleasantly chewy.","I ordered the least spicy option.","We buy fresh vegetables at the market.","My grandmother gave me this recipe.","Can you recommend a good local restaurant?","I've been craving noodles all day."],
 Travel:["Japan is our next destination.","I shared the itinerary with everyone.","I made a reservation online.","We spent the morning sightseeing.","A local showed us a quiet cafe.","My luggage did not arrive.","Our departure was delayed by an hour.","The accommodation was simple but clean.","We explored the old town on foot.","It was a memorable trip."],
 "Dating & Relationships":["We had great chemistry from the start.","I had a crush on my classmate.","Our personalities are very compatible.","Trust takes time to build.","She was supportive during a difficult week.","Please be honest with me.","It is important to respect each other's boundaries.","He is not ready for a serious commitment.","They resolved the conflict calmly.","I reconnected with an old friend."],
 "Work & Career":["The deadline is Friday afternoon.","I had lunch with a coworker.","Managing the schedule is my responsibility.","She earned a promotion last month.","My manager is flexible about working hours.","I have three years of sales experience.","Clear communication is one of my strengths.","Thank you for the helpful feedback.","This job is a great opportunity to learn.","My workload is heavy this week."],
 "School & Learning":["I submitted the assignment before class.","I concentrate better in the morning.","Let's review these words tomorrow.","A story helps me memorize new vocabulary.","Daily conversation improved my fluency.","Making a mistake is part of learning.","I want to improve my pronunciation.","The new semester begins in March.","Our group gave a short presentation.","Curious students ask thoughtful questions."],
 Entertainment:["Comedy is my favorite genre.","I watched one episode before bed.","Her live performance was incredible.","I need a movie recommendation.","The audience laughed throughout the show.","The album's release is next week.","I made a playlist for the road trip.","The cast is extremely talented.","The documentary was both entertaining and informative.","I read a positive review of the film."],
 Technology:["I use this device to track my sleep.","The translation feature is very useful.","Check your privacy settings regularly.","The latest update fixed the problem.","Mobile payment is convenient when traveling.","The algorithm recommends videos based on your history.","I created a separate work account.","I'm trying to reduce my screen time.","We need a reliable internet connection.","That innovation changed how people communicate."],
 "Money & Lifestyle":["I make a monthly budget.","I can't afford a new car right now.","Rent is my biggest expense.","This jacket offers good value for the price.","I'm saving up for a trip.","The rent includes water and internet.","We paid a small deposit.","Cooking at home became a healthy habit.","A warm coat is essential in winter.","The concert was expensive, but it was worth it."],
 "Health & Fitness":["A short morning routine helps me wake up.","Cycling has improved my stamina.","I try to eat a balanced diet.","My legs need time to recover.","Training with a friend gives me motivation.","Remember to stretch after exercising.","Sleep is important for your well-being.","I feel energetic after a good night's sleep.","Consistent practice matters more than perfection.","Walking helps relieve stress."],
 "Daily Life":["My morning routine starts with coffee.","I commute by subway.","The new bus route is very convenient.","There is a friendly bakery in my neighborhood.","My schedule is packed today.","Doing laundry is my least favorite chore.","I relax by listening to music.","The train gets crowded after work.","We meet regularly for language exchange.","I read in my spare time."],
 "Culture & Experiences":["Sharing food is an important family tradition.","Taking off your shoes indoors is a common custom.","Travel gave me a different perspective.","It was a meaningful conversation.","It took a few months to adapt to life abroad.","That experience made me more confident.","Language is an important part of identity.","The festival brings the community together.","People show respect in different ways.","Her story inspired me to try something new."],
};

const expressionPacks:Record<TopicPracticeCategory,[string,string,string][]>= {
 "Food & Drinks":[["I'm craving ~","~가 당겨.","I'm craving something spicy."],["I'm not a big fan of ~","~를 별로 좋아하지 않아.","I'm not a big fan of seafood."],["It tastes amazing.","정말 맛있다.","This soup tastes amazing."],["I'll have the ~","~로 할게요.","I'll have the pasta."],["It's not really my thing.","내 취향은 아니야.","Very sweet coffee isn't really my thing."]],
 Travel:[["It's on my bucket list.","내 버킷리스트에 있어.","Iceland is on my bucket list."],["I'd love to visit ~","~에 꼭 가보고 싶어.","I'd love to visit Spain."],["How long does it take?","얼마나 걸리나요?","How long does it take by train?"],["Is it within walking distance?","걸어갈 수 있는 거리인가요?","Is the hotel within walking distance?"],["It was totally worth it.","정말 그럴 만한 가치가 있었어.","The long flight was totally worth it."]],
 "Dating & Relationships":[["I'm into someone.","누군가에게 호감이 있어.","I think I'm into someone at work."],["We really hit it off.","우리 정말 잘 통했어.","We really hit it off on our first date."],["That's a red flag for me.","그건 나한테 위험 신호야.","Being rude is a red flag for me."],["We have a lot in common.","우리는 공통점이 많아.","We have a lot in common."],["I need some space.","혼자 생각할 시간이 필요해.","I need some space to think."]],
 "Work & Career":[["I have experience in ~","~ 경험이 있습니다.","I have experience in customer service."],["One of my strengths is ~","제 강점 중 하나는 ~입니다.","One of my strengths is communication."],["I'm looking for an opportunity to ~","~할 기회를 찾고 있습니다.","I'm looking for an opportunity to grow."],["Could you clarify that?","그 부분을 명확히 설명해주시겠어요?","Could you clarify the deadline?"],["I'll get back to you.","확인하고 다시 알려드릴게요.","I'll get back to you this afternoon."]],
 "School & Learning":[["How do you say this in English?","이걸 영어로 어떻게 말해요?","How do you say this in English?"],["What does that mean?","그게 무슨 뜻이에요?","What does that expression mean?"],["Could you say that again?","다시 말해주시겠어요?","Could you say that again more slowly?"],["I didn't catch that.","잘 못 들었어요.","Sorry, I didn't catch that."],["Let me try again.","다시 해볼게요.","Let me try again in English."]],
 Entertainment:[["I'm really into ~","나는 ~에 푹 빠졌어.","I'm really into documentaries."],["It's worth watching.","볼 만한 가치가 있어.","That series is worth watching."],["I couldn't stop listening.","계속 듣게 됐어.","I couldn't stop listening to that album."],["The ending blew me away.","결말이 정말 놀라웠어.","The ending completely blew me away."],["It's not my cup of tea.","내 취향은 아니야.","Reality TV isn't my cup of tea."]],
 Technology:[["I use it all the time.","나는 그걸 늘 사용해.","I use that app all the time."],["It's user-friendly.","사용하기 편리해.","The new design is user-friendly."],["I'm trying to cut down on ~","~을 줄이려고 해.","I'm trying to cut down on screen time."],["It saves me a lot of time.","시간을 많이 절약해줘.","AI saves me a lot of time."],["I'm worried about privacy.","개인정보 보호가 걱정돼.","I'm worried about online privacy."]],
 "Money & Lifestyle":[["I'm saving up for ~","~을 위해 돈을 모으고 있어.","I'm saving up for a new apartment."],["It's out of my budget.","내 예산을 넘어.","That bag is out of my budget."],["It was worth every penny.","돈이 전혀 아깝지 않았어.","The trip was worth every penny."],["I can live without it.","그건 없어도 돼.","I can live without a new phone."],["I'm trying to spend less on ~","~에 쓰는 돈을 줄이려고 해.","I'm trying to spend less on delivery food."]],
 "Health & Fitness":[["I'm trying to get in shape.","몸을 만들려고 노력 중이야.","I'm trying to get in shape this year."],["I need to get more sleep.","잠을 더 자야 해.","I really need to get more sleep."],["It helps me clear my head.","머리를 맑게 하는 데 도움이 돼.","Running helps me clear my head."],["I'm taking it one day at a time.","하루하루 천천히 하고 있어.","I'm taking my recovery one day at a time."],["I feel full of energy.","에너지가 넘쳐.","I feel full of energy after exercising."]],
 "Daily Life":[["I usually ~","나는 보통 ~해.","I usually take the bus."],["It depends on the day.","그날그날 달라.","My routine depends on the day."],["I tend to ~","나는 ~하는 편이야.","I tend to stay home on Sundays."],["I'm used to ~","나는 ~에 익숙해.","I'm used to a long commute."],["That makes life easier.","그게 생활을 더 편하게 해줘.","Online banking makes life easier."]],
 "Culture & Experiences":[["It's common to ~","~하는 것이 흔해.","It's common to share food in Korea."],["I grew up with ~","나는 ~와 함께 자랐어.","I grew up with that tradition."],["It took time to get used to ~","~에 익숙해지는 데 시간이 걸렸어.","It took time to get used to the culture."],["From my point of view, ~","내 관점에서는 ~.","From my point of view, traditions matter."],["That experience changed me.","그 경험이 나를 바꿨어.","Living abroad changed me."]],
};

function slug(value:string){return value.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")}
function focusFor(seed:TopicSeed){return specialFocus[seed.title]??[
  `your first experience with ${seed.title.toLowerCase()}`,`a recent ${seed.title.toLowerCase()} moment`,`your favorite part of ${seed.title.toLowerCase()}`,
  `${seed.title.toLowerCase()} with friends`,`a difficult choice about ${seed.title.toLowerCase()}`,`how ${seed.title.toLowerCase()} fits your routine`,
  `a common mistake involving ${seed.title.toLowerCase()}`,`the cost of ${seed.title.toLowerCase()}`,`how ${seed.title.toLowerCase()} may change`,`advice about ${seed.title.toLowerCase()}`];}
const questionFrames=[
  (x:string)=>`Tell us about ${x}.`,(x:string)=>`What makes ${x} memorable for you?`,(x:string)=>`How do you feel about ${x}?`,
  (x:string)=>`Who would you like to share ${x} with, and why?`,(x:string)=>`What is the hardest thing about ${x}?`,
  (x:string)=>`How has your opinion about ${x} changed?`,(x:string)=>`What have you learned from ${x}?`,
  (x:string)=>`Would you spend more time or money on ${x}? Why?`,(x:string)=>`How do you think ${x} will be different in five years?`,
  (x:string)=>`What advice would you give a friend about ${x}?`];
const warmFrames=[(x:string)=>`Have you experienced ${x}?`,(x:string)=>`How often do you think about ${x}?`,(x:string)=>`Do you enjoy ${x}? Why?`,(x:string)=>`When did you last talk about ${x}?`,(x:string)=>`What word describes ${x} for you?`];
const warmKo=["관련 경험이 있나요?","얼마나 자주 생각하나요?","좋아하나요? 이유는 무엇인가요?","마지막으로 이야기한 때는 언제인가요?","한 단어로 표현하면 무엇인가요?"];
const mainKo=["관련 경험을 들려주세요.","왜 기억에 남나요?","어떻게 생각하나요?","누구와 함께하고 싶나요?", "가장 어려운 점은 무엇인가요?","생각이 어떻게 바뀌었나요?","무엇을 배웠나요?","시간이나 돈을 더 쓸 의향이 있나요?","5년 뒤에는 어떻게 달라질까요?","친구에게 어떤 조언을 하고 싶나요?"];

function makeTopic(seed:TopicSeed):TopicPractice{
 const id=slug(seed.title),focus=focusFor(seed),vocab=vocabPacks[seed.category],expressions=expressionPacks[seed.category];
 const warmupQuestions=focus.slice(0,5).map((item,i)=>({id:`${id}-w${i+1}`,question:warmFrames[i](item),korean:warmKo[i],followUps:[`Why do you say that?`,`Can you give an example?`]}));
 const conversationQuestions=focus.map((item,i)=>({id:`${id}-q${i+1}`,question:questionFrames[i](item),korean:mainKo[i],followUps:[i%2?"How did that make you feel?":"What happened next?",i%3?"Would you do it again?":"Has anyone had a similar experience?"]}));
 return {id,title:seed.title,koreanTitle:seed.ko,emoji:seed.emoji,category:seed.category,level:seed.level,warmupQuestions,conversationQuestions,
  vocabulary:vocab.map(([word,korean],index)=>({word,korean,example:vocabularyExamples[seed.category][index]})),
  expressions:expressions.map(([expression,korean,example])=>({expression,korean,example,practice:expression.includes("~")?expression.replace("~","_______"):`Use “${expression}” in your own sentence.`})),
  rolePlays:[
   {id:`${id}-r1`,title:`Planning ${seed.title} Together`,koreanTitle:`${seed.ko} 함께 계획하기`,situation:`Two friends have different preferences about ${seed.title.toLowerCase()} and need one shared plan.`,koreanSituation:`두 친구가 ${seed.ko}에 대해 서로 다른 취향을 가지고 하나의 계획을 정해야 합니다.`,roleA:`Explain your first choice and your budget or schedule.`,roleB:`Suggest a different option and ask two follow-up questions.`,mission:"Agree on one realistic plan without using Korean.",usefulExpressions:[expressions[0][0],expressions[1][0],"How about we...?","That works for me."]},
   {id:`${id}-r2`,title:`A Problem with ${seed.title}`,koreanTitle:`${seed.ko} 문제 해결`,situation:`Something went wrong during a ${seed.title.toLowerCase()} experience. Solve it politely.`,koreanSituation:`${seed.ko} 경험 중 문제가 생겼습니다. 정중하게 해결하세요.`,roleA:"Describe the problem clearly and say what solution you want.",roleB:"Ask for details, apologize, and offer two solutions.",mission:"Reach a solution that both roles accept.",usefulExpressions:["Could you help me with this?","I'm sorry about that.","Would it be possible to...?","That sounds fair."]},
   {id:`${id}-r3`,title:`Recommend It to a New Friend`,koreanTitle:"새 친구에게 추천하기",situation:`One person knows a lot about ${seed.title.toLowerCase()}; the other is trying it for the first time.`,koreanSituation:`한 사람은 ${seed.ko}을 잘 알고, 다른 사람은 처음 경험합니다.`,roleA:"Recommend a specific option and explain two reasons.",roleB:"Ask about price, difficulty, and what to expect.",mission:"Choose one recommendation and explain the final decision.",usefulExpressions:["What do you recommend?","What should I expect?","It's worth trying.","I'll give it a try."]}],
  challenges:[{id:`${id}-c1`,title:"30 SECOND CHALLENGE",instruction:`Talk about ${focus[2]} for 30 seconds without stopping.`,korean:`30초 동안 멈추지 않고 ${seed.ko}에 대해 말해보세요.`,seconds:30},{id:`${id}-c2`,title:"USE 3 WORDS",instruction:`Share an opinion about ${seed.title} using all three words.`,korean:`세 단어를 모두 사용해 ${seed.ko}에 대한 의견을 말해보세요.`,seconds:45,words:vocab.slice(0,3).map(item=>item[0])}]};
}

const seeds:TopicSeed[]=rows.trim().split("\n").map(row=>{const [title,ko,emoji,category,level]=row.split("|");return{title,ko,emoji,category:category as TopicPracticeCategory,level:level as TopicSeed["level"]}});
export const topicPracticeTopics:TopicPractice[]=seeds.map(makeTopic);

export function validateTopicPracticeData(){
 const errors:string[]=[];if(topicPracticeTopics.length!==100)errors.push(`Expected 100 topics, got ${topicPracticeTopics.length}`);
 const ids=new Set<string>(),titles=new Set<string>();
 for(const topic of topicPracticeTopics){if(ids.has(topic.id))errors.push(`Duplicate id: ${topic.id}`);ids.add(topic.id);if(titles.has(topic.title))errors.push(`Duplicate title: ${topic.title}`);titles.add(topic.title);
  if(topic.warmupQuestions.length<5)errors.push(`${topic.id}: warmups`);if(topic.conversationQuestions.length<10)errors.push(`${topic.id}: questions`);if(topic.vocabulary.length<10)errors.push(`${topic.id}: vocabulary`);if(topic.expressions.length<5)errors.push(`${topic.id}: expressions`);if(topic.rolePlays.length<3)errors.push(`${topic.id}: roleplays`);if(topic.challenges.length<2)errors.push(`${topic.id}: challenges`);
  if(topic.vocabulary.some(item=>!item.korean.trim()))errors.push(`${topic.id}: missing vocabulary Korean`);if(topic.expressions.some(item=>!item.korean.trim()))errors.push(`${topic.id}: missing expression Korean`);if(topic.rolePlays.some(item=>!item.roleA||!item.roleB||!item.mission))errors.push(`${topic.id}: incomplete roleplay`);
  if(JSON.stringify(topic).match(/placeholder|lorem ipsum|todo/i))errors.push(`${topic.id}: placeholder`);
 }return errors;
}
export const topicPracticeCounts={topics:topicPracticeTopics.length,warmups:topicPracticeTopics.reduce((n,t)=>n+t.warmupQuestions.length,0),questions:topicPracticeTopics.reduce((n,t)=>n+t.conversationQuestions.length,0),vocabulary:topicPracticeTopics.reduce((n,t)=>n+t.vocabulary.length,0),expressions:topicPracticeTopics.reduce((n,t)=>n+t.expressions.length,0),rolePlays:topicPracticeTopics.reduce((n,t)=>n+t.rolePlays.length,0),challenges:topicPracticeTopics.reduce((n,t)=>n+t.challenges.length,0)};
