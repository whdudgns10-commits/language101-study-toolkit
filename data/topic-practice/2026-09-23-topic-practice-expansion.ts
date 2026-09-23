import type { TopicPracticeCategory } from "./2026-09-23-topic-practice-types";

export type TopicExpansionSeed={title:string;ko:string;emoji:string;category:TopicPracticeCategory;level:"easy"|"medium"|"mixed";keywords:string[]};

const rows=`
Street Food|길거리 음식|🥙|Food & Drinks|easy|food trucks~night markets~street vendors~local snacks~hygiene
Breakfast|아침 식사|🍳|Food & Drinks|easy|morning meals~cereal~eggs~brunch~skipping breakfast
Lunch|점심 식사|🥪|Food & Drinks|easy|lunch breaks~packed lunches~work lunches~cafeterias~quick meals
Dinner|저녁 식사|🍲|Food & Drinks|easy|family dinners~dinner time~home cooking~eating out~late dinners
Snacks|간식|🍿|Food & Drinks|easy|late-night snacks~healthy snacks~convenience stores~sweet snacks~sharing snacks
Healthy Food|건강식|🥗|Food & Drinks|medium|balanced meals~salads~nutrition labels~meal prep~healthy choices
Fast Food|패스트푸드|🍔|Food & Drinks|easy|drive-throughs~combo meals~burgers~convenience~fast-food habits
Delivery Food|배달 음식|🛵|Food & Drinks|easy|delivery fees~late delivery~food apps~minimum orders~delivery reviews
Korean Food|한국 음식|🍚|Food & Drinks|easy|kimchi~barbecue~side dishes~spicy food~regional dishes
Foreign Food|외국 음식|🌮|Food & Drinks|easy|international restaurants~new flavors~authentic food~fusion food~food abroad
Solo Travel|혼자 여행|🎒|Travel|medium|traveling alone~personal safety~meeting people~freedom~solo planning
Group Travel|단체 여행|🚌|Travel|easy|group decisions~shared budgets~different schedules~tour groups~travel companions
Weekend Trips|주말 여행|🚆|Travel|easy|short getaways~nearby cities~packing light~Friday nights~Sunday returns
Beach Vacations|해변 휴가|🏝️|Travel|easy|swimming~sun protection~beach resorts~water activities~relaxing
Camping|캠핑|⛺|Travel|easy|tents~campfires~camping food~bad weather~outdoor skills
Hotels vs Hostels|호텔과 호스텔|🛏️|Travel|medium|privacy~shared rooms~hotel service~hostel friends~accommodation prices
Travel Problems|여행 문제|🧭|Travel|medium|missed flights~lost luggage~wrong directions~language problems~travel insurance
Travel Budgets|여행 예산|💵|Travel|medium|daily budgets~cheap flights~saving money~splurging~unexpected costs
Travel Photos|여행 사진|📷|Travel|easy|taking photos~photo spots~sharing online~camera equipment~living in the moment
Local Experiences|현지 체험|🧑‍🌾|Travel|medium|local guides~home cooking~neighborhoods~traditional activities~avoiding tourist traps
Blind Dates|소개팅|🌹|Dating & Relationships|medium|being set up~first meetings~awkward silence~first impressions~second dates
Online Dating|온라인 연애|💻|Dating & Relationships|medium|meeting online~profile honesty~online chemistry~safety~moving offline
Dating Apps|데이트 앱|💞|Dating & Relationships|easy|dating profiles~swiping~match messages~profile photos~app fatigue
Long-Distance Relationships|장거리 연애|🗺️|Dating & Relationships|medium|time differences~video calls~trust~visits~future plans
Dating Culture|연애 문화|💐|Dating & Relationships|medium|paying on dates~public affection~meeting parents~dating expectations~cultural differences
Green Flags|좋은 연애 신호|🟢|Dating & Relationships|easy|kindness~good communication~reliability~respect~emotional maturity
Red Flags|연애 위험 신호|🚩|Dating & Relationships|easy|jealousy~rudeness~dishonesty~controlling behavior~poor communication
Texting in Dating|연애 중 문자|💬|Dating & Relationships|easy|reply speed~good-morning texts~double texting~emojis~misunderstandings
Couple Activities|커플 활동|🫶|Dating & Relationships|easy|date nights~shared hobbies~cooking together~short trips~quiet time
Love Languages|사랑의 언어|💝|Dating & Relationships|medium|quality time~kind words~helpful actions~gifts~physical affection
First Jobs|첫 직장|🪪|Work & Career|easy|first day~new coworkers~early mistakes~training~first paycheck
Part-Time Jobs|아르바이트|🧾|Work & Career|easy|work schedules~customer service~hourly pay~busy shifts~student jobs
Changing Jobs|이직|🔄|Work & Career|medium|resigning~new opportunities~career risks~job searches~notice periods
Remote Work|재택근무|🏡|Work & Career|easy|home offices~online meetings~flexible hours~distractions~working alone
Company Culture|기업 문화|🏢|Work & Career|medium|team values~office atmosphere~dress codes~communication styles~company events
Workplace Problems|직장 문제|🧯|Work & Career|medium|unfair workloads~miscommunication~difficult coworkers~asking for help~reporting problems
Business Trips|출장|🧳|Work & Career|medium|client meetings~packing for work~travel schedules~expense reports~free evenings
Salaries|급여|💰|Work & Career|medium|salary expectations~pay transparency~negotiation~benefits~raises
Promotions|승진|📈|Work & Career|medium|more responsibility~leadership~asking for promotion~career growth~celebrating success
Starting a Business|창업|🚀|Work & Career|medium|business ideas~finding customers~startup costs~business partners~taking risks
College Life|대학 생활|🎓|School & Learning|easy|campus life~lectures~dorms~student freedom~college friends
Group Projects|조별 과제|👨‍👩‍👧‍👦|School & Learning|easy|dividing tasks~group leaders~deadlines~unequal effort~presentations
Homework|숙제|📒|School & Learning|easy|homework habits~late assignments~getting help~weekend homework~useful practice
School Lunch|학교 급식|🍱|School & Learning|easy|cafeteria food~lunch lines~favorite menus~packed lunches~eating with friends
Classmates|반 친구들|🧑‍🤝‍🧑|School & Learning|easy|desk partners~class friendships~helpful classmates~group chats~reunions
School Clubs|학교 동아리|🎭|School & Learning|easy|joining clubs~club leaders~after-school activities~competitions~new skills
Graduation|졸업|🎓|School & Learning|easy|graduation ceremonies~final days~graduation photos~future plans~staying in touch
Online Classes|온라인 수업|🖥️|School & Learning|easy|video lessons~camera rules~internet problems~online participation~learning at home
Favorite Subjects|좋아하는 과목|📐|School & Learning|easy|favorite classes~useful subjects~difficult subjects~great teachers~career connections
School Rules|학교 규칙|📏|School & Learning|medium|uniforms~phone rules~attendance~fair rules~breaking rules
Podcasts|팟캐스트|🎙️|Entertainment|easy|favorite hosts~listening habits~podcast topics~episode length~learning through podcasts
Reality Shows|리얼리티 쇼|📺|Entertainment|easy|reality stars~competition shows~dramatic moments~guilty pleasures~real versus scripted
Dramas|드라마|🎞️|Entertainment|easy|favorite series~plot twists~long episodes~binge-watching~drama characters
Comedy|코미디|😂|Entertainment|easy|stand-up comedy~funny movies~favorite comedians~different humor~laughing with friends
Horror Movies|공포 영화|👻|Entertainment|easy|jump scares~watching alone~scary characters~true stories~favorite horror films
Action Movies|액션 영화|💥|Entertainment|easy|fight scenes~car chases~action heroes~special effects~movie theaters
Romance Movies|로맨스 영화|💕|Entertainment|easy|happy endings~movie couples~romantic scenes~sad romances~realistic love stories
Karaoke|노래방|🎤|Entertainment|easy|go-to songs~singing confidence~duets~karaoke rooms~singing badly
Live Music|라이브 음악|🎸|Entertainment|easy|small venues~concert energy~favorite performers~standing crowds~live sound
Favorite Songs|좋아하는 노래|🎧|Entertainment|easy|repeat songs~meaningful lyrics~childhood songs~music memories~sharing playlists
ChatGPT|챗지피티|🤖|Technology & Social Media|easy|AI questions~useful prompts~study help~wrong answers~future uses
Dating Apps and Technology|데이트 앱과 기술|📲|Technology & Social Media|medium|matching algorithms~video profiles~location features~privacy~AI dating
Online Communities|온라인 커뮤니티|🌐|Technology & Social Media|medium|shared interests~online friends~community rules~helpful advice~toxic comments
Video Calls|영상 통화|📹|Technology & Social Media|easy|camera problems~online meetings~family calls~screen sharing~call manners
Mobile Apps|모바일 앱|📱|Technology & Social Media|easy|daily apps~paid apps~notifications~app permissions~deleting apps
Screen Time|스크린 타임|⏳|Technology & Social Media|easy|daily phone use~screen limits~bedtime scrolling~work screens~eye strain
Digital Detox|디지털 디톡스|🌿|Technology & Social Media|medium|phone-free days~notification breaks~offline hobbies~social pressure~better sleep
Online Reviews|온라인 리뷰|⭐|Technology & Social Media|easy|star ratings~fake reviews~writing reviews~bad experiences~choosing businesses
Food Delivery Apps|음식 배달 앱|🥡|Technology & Social Media|easy|delivery tracking~app coupons~restaurant choices~missing items~service fees
Maps and Navigation|지도와 길찾기|🗺️|Technology & Social Media|easy|GPS directions~getting lost~traffic updates~saved places~offline maps
Credit Cards|신용카드|💳|Money & Shopping|medium|card bills~reward points~interest~credit limits~cashless payment
Monthly Expenses|월 생활비|🧮|Money & Shopping|medium|fixed costs~food spending~subscriptions~budget tracking~cutting expenses
Rent|월세|🔑|Home & Lifestyle|medium|rent increases~lease contracts~sharing rent~housing location~monthly payments
Buying a Home|내 집 마련|🏠|Home & Lifestyle|medium|down payments~mortgages~home size~neighborhood choices~buying versus renting
Expensive Purchases|고가 구매|💎|Money & Shopping|medium|saving first~comparing prices~buyer regret~quality~asking advice
Discounts|할인|🏷️|Money & Shopping|easy|sale seasons~coupon codes~member discounts~buy-one-get-one~waiting for sales
Impulse Buying|충동구매|🛒|Money & Shopping|easy|unplanned purchases~shopping moods~online ads~returning items~spending regrets
Secondhand Shopping|중고 쇼핑|♻️|Money & Shopping|easy|used clothes~marketplace apps~checking quality~negotiating prices~selling old items
Luxury Goods|명품|👜|Money & Shopping|medium|designer brands~status symbols~quality~counterfeit goods~saving for luxury
Minimalism|미니멀리즘|🧺|Home & Lifestyle|medium|owning less~decluttering~simple rooms~careful shopping~digital minimalism
Morning Routines|아침 루틴|🌅|Daily Life|easy|alarm habits~morning coffee~exercise~getting ready~checking phones
Night Routines|밤 루틴|🌙|Daily Life|easy|bedtime habits~skin care~reading~phone use~preparing for tomorrow
Bad Habits|나쁜 습관|🙈|Daily Life|easy|late sleeping~snacking~procrastination~phone checking~breaking habits
Good Habits|좋은 습관|🌱|Daily Life|easy|daily exercise~reading~planning~drinking water~habit tracking
Productivity|생산성|✅|Daily Life|medium|to-do lists~deep work~morning energy~work breaks~finishing tasks
Procrastination|미루는 습관|🐌|Daily Life|medium|delaying tasks~deadlines~distractions~starting small~last-minute work
Time Management|시간 관리|⏰|Daily Life|medium|planning days~priorities~busy schedules~being late~calendar apps
Free Time|여가 시간|🛋️|Daily Life|easy|relaxing~personal hobbies~unexpected free time~weeknight activities~time alone
Days Off|쉬는 날|🧘|Daily Life|easy|sleeping in~short trips~housework~meeting friends~doing nothing
Sundays|일요일|☀️|Daily Life|easy|Sunday mornings~family meals~Sunday anxiety~weekly planning~quiet evenings
First Impressions|첫인상|👀|Personality|easy|meeting someone~body language~clothing~changing opinions~good introductions
Confidence|자신감|💪|Personality|medium|speaking up~building confidence~confident people~new situations~self-doubt
Introverts and Extroverts|내향인과 외향인|🔋|Personality|easy|social energy~large groups~quiet time~making friends~personality changes
Sense of Humor|유머 감각|😄|Personality|easy|funny people~inside jokes~sarcasm~different cultures~making people laugh
Pet Peeves|사소하지만 싫은 것|😤|Personality|easy|loud chewing~being late~messy spaces~phone manners~small annoyances
Embarrassing Moments|당황스러운 순간|😳|Life Experiences|easy|public mistakes~wrong messages~forgetting names~falling down~laughing later
Lucky Moments|운 좋은 순간|🍀|Life Experiences|easy|unexpected prizes~good timing~meeting someone~travel luck~small lucky days
Regrets|후회|🤔|Life Experiences|medium|missed chances~bad purchases~words said~lessons learned~doing things differently
Life Changes|삶의 변화|🦋|Life Experiences|medium|moving~new jobs~new relationships~changing routines~personal growth
New Experiences|새로운 경험|✨|Life Experiences|easy|trying something first~leaving comfort zones~learning skills~meeting people~future adventures`;

export const topicPracticeExpansionSeeds:TopicExpansionSeed[]=rows.trim().split("\n").map(row=>{
 const [title,ko,emoji,category,level,keywords]=row.split("|");
 return {title,ko,emoji,category:category as TopicPracticeCategory,level:level as TopicExpansionSeed["level"],keywords:keywords.split("~")};
});
