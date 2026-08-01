export const conversationStarterCategories = [
  "Dating & Romance",
  "Career & Work",
  "School Days",
  "Language Learning",
  "Friendship & Relationships",
  "Food & Drinks",
  "Hobbies & Free Time",
  "Culture & Traditions",
  "Travel & Life Abroad",
  "Personality & Everyday Life",
  "Dreams & Future",
  "Money & Lifestyle",
  "Technology & Social Media",
  "Entertainment & Pop Culture",
  "Challenges & Life Lessons",
] as const;

export type ConversationStarterCategory = (typeof conversationStarterCategories)[number];
export type ConversationStarterDifficulty = "easy" | "medium" | "deep";

export type ConversationStarter = {
  id: string;
  category: ConversationStarterCategory;
  difficulty: ConversationStarterDifficulty;
  question: string;
  followUps: [string, string];
  tags: string[];
};

type TopicGroup = {
  category: ConversationStarterCategory;
  tags: string[];
  topics: [string, string, string, string, string][];
};

const topicGroups: TopicGroup[] = [
  {
    category: "Dating & Romance",
    tags: ["dating", "romance"],
    topics: [
      ["a memorable first date", "a quality that makes someone attractive", "the best way to show affection", "a relationship lesson worth sharing", "an ideal weekend for two"],
      ["a funny dating misunderstanding", "a green flag you notice quickly", "the role of friendship in romance", "how couples can handle disagreements", "a thoughtful date that costs very little"],
      ["a romantic tradition you enjoy", "the importance of shared interests", "a kind way to turn someone down", "what builds trust over time", "a place that feels romantic to you"],
      ["a dating rule that feels outdated", "a trait you value more with age", "how to support a partner's goals", "what healthy independence looks like", "a song or movie that shaped your idea of love"],
      ["a small gesture you never forget", "the value of honest communication", "how culture influences dating", "what commitment means to you", "a question people should ask before dating seriously"],
      ["a lesson from someone else's relationship", "a meaningful compliment", "the balance between chemistry and compatibility", "how people change through relationships", "what makes a partnership last"],
    ],
  },
  {
    category: "Career & Work",
    tags: ["career", "work"],
    topics: [
      ["a job you wanted as a child", "a skill every workplace needs", "the best advice from a coworker", "a difficult work decision", "your ideal workday"],
      ["a job that deserves more respect", "a professional skill you want to learn", "a manager who brings out your best", "how to recover from a work mistake", "a workplace perk that matters"],
      ["a career you would try for one year", "the value of teamwork", "a useful way to give feedback", "when it is right to change careers", "a productive morning routine"],
      ["a surprising lesson from a job", "a strength you bring to a team", "how technology may change your work", "the meaning of career success", "a workplace culture you would enjoy"],
      ["a task you are proud of completing", "a skill schools should teach for work", "how to set boundaries at work", "the trade-off between money and meaning", "a person whose career inspires you"],
      ["a workplace that feels enjoyable", "a great teammate", "career advice that has helped you", "a meaningful professional risk", "the future of flexible work"],
    ],
  },
  {
    category: "School Days",
    tags: ["school", "memories"],
    topics: [
      ["a teacher you still remember", "a subject that was unexpectedly useful", "the funniest school memory", "a lesson learned outside class", "your ideal school day"],
      ["a school rule you would change", "a class everyone should take", "a friendship formed at school", "how grades affect motivation", "a school event worth repeating"],
      ["a project you enjoyed", "a subject you wish you had studied", "a moment you felt proud at school", "what makes a great teacher", "a place at school you liked"],
      ["a mistake that taught you something", "the value of group projects", "how school prepared you for adulthood", "what students need besides academics", "a school tradition you remember"],
      ["a book that influenced you at school", "a talent you discovered as a student", "the pressure students face today", "how learning styles differ", "advice for your younger student self"],
      ["a school day you would relive", "a lesson that still affects your choices", "a class that encouraged curiosity", "the best way to motivate students", "a school experience everyone should have"],
    ],
  },
  {
    category: "Language Learning",
    tags: ["language", "learning"],
    topics: [
      ["the first phrase you learned in another language", "a pronunciation challenge", "a helpful study habit", "a moment language skills helped you", "your ideal language exchange"],
      ["a word that is hard to translate", "the best way to remember vocabulary", "a funny language mistake", "how confidence affects speaking", "a language you want to learn next"],
      ["a movie or show useful for learners", "a grammar point you finally understood", "the role of correction", "how culture changes word meaning", "a study tool you recommend"],
      ["a conversation that made you improve", "a way to practice without studying", "the fear of making mistakes", "what fluency means to you", "a useful expression you learned recently"],
      ["a language-learning goal", "the value of speaking with strangers", "how accents shape identity", "why people stop learning languages", "advice for a complete beginner"],
      ["a phrase that changed a conversation", "a mistake that improved your language skills", "the most useful kind of practice", "a sign that someone is becoming fluent", "a language-learning milestone worth celebrating"],
    ],
  },
  {
    category: "Friendship & Relationships",
    tags: ["friendship", "relationships"],
    topics: [
      ["how you met a close friend", "a quality you value in friends", "a time a friend surprised you", "how friendships change with age", "your favorite way to spend time with friends"],
      ["a friendship across cultures", "the meaning of loyalty", "a helpful way to resolve conflict", "when friends grow apart", "a tradition shared with friends"],
      ["a friend who influenced you", "the value of different personalities", "a time you supported someone", "how to make friends in a new city", "a group memory that makes you laugh"],
      ["a small act that strengthens friendship", "the role of honesty", "how social media affects closeness", "what makes someone easy to trust", "a friendship lesson learned the hard way"],
      ["a friend you would travel with", "the balance between listening and advising", "how to welcome a new person", "why adult friendships can be difficult", "a question you wish friends asked more often"],
      ["a meaningful conversation with a friend", "the importance of keeping promises", "a healthy relationship boundary", "how friendships survive distance", "what being a good friend means"],
    ],
  },
  {
    category: "Food & Drinks",
    tags: ["food", "drinks"],
    topics: [
      ["a meal that reminds you of home", "a food you learned to enjoy", "the best dish to share", "how food connects people", "your perfect breakfast"],
      ["a memorable restaurant experience", "a snack from your childhood", "a cooking skill worth learning", "the impact of food trends", "a drink you recommend"],
      ["a dish you can cook well", "a flavor combination that surprised you", "a food tradition in your family", "how travel changes your taste", "an ideal dinner party menu"],
      ["a popular food you do not understand", "the best comfort food", "a meal connected to a celebration", "whether presentation changes taste", "a local food visitors should try"],
      ["a food you would eat every week", "a cooking mistake that became a story", "the value of eating together", "how diet choices reflect values", "a cuisine you want to explore"],
      ["a dish that represents your hometown", "a drink connected to a good memory", "a food recommendation for a visitor", "how meals shape community", "a recipe you want to pass on"],
    ],
  },
  {
    category: "Hobbies & Free Time",
    tags: ["hobbies", "free-time"],
    topics: [
      ["a hobby that helps you relax", "an activity you want to try", "a hobby you had as a child", "why free time matters", "your ideal slow weekend"],
      ["a creative skill you admire", "an inexpensive hobby", "a hobby that connects people", "how hobbies shape identity", "an activity that makes time disappear"],
      ["a hobby you could teach", "a challenge you enjoy", "the value of doing nothing", "how technology changed leisure", "a hobby suited to your personality"],
      ["an outdoor activity you recommend", "a collection you would enjoy", "a hobby you gave up", "why adults need play", "a perfect rainy-day activity"],
      ["a recent way you spent free time", "a skill that requires patience", "a social hobby versus a solo hobby", "how to make time for interests", "a hobby worth trying while traveling"],
      ["an activity that makes you lose track of time", "a skill you taught yourself", "a hobby that could become a career", "the best way to discover a new interest", "a free-time habit you want to protect"],
    ],
  },
  {
    category: "Culture & Traditions",
    tags: ["culture", "traditions"],
    topics: [
      ["a tradition you look forward to", "a custom visitors should know", "a celebration that brings people together", "how traditions change over time", "a cultural experience you recommend"],
      ["a family tradition", "a greeting custom", "a festival you want to attend", "the value of preserving traditions", "a cultural habit that surprised you"],
      ["a traditional art or craft", "a rule of politeness in your culture", "a holiday memory", "how food expresses culture", "a custom you would share abroad"],
      ["a tradition younger people are changing", "a symbol with cultural meaning", "a story passed through generations", "how globalization affects identity", "a culture you want to understand better"],
      ["a cultural misunderstanding", "a tradition you created yourself", "the role of language in culture", "how to appreciate culture respectfully", "a local event that represents your community"],
      ["a tradition from your culture you value most", "a social rule visitors should know", "a cultural practice worth preserving", "how migration shapes traditions", "a custom you learned from another culture"],
    ],
  },
  {
    category: "Travel & Life Abroad",
    tags: ["travel", "life-abroad"],
    topics: [
      ["a trip that changed your perspective", "a place that exceeded expectations", "a useful travel lesson", "how living abroad changes people", "your ideal one-month destination"],
      ["a travel mistake you can laugh about", "a city you would revisit", "the best way to meet locals", "the hardest part of moving abroad", "an essential item in your bag"],
      ["a memorable journey", "a place tourists often miss", "a cultural adjustment abroad", "whether travel makes people open-minded", "a dream route or road trip"],
      ["a time you felt lost while traveling", "a home comfort you miss abroad", "a responsible way to travel", "what makes somewhere feel like home", "advice for a first solo trip"],
      ["a local experience you look for while traveling", "a conversation with someone abroad", "a place that challenged your assumptions", "how to build a life in a new country", "a travel plan you would change next time"],
      ["a country you could live in for a year", "a moment you felt at home abroad", "the value of traveling slowly", "how language affects life overseas", "a destination that taught you something"],
    ],
  },
  {
    category: "Personality & Everyday Life",
    tags: ["personality", "everyday-life"],
    topics: [
      ["a small thing that improves your day", "a habit you are proud of", "a situation that brings out your best", "how your personality has changed", "your ideal ordinary day"],
      ["a decision you make quickly", "a daily task you secretly enjoy", "a compliment that stayed with you", "what helps people become resilient", "a simple pleasure you recommend"],
      ["a routine you want to improve", "a trait people misunderstand about you", "a moment you felt brave", "how you handle uncertainty", "a personal rule you live by"],
      ["a recent reason you smiled", "a habit you admire in others", "a choice that taught you something", "what makes a life feel balanced", "a question that reveals personality"],
      ["the best part of your day", "a small habit that makes life better", "what would make tomorrow a great day", "a routine that reflects your personality", "a simple change with a big effect"],
      ["a way you recharge after a long day", "a trait you are learning to accept", "a personal value that guides you", "how your environment affects your mood", "an everyday moment you appreciate more now"],
    ],
  },
  {
    category: "Dreams & Future",
    tags: ["dreams", "future"],
    topics: [
      ["a dream you have not shared often", "a place you hope to live someday", "a skill your future self will need", "how you imagine life in ten years", "a future achievement worth celebrating"],
      ["a childhood dream that still matters", "a goal that feels exciting", "someone who inspires your future plans", "how uncertainty affects ambition", "a change you hope to see in the world"],
      ["a project you would start with unlimited time", "a future trip you are planning", "a habit that supports a long-term goal", "what success may mean later in life", "a dream that has changed over time"],
      ["an invention you hope exists soon", "a community you want to build", "a risk your future self may thank you for", "how people can prepare for change", "a letter you would write to your future self"],
      ["a goal that requires patience", "a future career possibility", "something you hope never changes", "how technology may shape everyday life", "a promise you want to keep to yourself"],
      ["a bucket-list experience", "a future family tradition", "a cause you want to support", "how you decide which dream to pursue", "the kind of person you hope to become"],
    ],
  },
  {
    category: "Money & Lifestyle",
    tags: ["money", "lifestyle"],
    topics: [
      ["the best thing money can buy", "a purchase you never regretted", "a simple lifestyle you admire", "how money affects freedom", "an experience worth saving for"],
      ["a money lesson learned early", "a luxury that feels worthwhile", "the difference between wants and needs", "how lifestyle choices reflect priorities", "a budget habit that helps"],
      ["a purchase that taught you something", "the value of sharing resources", "a financial goal that feels meaningful", "how advertising changes spending", "a free activity that feels special"],
      ["a possession you could live without", "a service worth paying more for", "how people define a comfortable life", "whether experiences matter more than things", "a lifestyle trend you question"],
      ["a gift that mattered more than its price", "a time saving mattered", "the role of money in relationships", "how social media shapes lifestyle expectations", "a practical money skill schools should teach"],
      ["a small expense that improves daily life", "a financial risk people should understand", "what enough means to you", "how location changes living costs", "a lifestyle choice you want to make intentionally"],
    ],
  },
  {
    category: "Technology & Social Media",
    tags: ["technology", "social-media"],
    topics: [
      ["an app you use every day", "a technology that improved your life", "the best use of social media", "how online habits affect attention", "a digital tool you recommend"],
      ["a feature you wish phones had", "an online community that helps people", "a time technology caused confusion", "how privacy should work online", "a device you could stop using"],
      ["a social media trend you enjoyed", "a technology skill everyone needs", "the value of taking digital breaks", "how algorithms shape opinions", "an invention that feels ordinary now"],
      ["a memorable online friendship", "a task artificial intelligence could help with", "a rule for healthy phone use", "how technology changes communication", "a platform you would redesign"],
      ["a piece of old technology you miss", "a useful online learning resource", "the problem with constant notifications", "how virtual spaces affect identity", "a future technology you are curious about"],
      ["a time the internet solved a problem", "a digital habit you want to change", "the difference between online and offline connection", "how creators influence culture", "a technology choice people may regret"],
    ],
  },
  {
    category: "Entertainment & Pop Culture",
    tags: ["entertainment", "pop-culture"],
    topics: [
      ["a movie you can watch repeatedly", "a song connected to a memory", "a celebrity who uses influence well", "how entertainment shapes conversation", "a show everyone should try"],
      ["a character you understand deeply", "a live performance you remember", "a trend that became unexpectedly popular", "why people enjoy celebrity news", "a book that deserves an adaptation"],
      ["a film that changed your opinion", "a song that improves your mood", "a fandom that creates community", "how streaming changed entertainment", "an artist you recently discovered"],
      ["a popular show you could not enjoy", "a fictional world you would visit", "a cultural moment people still discuss", "what makes entertainment timeless", "a performance you wish you had seen"],
      ["a character you would invite to dinner", "a genre you grew to appreciate", "a piece of entertainment from another culture", "how subtitles affect viewing", "a story that deserves a sequel"],
      ["a guilty pleasure you happily admit", "a soundtrack that tells a story", "a pop-culture debate you find interesting", "how memes create shared language", "an entertainer whose career surprised you"],
    ],
  },
  {
    category: "Challenges & Life Lessons",
    tags: ["challenges", "life-lessons"],
    topics: [
      ["a challenge that made you stronger", "a mistake you are grateful for", "advice you learned through experience", "how people recover from setbacks", "a difficult choice that clarified your values"],
      ["a fear you have faced", "a lesson that took time to understand", "someone who helped during a hard period", "how failure can change direction", "a challenge you would accept again"],
      ["a time patience paid off", "a habit you had to unlearn", "a conversation that changed you", "how people know when to keep trying", "a problem that revealed a strength"],
      ["a moment you asked for help", "a lesson from an unexpected person", "a boundary you learned to set", "how disappointment can create growth", "a risk that taught you courage"],
      ["a difficult beginning that became easier", "a belief you changed", "a time preparation mattered", "how people can learn from regret", "a lesson you want younger people to know"],
      ["a challenge that brought people together", "a time you surprised yourself", "the value of starting over", "how humor helps during difficult moments", "a life lesson you are still learning"],
    ],
  },
];

const lightTopics: Record<ConversationStarterCategory, string[]> = {
  "Dating & Romance":["blind dates","group dates","first impressions","your ideal type","celebrity crushes","texting a date","first-date places","confessing feelings","long-distance dating","dating apps","romantic surprises","dating someone older","dating someone younger","couple anniversaries","personal time while dating"],
  "Career & Work":["your first part-time job","your childhood dream job","working from home","morning commutes","a good boss","lunch breaks","funny work mistakes","changing careers","jobs you would avoid","company dinners","your dream job","surviving Mondays","office clothes","work messages","life after work"],
  "School Days":["your favorite subject","your least favorite subject","school uniforms","school lunches","being late for class","school clubs","funny school memories","college group dates","school festivals","a memorable teacher","sleeping in class","childhood dream jobs","school trips","class presentations","homework excuses"],
  "Language Learning":["studying English","difficult English skills","hard English words","favorite English expressions","watching shows with subtitles","funny English mistakes","easy conversation topics","English names","speaking English often","remembering new words","making foreign friends","English accents","language exchanges","English videos","using English while traveling"],
  "Friendship & Relationships":["meeting your best friend","contacting close friends","having a few close friends","making new friends","weekends with friends","traveling with friends","being a good friend","friends from other countries","funny things friends do","group chats","solving small arguments","birthday gifts for friends","introducing two friends","old school friends","making friends as an adult"],
  "Food & Drinks":["food you eat every week","food you avoid","spicy food","late-night snacks","delivery food","daily coffee","cafe drinks","cooking at home","Korean food for visitors","strange food combinations","eating alone","convenience-store food","favorite desserts","breakfast habits","trying food abroad"],
  "Hobbies & Free Time":["your current hobby","a hobby you want to try","weekend plans","indoor activities","outdoor activities","favorite exercise","video games","YouTube videos","karaoke","recent movies","relaxing after work","taking photos","shopping for fun","reading books","short trips"],
  "Culture & Traditions":["favorite holidays","birthday celebrations","weddings","dating culture","workplace social events","special-day food","age when meeting people","Korean customs","common gifts","welcoming guests","New Year traditions","table manners","traditional clothes","holiday games","culture shocks"],
  "Travel & Life Abroad":["countries you visited","your next trip","solo travel","trips with friends","living abroad","working holidays","great travel memories","missing a flight","packing for a trip","hotels and guesthouses","food while traveling","funny travel mistakes","language problems abroad","tourist attractions","long stays abroad"],
  "Personality & Everyday Life":["being a morning person","making plans","setting alarms","favorite phone apps","keeping your room clean","online shopping","sleeping enough","relieving stress","your MBTI","other people's first impressions","small daily happiness","spending time alone","daily routines","cleaning habits","making quick decisions"],
  "Dreams & Future":["your goal this year","your bucket list","a new skill","a future home city","plans for five years from now","taking a year off","living in another country","something you want to buy","a new challenge","your ideal future","a dream trip","your future job","a home you want","retirement plans","a class you want to take"],
  "Money & Lifestyle":["your biggest expense","saving money","impulse purchases","things worth spending on","subscription services","lottery tickets","comparing prices","expensive hobbies","online shopping","happy purchases","delivery fees","travel budgets","secondhand shopping","using coupons","paying by card"],
  "Technology & Social Media":["your most-used app","time on social media","posting on Instagram","favorite online videos","replying to messages","changing profile photos","AI tools","a day without your phone","daily screen time","calls and text messages","your latest photo","short videos","online shopping apps","digital breaks","phone notifications"],
  "Entertainment & Pop Culture":["your favorite celebrity","Korean actors","a drama you watch now","favorite idols","songs you play these days","concert experiences","movies you rewatch","celebrities you want to meet","YouTube channels","reality shows","karaoke songs","favorite comedians","childhood cartoons","movie snacks","fan merchandise"],
  "Challenges & Life Lessons":["a current challenge","trying a diet","a difficult exercise","a funny mistake","presenting in English","a hobby you quickly quit","learning a new skill","traveling alone","a small proud moment","trying something again","learning to drive","a cooking failure","being late","facing a small fear","starting a workout routine"],
};

const questionFrames = [
  (topic:string)=>`What is your opinion about ${topic}?`,
  (topic:string)=>`Tell us about an experience with ${topic}.`,
  (topic:string)=>`What do you like about ${topic}?`,
  (topic:string)=>`What do you dislike about ${topic}?`,
  (topic:string)=>`What is one question you have about ${topic}?`,
  (topic:string)=>`What is a funny memory related to ${topic}?`,
  (topic:string)=>`When did you last talk about ${topic}?`,
  (topic:string)=>`Who would you talk to about ${topic}?`,
  (topic:string)=>`Would you like to know more about ${topic}? Why?`,
  (topic:string)=>`Is ${topic} part of your daily life? Why?`,
] as const;

const followUpFrames: [string,string][] = [
  ["Why did you choose that?","Can you give us an example?"],
  ["When did it happen?","Would you do it again?"],
  ["Who was with you?","What happened next?"],
  ["What do you enjoy about it?","Has your answer always been the same?"],
  ["What do they usually say?","Do your friends agree with you?"],
  ["Why do you like that place?","When did you last go there?"],
  ["When do you usually do it?","Would you like to do it more often?"],
  ["What surprised you?","How did you react?"],
  ["What would you try first?","Who would you invite?"],
  ["Why do you prefer that?","What is the best part?"],
];

const difficultyForPosition=(categoryIndex:number,position:number):ConversationStarterDifficulty=>{
  const easyLimit=categoryIndex<8?20:19;
  if(position<easyLimit)return "easy";
  if(position<easyLimit+9)return "medium";
  return "deep";
};

export const conversationStarters: ConversationStarter[] = conversationStarterCategories.flatMap((category,categoryIndex)=>
  lightTopics[category].flatMap((topic,topicIndex)=>[0,1].map(variant=>{
    const position=topicIndex*2+variant;
    const frameIndex=position%questionFrames.length;
    return {id:"",category,difficulty:difficultyForPosition(categoryIndex,position),question:questionFrames[frameIndex](topic),followUps:followUpFrames[frameIndex],tags:[category.toLowerCase().replaceAll(" ","-"),...topic.split(" ").slice(-2)]};
  })),
).map((item, index) => ({
  ...item,
  id: `conversation-starter-${String(index + 1).padStart(3, "0")}`,
}));

export const conversationStarterCategoryCounts = Object.fromEntries(
  conversationStarterCategories.map(category => [
    category,
    conversationStarters.filter(item => item.category === category).length,
  ]),
) as Record<ConversationStarterCategory, number>;

export function validateConversationStarters(): string[] {
  const errors: string[] = [];
  if (topicGroups.length !== conversationStarterCategories.length) errors.push("Legacy category coverage changed unexpectedly.");
  if (conversationStarters.length !== 450) errors.push("Expected exactly 450 questions.");
  if (new Set(conversationStarters.map(item => item.id)).size !== 450) errors.push("Question IDs must be unique.");
  if (new Set(conversationStarters.map(item => item.question.trim().toLowerCase())).size !== conversationStarters.length) {
    errors.push("Questions must be unique.");
  }
  conversationStarters.forEach((item, index) => {
    const expected = `conversation-starter-${String(index + 1).padStart(3, "0")}`;
    if (item.id !== expected) errors.push(`Unexpected ID at position ${index + 1}.`);
    const normalized = [item.question, ...item.followUps].map(value => value.trim().toLowerCase());
    if (!item.question.trim() || item.followUps.length !== 2 || item.followUps.some(value => !value.trim())) {
      errors.push(`Incomplete question: ${item.id}`);
    }
    if (item.question.split(/\s+/).length > 14) errors.push(`Question is too long: ${item.id}`);
    if (new Set(normalized).size !== normalized.length) errors.push(`Repeated prompt: ${item.id}`);
    if (!conversationStarterCategories.includes(item.category)) errors.push(`Invalid category: ${item.id}`);
    if (!["easy", "medium", "deep"].includes(item.difficulty)) errors.push(`Invalid difficulty: ${item.id}`);
  });
  conversationStarterCategories.forEach(category => {
    if (conversationStarterCategoryCounts[category] !== 30) errors.push(`Expected 30 questions for ${category}.`);
  });
  const distribution={easy:0,medium:0,deep:0};
  conversationStarters.forEach(item=>distribution[item.difficulty]++);
  if(distribution.easy!==293||distribution.medium!==135||distribution.deep!==22) errors.push("Unexpected difficulty distribution.");
  return errors;
}

// Compatibility aliases for the existing route and imports.
export const iceBreakingQuestions = conversationStarters;
export const iceCategories = conversationStarterCategories;
export type IceDepth = ConversationStarterDifficulty;
