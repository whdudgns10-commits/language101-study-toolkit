export type GuessingWordsLevel="beginner"|"intermediate"|"advanced";
export type GuessingWordsTopic="daily"|"food"|"travel"|"people"|"places"|"objects"|"nature"|"work"|"learning"|"health"|"feelings"|"communication"|"society"|"technology"|"culture";
export type GuessingWord={id:string;word:string;level:GuessingWordsLevel;topic:GuessingWordsTopic;speakingQuestions:[string,string]};

type WordGroup={topic:GuessingWordsTopic;words:string[]};

const beginnerGroups:WordGroup[]=[
 {topic:"daily",words:["breakfast","weekend","birthday","vacation","morning","evening","shower","laundry","homework","shopping","exercise","sleep","schedule","holiday","party","picnic","hobby","music","movie","game"]},
 {topic:"food",words:["coffee","chicken","pizza","sandwich","salad","noodles","rice","bread","cheese","chocolate","banana","apple","orange","strawberry","watermelon","cookie","cake","soup","tea","restaurant"]},
 {topic:"travel",words:["airport","passport","subway","hotel","beach","camera","suitcase","ticket","train","airplane","bus","taxi","map","tourist","camping","journey","station","flight","bicycle","bridge"]},
 {topic:"people",words:["teacher","family","friend","neighbor","doctor","nurse","student","baby","parent","brother","sister","grandmother","grandfather","chef","driver","police officer","customer","guest","couple","team"]},
 {topic:"places",words:["hospital","school","library","bank","market","bakery","museum","park","office","cinema","pharmacy","kitchen","bathroom","bedroom","garden","gym","factory","farm","zoo","stadium"]},
 {topic:"objects",words:["umbrella","phone","computer","wallet","key","watch","mirror","pillow","blanket","bottle","glasses","chair","table","notebook","pencil","backpack","toothbrush","scissors","gift","refrigerator"]},
 {topic:"nature",words:["weather","mountain","river","ocean","forest","flower","tree","rain","snow","cloud","sunshine","moon","star","island","animal","dog","cat","bird","fish","horse"]},
 {topic:"work",words:["job","meeting","boss","company","uniform","money","email","project","interview","salary","break","coworker","calendar","document","store","service","workplace","manager","cashier","delivery"]},
 {topic:"learning",words:["English","language","question","answer","book","class","lesson","test","word","sentence","story","picture","dictionary","grammar","practice","mistake","idea","example","conversation","translation"]},
 {topic:"health",words:["medicine","headache","toothache","cold","fever","water","walking","running","swimming","soccer","tennis","basketball","yoga","healthy food","rest","energy","pain","bandage","ambulance","clinic visit"]},
 {topic:"feelings",words:["happy","sad","angry","tired","hungry","thirsty","excited","nervous","surprised","bored","afraid","proud","lonely","kind","funny","quiet","busy","lucky","worried","comfortable"]},
 {topic:"communication",words:["hello","goodbye","message","call","letter","name","address","joke","promise","secret","news","voice","smile","laugh","cry","help","advice","invitation","compliment","apology"]},
 {topic:"society",words:["country","city","village","street","traffic","festival","wedding","community","culture","tradition","flag","police","firefighter","post office","church","temple","restaurant menu","line","crowd","rule"]},
 {topic:"technology",words:["internet","website","password","screen","keyboard","mouse","video","photo","app","charger","battery","headphones","television","radio","online shopping","text message","social media","Wi-Fi","robot","printer"]},
 {topic:"culture",words:["song","dance","painting","actor","singer","concert","guitar","piano","drum","karaoke","comic book","cartoon","costume","photograph","recipe","souvenir","fireworks","performance","stage","audience"]},
];

const intermediateGroups:WordGroup[]=[
 {topic:"daily",words:["appointment","reservation","neighborhood","routine","errand","commute","housework","delivery fee","membership","subscription","recommendation","complaint","decision","habit","deadline","budget","permission","occasion","preference","convenience"]},
 {topic:"food",words:["ingredient","appetizer","beverage","cuisine","leftovers","portion","recipe book","vegetarian","allergy","seasoning","takeout","buffet","specialty","nutrition","seafood","grill","dessert menu","homemade meal","comfort food","table manners"]},
 {topic:"travel",words:["destination","accommodation","itinerary","departure","arrival","luggage allowance","customs","currency exchange","sightseeing","tour guide","hostel","landmark","souvenir shop","road trip","travel insurance","delayed flight","boarding pass","public transport","local market","day trip"]},
 {topic:"people",words:["personality","relationship","colleague","roommate","stranger","relative","partner","mentor","leader","volunteer","client","passenger","visitor","employee","employer","teammate","classmate","landlord","tenant","event host"]},
 {topic:"places",words:["neighborhood park","community center","shopping mall","concert hall","art gallery","train platform","waiting room","parking lot","conference room","food court","bookstore","department store","fitness center","hair salon","laundromat","courthouse","embassy","university campus","subway entrance","observation deck"]},
 {topic:"objects",words:["receipt","remote control","power bank","laptop stand","travel adapter","reusable bottle","shopping basket","name tag","business card","flash drive","seat belt","first-aid kit","alarm clock","coffee machine","vacuum cleaner","air conditioner","dishwasher","electric kettle","sunscreen","hand sanitizer"]},
 {topic:"nature",words:["environment","climate","pollution","recycling","wildlife","landscape","sunset","waterfall","volcano","earthquake","thunderstorm","heat wave","seasonal change","national park","hiking trail","ocean current","air quality","natural resource","endangered species","weather forecast"]},
 {topic:"work",words:["opportunity","achievement","challenge","promotion","workload","feedback","presentation","salary discussion","teamwork","responsibility","qualification","career path","remote work","job interview","training session","performance review","customer service","office culture","part-time job","business trip"]},
 {topic:"learning",words:["confidence","experience","communication","pronunciation","vocabulary","fluency","concentration","motivation","assignment","discussion","research","summary","explanation","instruction","presentation skill","study partner","online course","learning style","group project","final exam"]},
 {topic:"health",words:["symptom","treatment","recovery","prescription","checkup","insurance","emergency","stress relief","balanced diet","mental health","physical fitness","sleep schedule","medical advice","healthy lifestyle","food poisoning","muscle pain","breathing exercise","daily steps","sports injury","waiting list"]},
 {topic:"feelings",words:["disappointment","embarrassment","frustration","curiosity","gratitude","jealousy","relief","confidence boost","homesickness","excitement","patience","sympathy","trust","respect","regret","satisfaction","pressure","confusion","enthusiasm","calmness"]},
 {topic:"communication",words:["conversation starter","body language","eye contact","voice message","small talk","mispronunciation","follow-up question","personal opinion","honest answer","first impression","sense of humor","group chat","video call","public speaking","active listening","language barrier","polite request","friendly reminder","social invitation","thank-you note"]},
 {topic:"society",words:["family custom","generation","population","education system","public safety","local election","public service","social issue","cultural difference","national holiday","volunteer work","community event","public opinion","housing cost","work-life balance","equal opportunity","social responsibility","public transportation","city planning","local business"]},
 {topic:"technology",words:["account security","online privacy","software update","search engine","streaming service","video conference","digital payment","online review","notification","cloud storage","wireless connection","smart device","mobile application","online banking","screen time","artificial intelligence","virtual reality","online community","technical problem","data backup"]},
 {topic:"culture",words:["documentary","exhibition","stage production","celebrity","entertainment","subtitle","soundtrack","novel","photography","fashion trend","street art","music festival","traditional clothing","cultural heritage","movie review","fan community","live theater","dance performance","award ceremony","creative hobby"]},
];

const advancedGroups:WordGroup[]=[
 {topic:"daily",words:["prioritization","procrastination","adaptability","independence","self-discipline","time management","personal boundary","long-term planning","lifestyle adjustment","financial stability","decision fatigue","daily productivity","social expectation","personal commitment","work-life integration","unexpected expense","household responsibility","consumer choice","quality of life","life transition"]},
 {topic:"food",words:["sustainability","food insecurity","ethical consumption","culinary tradition","dietary restriction","food preservation","agricultural practice","supply chain","cultural appropriation","fine dining","plant-based diet","food waste","regional cuisine","consumer preference","nutritional deficiency","organic farming","processed food","portion control","flavor profile","culinary innovation"]},
 {topic:"travel",words:["cultural immersion","responsible tourism","overtourism","travel restriction","cross-cultural exchange","remote destination","urban exploration","environmental impact","visa requirement","cultural etiquette","language barrier abroad","travel accessibility","heritage tourism","digital nomadism","international mobility","tourism economy","border control","cultural adaptation","expatriate life","reverse culture shock"]},
 {topic:"people",words:["stereotype","reputation","influence","charisma","accountability","integrity","empathy","resilience","vulnerability","maturity","leadership style","social identity","personal bias","role model","peer pressure","emotional intelligence","mutual respect","conflict mediator","support network","professional network"]},
 {topic:"places",words:["metropolitan area","rural community","historical district","cultural institution","shared workspace","public infrastructure","residential complex","commercial district","protected habitat","industrial zone","pedestrian area","urban landmark","historic monument","community shelter","innovation hub","transportation network","public square","renewal project","border region","heritage site"]},
 {topic:"objects",words:["biometric passport","renewable battery","surveillance camera","assistive device","digital identity","protective equipment","emergency supply","wireless sensor","recycled material","autonomous vehicle","medical equipment","smart appliance","security system","virtual headset","solar panel","electric vehicle","portable generator","air purifier","translation device","wearable technology"]},
 {topic:"nature",words:["biodiversity","conservation","ecosystem","deforestation","renewable energy","carbon footprint","climate resilience","habitat loss","natural disaster","environmental policy","sustainable development","water scarcity","extreme weather","marine pollution","ecological balance","resource depletion","urban greenery","wildlife protection","climate migration","environmental awareness"]},
 {topic:"work",words:["negotiation","compromise","professionalism","delegation","collaboration","productivity","entrepreneurship","career advancement","organizational culture","workplace conflict","employee retention","performance incentive","strategic planning","professional development","ethical leadership","job satisfaction","corporate responsibility","competitive advantage","labor shortage","succession planning"]},
 {topic:"learning",words:["perspective","interpretation","assumption","critical thinking","media literacy","academic integrity","cognitive bias","lifelong learning","knowledge gap","educational inequality","language acquisition","intercultural competence","learning autonomy","analytical skill","creative thinking","problem-solving strategy","intellectual curiosity","constructive criticism","research methodology","information overload"]},
 {topic:"health",words:["preventive care","healthcare access","chronic condition","public health","medical ethics","psychological well-being","burnout prevention","health inequality","patient confidentiality","genetic testing","healthcare technology","treatment option","mental resilience","occupational health","informed consent","medical diagnosis","substance dependence","social isolation","emotional exhaustion","quality healthcare"]},
 {topic:"feelings",words:["ambivalence","resentment","contentment","insecurity","compassion","determination","overwhelm","self-awareness","emotional conflict","sense of belonging","fear of failure","personal fulfillment","social anxiety","moral discomfort","emotional attachment","inner conflict","self-esteem","emotional support","personal growth","uncertainty"]},
 {topic:"communication",words:["misunderstanding","persuasion","clarification","confrontation","constructive dialogue","nonverbal communication","cultural nuance","communication breakdown","public discourse","diplomatic response","conflict resolution","active participation","rhetorical question","social interaction","professional correspondence","sensitive topic","mutual understanding","communication strategy","open-ended question","cross-cultural communication"]},
 {topic:"society",words:["controversy","inequality","discrimination","diversity","inclusion","social mobility","demographic change","public policy","civic responsibility","cultural integration","social cohesion","economic disparity","freedom of expression","community engagement","social welfare","urbanization","globalization","public accountability","generational conflict","collective responsibility"]},
 {topic:"technology",words:["algorithm","automation","data privacy","misinformation","cybersecurity","digital divide","technological dependence","facial recognition","machine learning","online harassment","digital footprint","content moderation","intellectual property","technological innovation","information security","platform regulation","digital literacy","remote collaboration","automated decision","ethical technology"]},
 {topic:"culture",words:["cultural identity","cultural preservation","artistic expression","representation","cultural diversity","popular culture","creative industry","historical interpretation","cultural influence","artistic freedom","traditional craftsmanship","cultural stereotype","social commentary","literary criticism","cultural exchange","creative ownership","historical narrative","audience perception","artistic legacy","cultural globalization"]},
];

const questionTemplates:Record<GuessingWordsTopic,(word:string)=>[string,string]>={
 daily:word=>[`How does ${word} fit into your daily life?`,`What is one memorable experience you have had with ${word}?`],
 food:word=>[`What do you think about ${word}?`,`When or where would you usually choose ${word}?`],
 travel:word=>[`Have you ever used or experienced ${word} while traveling?`,`What advice would you give someone dealing with ${word}?`],
 people:word=>[`What qualities are important for a good ${word}?`,`Tell the group about a memorable ${word} you have met.`],
 places:word=>[`When was the last time you visited a ${word}?`,`What makes a good ${word} for you?`],
 objects:word=>[`How often do you use a ${word}?`,`What would be difficult without a ${word}?`],
 nature:word=>[`What experience have you had with ${word}?`,`Why is ${word} important or interesting to you?`],
 work:word=>[`How can ${word} affect someone's working life?`,`What is your own experience with ${word}?`],
 learning:word=>[`How is ${word} useful when learning a language?`,`What has helped you improve your ${word}?`],
 health:word=>[`Why is ${word} important for a healthy life?`,`What practical advice would you share about ${word}?`],
 feelings:word=>[`When do people usually feel ${word}?`,`What helps you deal with feeling ${word}?`],
 communication:word=>[`How can ${word} improve a conversation?`,`When have you experienced ${word} in real life?`],
 society:word=>[`How does ${word} affect your community?`,`What could make ${word} better in the future?`],
 technology:word=>[`How has ${word} changed everyday life?`,`What is one benefit or risk of ${word}?`],
 culture:word=>[`What do you enjoy or notice about ${word}?`,`How can ${word} connect people from different cultures?`],
};

function buildLevel(level:GuessingWordsLevel,groups:WordGroup[],offset:number):GuessingWord[]{
 let index=0;
 return groups.flatMap(group=>group.words.map(word=>{index+=1;return{id:`guessing-word-${String(offset+index).padStart(3,"0")}`,word,level,topic:group.topic,speakingQuestions:questionTemplates[group.topic](word)}}));
}

export const beginnerGuessingWords=buildLevel("beginner",beginnerGroups,0);
export const intermediateGuessingWords=buildLevel("intermediate",intermediateGroups,300);
export const advancedGuessingWords=buildLevel("advanced",advancedGroups,600);
export const guessingWords=[...beginnerGuessingWords,...intermediateGuessingWords,...advancedGuessingWords];
export const guessingWordsByLevel:Record<GuessingWordsLevel,GuessingWord[]>={beginner:beginnerGuessingWords,intermediate:intermediateGuessingWords,advanced:advancedGuessingWords};

export function validateGuessingWords(){
 const errors:string[]=[];
 for(const level of ["beginner","intermediate","advanced"] as const)if(guessingWordsByLevel[level].length!==300)errors.push(`${level} must contain exactly 300 words.`);
 if(guessingWords.length!==900)errors.push("The dataset must contain exactly 900 words.");
 const normalized=guessingWords.map(item=>item.word.trim().toLocaleLowerCase("en-US"));
 if(new Set(normalized).size!==900)errors.push("All words and phrases must be unique across levels.");
 if(new Set(guessingWords.map(item=>item.id)).size!==900)errors.push("All IDs must be unique.");
 for(const item of guessingWords){if(!item.word.trim())errors.push(`Missing word: ${item.id}`);if(!item.level)errors.push(`Missing level: ${item.id}`);if(item.speakingQuestions.length!==2||item.speakingQuestions.some(question=>!question.trim()))errors.push(`Missing speaking question: ${item.id}`)}
 return errors;
}

export const guessingWordsStats={beginner:beginnerGuessingWords.length,intermediate:intermediateGuessingWords.length,advanced:advancedGuessingWords.length,total:guessingWords.length,unique:new Set(guessingWords.map(item=>item.word.toLowerCase())).size,missingQuestions:guessingWords.filter(item=>item.speakingQuestions.some(question=>!question.trim())).length};
