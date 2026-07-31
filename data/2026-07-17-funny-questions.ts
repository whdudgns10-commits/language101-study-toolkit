export const FUNNY_CATEGORY_META = [
  { id: "awkward-moments", label: "Awkward Moments" },
  { id: "dating-disasters", label: "Dating Disasters" },
  { id: "weird-habits", label: "Weird Habits" },
  { id: "food-confessions", label: "Food Confessions" },
  { id: "school-childhood", label: "School & Childhood" },
  { id: "work-adult-life", label: "Work & Adult Life" },
  { id: "travel-chaos", label: "Travel Chaos" },
  { id: "hypothetical-chaos", label: "Hypothetical Chaos" },
  { id: "friends-social-life", label: "Friends & Social Life" },
  { id: "random-personality", label: "Random Personality" },
] as const;

export type FunnyQuestionCategory = (typeof FUNNY_CATEGORY_META)[number]["id"];
export type FunnyQuestionLevel = "light" | "funny" | "wild";

export type FunnyQuestion = {
  id: string;
  category: FunnyQuestionCategory;
  level: FunnyQuestionLevel;
  question: string;
  followUps: [string, string];
  tags: string[];
};

const questionGroups: Record<FunnyQuestionCategory, string[]> = {
  "awkward-moments": [
    "What is the longest you have pretended to remember someone’s name?",
    "What is the most awkward message you have sent to the wrong person?",
    "When have you laughed even though you had no idea what was happening?",
    "What is the most embarrassing thing that has happened during a quiet moment?",
    "What happened when you entered the wrong room and tried to act normal?",
    "What is the strangest way you have accidentally greeted a stranger?",
    "When did you realize you had been calling someone by the wrong name?",
    "What is the funniest thing you have misheard in a serious conversation?",
    "What awkward silence felt much longer than it really was?",
    "What happened when your phone made a loud sound at the worst possible time?",
    "What is your most memorable elevator interaction with a stranger?",
    "What online meeting mistake would you never want to repeat?",
    "When has your phone screen revealed something harmless but embarrassing?",
    "What is the funniest excuse you used after arriving at the wrong place?",
    "What happened when you waved back at someone who was not waving at you?",
    "What important moment was interrupted by an unexpected laugh?",
    "When did you confidently answer a question nobody had asked you?",
    "What is the most awkward way you have tried to leave a conversation?",
    "What happened when you forgot how you knew someone?",
    "What simple introduction became unexpectedly complicated?",
    "If your most awkward public moment had a title, what would it be?",
    "What social mistake did you notice several hours too late?",
    "What is the most dramatic recovery you attempted after tripping or dropping something?",
    "When have you agreed with someone before realizing you misunderstood them?",
    "What harmless moment would make you disappear instantly if you could?",
  ],
  "dating-disasters": [
    "What is the fastest way someone could make a first date awkward?",
    "What romantic plan sounds good in a movie but terrible in real life?",
    "What is the funniest believable excuse for leaving a bad date early?",
    "What small texting mistake could create a huge misunderstanding?",
    "What is the worst place you can imagine for a first date?",
    "What dating advice sounds wise but is actually useless?",
    "What is the funniest difference two people could have in their date expectations?",
    "How could someone overprepare for a simple coffee date?",
    "What food is most dangerous to order when you are trying to look graceful?",
    "What harmless profile detail would make you ask many questions?",
    "What is the most confusing signal someone can send while flirting?",
    "What should people do when both expect the other person to plan the date?",
    "What romantic surprise has the greatest chance of going wrong?",
    "What is a polite way to recover after forgetting an important detail about someone?",
    "What would make a blind date arranged by friends especially funny?",
    "What texting habit creates unnecessary drama when people first meet?",
    "What is the most awkward way to discuss splitting a date bill?",
    "What date activity reveals someone’s personality surprisingly quickly?",
    "What is a dating rule people follow even though nobody understands it?",
    "How can two people rescue a date after the conversation suddenly stops?",
    "If a bad first date became a comedy, what scene would be in the trailer?",
    "What ridiculous misunderstanding could happen because someone replies too slowly?",
    "What romantic gesture would be charming from one person but strange from another?",
    "What would be the funniest accidental double-booking on a date?",
    "What dating disaster would probably become a great story a year later?",
  ],
  "weird-habits": [
    "What strange habit did you only notice after someone pointed it out?",
    "What completely unnecessary rule have you created for yourself?",
    "What do you always check twice even when you know it is fine?",
    "What is the weirdest thing you do while waiting for food?",
    "What harmless habit would you never want recorded on video?",
    "What order do you follow when eating a meal, and why does it matter?",
    "What object do you keep even though it has no practical value?",
    "What do you talk to when nobody else is around?",
    "What is unusual about the way you organize your room or desk?",
    "How many alarms do you set, and what story do they tell about you?",
    "What phone habit steals more of your time than you admit?",
    "What tiny routine makes your morning feel wrong when you skip it?",
    "What do you repeatedly watch even though you know every part?",
    "What is the strangest thing you do before falling asleep?",
    "What personal rule makes perfect sense only to you?",
    "What do you save for later but almost never use?",
    "What song or speech do you perform when you are alone?",
    "What everyday item are you strangely protective of?",
    "What habit appears whenever you are nervous or excited?",
    "What is your most unnecessary method for choosing what to wear?",
    "If your private routine became a public trend, which part would confuse everyone?",
    "What bizarre reward system have you invented to finish boring tasks?",
    "What harmless obsession could you give a ten-minute presentation about?",
    "What would a documentary crew find funniest about your daily routine?",
    "Which habit would be hardest to explain to someone from another planet?",
  ],
  "food-confessions": [
    "What food combination do you love but feel embarrassed to recommend?",
    "What is the worst meal you have ever cooked for yourself?",
    "What food do you pretend to enjoy because everyone else loves it?",
    "What is the most dramatic reaction you have had to spicy food?",
    "What is the strangest thing you have eaten because you were too hungry to care?",
    "What snack disappears too quickly when you are alone?",
    "What cooking shortcut would make a professional chef disappointed?",
    "What late-night food decision seemed brilliant at the time?",
    "What delivery mistake led to an unexpectedly memorable meal?",
    "What food have you confidently ordered without understanding the menu?",
    "When did you praise a meal mainly to be polite?",
    "What dish do you always make look less attractive than it tastes?",
    "What expired food have you examined for far too long before making a decision?",
    "What is the oldest mystery item you have discovered in a refrigerator?",
    "What food do you eat in an order that other people find strange?",
    "What simple recipe are you surprisingly unable to cook?",
    "What restaurant order have you regretted immediately?",
    "What food-related lie did you tell as a child?",
    "What ingredient do you secretly add far too much of?",
    "What meal would you choose if nobody could judge your choice?",
    "If your cooking failures had a restaurant, what would its signature dish be?",
    "What food would cause the funniest argument at a dinner party?",
    "What unusual food purchase would you defend in court?",
    "If your eating habits had a warning label, what would it say?",
    "What meal would become complete chaos if you had to cook it for twenty people?",
  ],
  "school-childhood": [
    "What is the funniest thing you believed was true as a child?",
    "What was the most ridiculous rule at your school?",
    "What childhood nickname would you never use now?",
    "What was your most embarrassing classroom moment?",
    "What job did you think would be easy when you were a child?",
    "What harmless trouble did you regularly get into at school?",
    "What school supply did you forget at the worst time?",
    "What strange game did you invent with friends as a child?",
    "What food from school lunch do you remember most clearly?",
    "What trend at your school would look ridiculous today?",
    "When did you accidentally call a teacher by the wrong title?",
    "What presentation mistake still makes you laugh?",
    "What subject did you misunderstand in a surprisingly creative way?",
    "What school trip moment became more memorable than the trip itself?",
    "What were you afraid of as a child that seems funny now?",
    "What excuse did you use when you had not done your homework?",
    "What classroom object became part of a legendary school story?",
    "What fashion choice from childhood deserves an explanation?",
    "What did adults say that you understood completely differently?",
    "What skill did you proudly show everyone even though it was not impressive?",
    "If your childhood self planned your life now, what would be most chaotic?",
    "What school memory would be funniest as a dramatic movie scene?",
    "What old school rule would be impossible to explain to students today?",
    "Which childhood invention did you believe would make you rich?",
    "If your classmates made awards about old memories, what would you win?",
  ],
  "work-adult-life": [
    "What part of being an adult feels like everyone is secretly pretending?",
    "What is the most useless thing you have spent money on?",
    "What work phrase do people use when they really mean something else?",
    "What is the most creative excuse you have heard for being late?",
    "What have you done at work while pretending to be busy?",
    "What adult responsibility would you happily give away forever?",
    "What purchase made sense in the store but nowhere else?",
    "What email mistake could become a workplace comedy?",
    "What happened when you misunderstood a piece of workplace language?",
    "What is the strangest question someone could ask in a job interview?",
    "How have you avoided using a coworker’s name because you forgot it?",
    "What remote-work moment reminded you that you were at home?",
    "What task sounds simple until you become responsible for it?",
    "What meeting could have been replaced by one sentence?",
    "What is the most confusing thing about taxes, bills, or paperwork?",
    "What professional skill do you mostly perform with confidence rather than knowledge?",
    "What harmless office habit would your coworkers recognize immediately?",
    "What impulse purchase best represents adult stress?",
    "What chore makes you feel strangely accomplished?",
    "What work outfit mistake would be difficult to recover from?",
    "If adulthood had customer support, what would you complain about first?",
    "What job title would describe what you actually do all day?",
    "If your bank account could send notifications with opinions, what would it say?",
    "What adult decision would be easier with a game-show audience?",
    "Which everyday responsibility would become an Olympic event in your life?",
  ],
  "travel-chaos": [
    "What is the funniest way you have gotten lost?",
    "What travel mistake became a good story later?",
    "What is the strangest thing you have packed for a trip?",
    "When have you looked most obviously like a tourist?",
    "What is the funniest misunderstanding you have had while traveling?",
    "What travel plan failed immediately but still became memorable?",
    "What weather did you prepare for completely incorrectly?",
    "What happened when a map app sent you somewhere unexpected?",
    "What item have you almost forgotten at the worst travel moment?",
    "What food did you order abroad without knowing what would arrive?",
    "What transportation mistake cost you the most time?",
    "What souvenir purchase made little sense after you returned home?",
    "What accommodation problem required the most creative solution?",
    "What phrase did you say incorrectly while trying to use another language?",
    "What moment made you check for your passport repeatedly?",
    "What travel companion habit becomes annoying after several days?",
    "What currency mistake made something seem much cheaper or more expensive?",
    "What question did you ask a local that sounded different from what you intended?",
    "What is the most unnecessary item you carried through an entire trip?",
    "What travel photo has the funniest story behind it?",
    "If your worst travel day became a tour package, what would it include?",
    "What destination would be hardest to visit with your usual travel habits?",
    "If airports gave awards, what embarrassing category might you win?",
    "What travel disaster would you rather experience with friends than alone?",
    "If your suitcase could describe the trip, what would it complain about?",
  ],
  "hypothetical-chaos": [
    "If you could pause time for one hour, what would you actually do?",
    "If animals could leave online reviews about humans, what would they complain about?",
    "If you had to replace handshakes with another greeting, what would you choose?",
    "If one useless skill could make you famous, which skill would you choose?",
    "If you could understand every language for one day, where would you go?",
    "If your life had background music, what would play during your morning?",
    "If you could speak with one type of animal, which conversation would be funniest?",
    "If you had to eat one meal for a month, how would you keep it interesting?",
    "If you met your younger self for ten minutes, what would surprise them most?",
    "If your phone disappeared for a day, what would you do first?",
    "If your thoughts appeared as subtitles for one day, when would you be in the most trouble?",
    "If your life had a laugh track, which moment would get the loudest reaction?",
    "If you could not tell a lie for one week, which situation would become hardest?",
    "If you switched lives with a celebrity for one day, what ordinary task would you try?",
    "If you could watch one memory like a movie, which scene would you choose?",
    "If you could call your future self for three minutes, what would you ask?",
    "If your home became a museum, which object would confuse visitors most?",
    "If everyone had a harmless superpower, which one would create the most chaos?",
    "If your week became a movie, what genre would it be?",
    "If you could make one annoying task disappear, what unexpected problem might follow?",
    "If every excuse became visible above your head, where would you avoid going?",
    "If your personality changed completely for a day, what would your friends notice first?",
    "If you had an invisible assistant with a bad sense of humor, what could go wrong?",
    "If your memories were searchable online, what search would embarrass you most?",
    "If one random decision controlled your day, what rule would create the best story?",
  ],
  "friends-social-life": [
    "What would your friends reveal about you if they had five minutes?",
    "What role do you naturally play on a group trip?",
    "What is the funniest argument you have had with a friend?",
    "What is something your friends never let you forget?",
    "Which friend would survive best in a ridiculous emergency, and why?",
    "What is the worst advice a friend has confidently given you?",
    "What group-chat mistake created the most confusion?",
    "What harmless nickname has the longest story behind it?",
    "What happened when friends remembered the same event completely differently?",
    "What game makes your group unexpectedly competitive?",
    "What item have you borrowed from a friend for far too long?",
    "What misunderstanding about a meeting place became a funny story?",
    "What habit would your closest friends recognize without seeing your name?",
    "What was your funniest attempt to impress a new group?",
    "What party moment did not go according to plan?",
    "What type of friend always arrives late with the best excuse?",
    "What unusual tradition does your friend group have?",
    "What is the strangest useful thing a friend has taught you?",
    "What simple plan became complicated because too many friends joined?",
    "What friend would you trust to choose your outfit for an important event?",
    "If your friend group were a comedy show, what character would you be?",
    "Which friend would accidentally become famous, and for what?",
    "If your group chat became public for one minute, what would need explaining?",
    "What ridiculous team challenge would reveal everyone’s true personality?",
    "If your friends planned a surprise based only on your habits, what would happen?",
  ],
  "random-personality": [
    "What completely useless skill are you strangely proud of?",
    "What small inconvenience makes you react far too dramatically?",
    "What opinion do you defend even though it does not really matter?",
    "What simple thing are you surprisingly bad at?",
    "What object best represents your personality, and why?",
    "What is the most ridiculous thing you would buy if you suddenly became rich?",
    "What content have you watched so many times that you could perform it?",
    "What harmless fear makes the least sense when you explain it?",
    "What excuse do you use so often that nobody believes it anymore?",
    "What activity makes you strangely competitive?",
    "What tiny achievement makes you feel unusually proud?",
    "What fashion choice seemed excellent at the time?",
    "What task wastes more of your time than it should?",
    "What everyday object do you have unusually strong opinions about?",
    "What is your personal logic for making a decision that nobody else understands?",
    "What compliment would be strange but accurate for you?",
    "What is the least impressive thing that can improve your mood?",
    "What ordinary situation makes you act like a completely different person?",
    "What would the title of your most common daydream be?",
    "What talent would your friends say you should never demonstrate publicly?",
    "If your personality came with instructions, what warning would appear first?",
    "If you became famous tomorrow, what old habit would surprise your fans?",
    "What minor problem would turn you into the villain of a comedy?",
    "If your inner voice had a celebrity narrator, who would make it funniest?",
    "What ridiculous challenge would reveal your strongest personality trait?",
  ],
};

const levelForIndex = (index: number): FunnyQuestionLevel =>
  index < 9 ? "light" : index < 20 ? "funny" : "wild";

export const funnyQuestions: FunnyQuestion[] = FUNNY_CATEGORY_META.flatMap(category =>
  questionGroups[category.id].map((question, index) => ({
    id: "",
    category: category.id,
    level: levelForIndex(index),
    question,
    followUps: (index % 2 === 0
      ? ["What detail makes that answer especially memorable?", "How did the other people involved react?"]
      : ["What happened next?", "Would you handle the same situation differently now?"]) as [string, string],
    tags: [category.id, levelForIndex(index), index < 9 ? "easy-story" : "conversation"],
  })),
).map((item, index) => ({
  ...item,
  id: `funny-question-${String(index + 1).padStart(3, "0")}`,
}));

export const funnyQuestionCategoryCounts = Object.fromEntries(
  FUNNY_CATEGORY_META.map(category => [
    category.id,
    funnyQuestions.filter(question => question.category === category.id).length,
  ]),
) as Record<FunnyQuestionCategory, number>;

export const funnyQuestionStats = {
  total: funnyQuestions.length,
  byCategory: funnyQuestionCategoryCounts,
  byLevel: Object.fromEntries(
    (["light", "funny", "wild"] as const).map(level => [
      level,
      funnyQuestions.filter(question => question.level === level).length,
    ]),
  ) as Record<FunnyQuestionLevel, number>,
};

export function validateFunnyQuestions(): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  const texts = new Set<string>();
  if (funnyQuestions.length !== 250) errors.push(`Expected 250 questions, received ${funnyQuestions.length}.`);
  funnyQuestions.forEach((item, index) => {
    const expectedId = `funny-question-${String(index + 1).padStart(3, "0")}`;
    const normalized = item.question.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim();
    if (item.id !== expectedId) errors.push(`Unexpected ID at position ${index + 1}.`);
    if (ids.has(item.id)) errors.push(`Duplicate ID: ${item.id}.`);
    if (texts.has(normalized)) errors.push(`Duplicate question: ${item.id}.`);
    if (!item.question.trim() || !item.question.endsWith("?")) errors.push(`Invalid question: ${item.id}.`);
    if (!FUNNY_CATEGORY_META.some(category => category.id === item.category)) errors.push(`Invalid category: ${item.id}.`);
    if (!["light", "funny", "wild"].includes(item.level)) errors.push(`Invalid level: ${item.id}.`);
    if (item.followUps.length < 1 || item.followUps.length > 2 || item.followUps.some(value => !value.trim())) {
      errors.push(`Invalid follow-ups: ${item.id}.`);
    }
    if (new Set(item.followUps).size !== item.followUps.length) errors.push(`Duplicate follow-up: ${item.id}.`);
    ids.add(item.id);
    texts.add(normalized);
  });
  for (const category of FUNNY_CATEGORY_META) {
    if (funnyQuestionCategoryCounts[category.id] !== 25) errors.push(`Expected 25 questions for ${category.id}.`);
  }
  return errors;
}

export const FUNNY_CATEGORIES = FUNNY_CATEGORY_META.map(category => category.id);
export type FunnyQuestionDifficulty = FunnyQuestionLevel;
