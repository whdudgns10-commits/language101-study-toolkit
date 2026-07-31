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
    ],
  },
];

const questionFrames = [
  (topic: string) => `What comes to mind when you think about ${topic}?`,
  (topic: string) => `What personal experience have you had with ${topic}?`,
  (topic: string) => `What makes ${topic} meaningful or interesting to you?`,
  (topic: string) => `How has your view of ${topic} changed over time?`,
  (topic: string) => `What story would you share about ${topic}?`,
] as const;

const followUpFrames: [string, string][] = [
  ["What is the first example you can think of?", "Would your answer have been different five years ago?"],
  ["What happened, and how did you feel?", "What did you learn from that experience?"],
  ["Why does that matter to you?", "Do you think other people would agree?"],
  ["What caused your perspective to change?", "How might your view change in the future?"],
  ["What detail makes that story memorable?", "What question would you ask someone with a different story?"],
];

const difficultyForVariant = (variant: number): ConversationStarterDifficulty =>
  variant < 2 ? "easy" : variant < 4 ? "medium" : "deep";

export const conversationStarters: ConversationStarter[] = topicGroups.flatMap(group =>
  group.topics.flatMap(topicSet =>
    topicSet.map((topic, variant) => ({
      id: "",
      category: group.category,
      difficulty: difficultyForVariant(variant),
      question: questionFrames[variant](topic),
      followUps: followUpFrames[variant],
      tags: [...group.tags, topic.split(" ").slice(-2).join("-")],
    })),
  ),
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
  if (conversationStarters.length !== 250) errors.push("Expected exactly 250 questions.");
  if (new Set(conversationStarters.map(item => item.id)).size !== 250) errors.push("Question IDs must be unique.");
  conversationStarters.forEach((item, index) => {
    const expected = `conversation-starter-${String(index + 1).padStart(3, "0")}`;
    if (item.id !== expected) errors.push(`Unexpected ID at position ${index + 1}.`);
    if (!item.question.trim() || item.followUps.length < 1 || item.followUps.length > 2) {
      errors.push(`Incomplete question: ${item.id}`);
    }
  });
  return errors;
}

// Compatibility aliases for the existing route and imports.
export const iceBreakingQuestions = conversationStarters;
export const iceCategories = conversationStarterCategories;
export type IceDepth = ConversationStarterDifficulty;
