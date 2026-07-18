export type RankItCategory="travel"|"food"|"daily-life"|"relationships"|"technology"|"entertainment"|"work"|"money"|"education"|"hobbies"|"sports"|"health"|"personality"|"future"|"random-fun";
export type RankItDifficulty="beginner"|"intermediate"|"advanced";
export type RankItLanguage="en"|"ko"|"zh"|"ja";
type Localized=Record<RankItLanguage,string>;
export type RankItTopic={id:string;title:Localized;prompt:Localized;options:Array<{id:string;label:Localized}>;category:RankItCategory;difficulty:RankItDifficulty;followUps:Record<RankItLanguage,string[]>;funChallenge:Localized};

const raw=`Best Travel Destinations|Japan,South Korea,Italy,Australia,Canada
Best Cities for a First International Trip|Seoul,Tokyo,Paris,Bangkok,Singapore
Best Beach Destinations|Bali,Hawaii,Phuket,Maldives,Gold Coast
Best Places for a Honeymoon|Maldives,Santorini,Bali,Hawaii,Swiss Alps
Best Ways to Travel|Plane,Train,Car,Bus,Cruise Ship
Most Important Travel Items|Passport,Phone,Money,Clothes,Medicine
Best Types of Accommodation|Luxury Hotel,Guesthouse,Airbnb,Hostel,Camping
Best Vacation Activities|Sightseeing,Shopping,Relaxing,Eating,Adventure Sports
Best Reasons to Travel|Food,Culture,Nature,Meeting People,Relaxation
Best Places for a Weekend Trip|Beach,Mountains,Big City,Countryside,Theme Park
Best World Cuisines|Korean,Japanese,Italian,Thai,Mexican
Best Korean Foods|Samgyeopsal,Bibimbap,Tteokbokki,Fried Chicken,Kimchi Stew
Best Japanese Foods|Sushi,Ramen,Tempura,Udon,Yakitori
Best Fast Foods|Burger,Pizza,Fried Chicken,Sandwich,Tacos
Best Desserts|Ice Cream,Cheesecake,Brownies,Donuts,Tiramisu
Best Midnight Snacks|Ramen,Fried Chicken,Pizza,Ice Cream,Tteokbokki
Best Breakfast Foods|Eggs,Toast,Cereal,Rice,Fruit
Best Coffee Drinks|Americano,Latte,Cappuccino,Mocha,Cold Brew
Best Bubble Tea Flavors|Brown Sugar,Taro,Matcha,Mango,Milk Tea
Most Overrated Foods|Truffle,Caviar,Avocado Toast,Macarons,Steak
Best Ways to Spend a Weekend|Sleeping,Traveling,Meeting Friends,Exercising,Watching Shows
Best Ways to Relax|Sleeping,Listening to Music,Walking,Watching Netflix,Taking a Bath
Most Important Morning Habits|Breakfast,Exercise,Coffee,Planning,Sleeping Longer
Most Useful Phone Apps|Maps,Messenger,Banking,YouTube,Calendar
Hardest Things to Live Without|Phone,Internet,Coffee,Music,Air Conditioning
Best Household Chores|Cooking,Laundry,Cleaning,Shopping,Washing Dishes
Worst Household Chores|Cleaning the Bathroom,Washing Dishes,Taking Out Trash,Laundry,Vacuuming
Best Weather|Sunny,Snowy,Rainy,Cloudy,Windy
Best Seasons|Spring,Summer,Autumn,Winter,Rainy Season
Best Times of Day|Early Morning,Late Morning,Afternoon,Evening,Late Night
Most Important Qualities in a Friend|Honesty,Humor,Loyalty,Kindness,Reliability
Best First-Date Ideas|Cafe,Dinner,Picnic,Museum,Bowling
Most Important Qualities in a Partner|Trust,Humor,Kindness,Communication,Ambition
Best Ways to Show Affection|Compliments,Gifts,Quality Time,Helping,Physical Affection
Best Gifts to Receive|Cash,Experience,Clothes,Food,Handmade Gift
Best Group Activities|Traveling,Eating,Board Games,Karaoke,Sports
Best Conversation Topics|Travel,Food,Movies,Relationships,Future Goals
Best Ways to Make New Friends|Language Exchange,Work,School,Hobbies,Social Media
Most Important First Impressions|Smile,Clothes,Voice,Manners,Confidence
Best Ways to Apologize|Face-to-Face,Text Message,Phone Call,Gift,Written Letter
Most Useful Technologies|Smartphone,Internet,Artificial Intelligence,GPS,Online Banking
Best Social Media Platforms|Instagram,YouTube,TikTok,X,Facebook
Best Streaming Services|Netflix,Disney+,YouTube,Prime Video,Apple TV+
Most Useful AI Tools|ChatGPT,Gemini,Claude,Copilot,Perplexity
Best Smartphone Features|Camera,Battery,Speed,Screen,Storage
Technologies Most Likely to Change the Future|AI,Robots,Virtual Reality,Space Travel,Self-Driving Cars
Best Ways to Communicate|Face-to-Face,Phone Call,Text,Video Call,Email
Most Annoying Online Behaviors|Leaving Messages on Read,Spam,Oversharing,Trolling,Voice Messages
Best Things About the Internet|Information,Entertainment,Communication,Shopping,Remote Work
Worst Things About Smartphones|Addiction,Distraction,Privacy Problems,Cost,Social Comparison
Best Movie Genres|Comedy,Action,Romance,Horror,Science Fiction
Best TV Show Genres|Drama,Reality,Comedy,Documentary,Thriller
Best Types of Music|Pop,Hip-Hop,Rock,R&B,Electronic
Best Ways to Watch a Movie|Cinema,Television,Laptop,Tablet,Phone
Best Fictional Superpowers|Teleportation,Flying,Invisibility,Mind Reading,Time Travel
Best Types of Games|Video Games,Board Games,Card Games,Sports,Mobile Games
Best Karaoke Song Types|Ballads,K-pop,Pop,Rock,Dance Songs
Best Entertainment for a Long Flight|Movies,Music,Books,Games,Sleeping
Best Reasons to Attend a Festival|Music,Food,Friends,Atmosphere,Photos
Best Types of Live Performances|Concert,Musical,Play,Comedy Show,Dance Performance
Most Important Job Benefits|Salary,Work-Life Balance,Job Security,Growth,Good Coworkers
Best Work Environments|Office,Home,Cafe,Coworking Space,Outdoors
Most Important Leadership Qualities|Communication,Confidence,Fairness,Experience,Creativity
Best Ways to Motivate Employees|Higher Salary,Praise,Flexible Hours,Promotion,Team Events
Best Dream Jobs|Business Owner,Actor,Travel Creator,Professional Athlete,Teacher
Best Reasons to Change Jobs|Better Salary,Better Culture,Career Growth,Shorter Commute,Less Stress
Most Useful Workplace Skills|Communication,Technology,Leadership,Time Management,Creativity
Best Ways to Spend a Lunch Break|Eating with Coworkers,Walking,Sleeping,Watching Videos,Working
Worst Workplace Problems|Bad Boss,Low Salary,Long Hours,Difficult Coworkers,Boring Tasks
Best Ways to Become Successful|Hard Work,Talent,Connections,Education,Luck
Best Things to Buy with $100|Clothes,Food,Experience,Electronics,Savings
Best Things to Do with Lottery Winnings|Buy a Home,Travel,Invest,Help Family,Quit Working
Most Important Things to Save Money For|Home,Travel,Retirement,Education,Emergencies
Best Ways to Spend Extra Money|Travel,Food,Shopping,Hobbies,Investment
Worst Things to Waste Money On|Luxury Brands,Delivery Fees,Games,Alcohol,Unused Subscriptions
Most Valuable School Subjects|English,Mathematics,Science,History,Physical Education
Best Ways to Learn English|Speaking,Watching Videos,Reading,Writing,Vocabulary Study
Most Useful Skills to Learn|English,Cooking,Driving,Coding,Public Speaking
Best Study Environments|Library,Cafe,Home,Study Room,Outdoors
Best Ways to Remember New Vocabulary|Conversation,Flashcards,Writing,Videos,Repetition
Best Hobbies|Traveling,Exercise,Reading,Gaming,Cooking
Best Sports to Play|Soccer,Basketball,Tennis,Swimming,Badminton
Best Outdoor Activities|Hiking,Camping,Cycling,Surfing,Fishing
Best Indoor Activities|Gaming,Cooking,Reading,Watching Movies,Drawing
Best Musical Instruments to Learn|Piano,Guitar,Drums,Violin,Saxophone
Best Pets|Dog,Cat,Rabbit,Bird,Hamster
Best Animals to Be for One Day|Eagle,Dolphin,Lion,Dog,Cat
Best Exercise for Beginners|Walking,Swimming,Yoga,Cycling,Weight Training
Best Ways to Stay Healthy|Exercise,Healthy Food,Sleep,Less Stress,Regular Checkups
Best Ways to Improve Your Mood|Music,Exercise,Food,Friends,Sleep
Most Important Personality Traits|Kindness,Confidence,Humor,Honesty,Patience
Best Personal Strengths|Creativity,Discipline,Communication,Courage,Adaptability
Most Important Life Goals|Happiness,Money,Family,Career,Freedom
Best Ages to Be|10,20,30,40,60
Best Things About Being an Adult|Freedom,Money,Relationships,Travel,Independence
Best Superpowers for Daily Life|Teleportation,Freezing Time,Mind Reading,Invisibility,Super Speed
Best Things to Take to a Desert Island|Water Filter,Knife,Tent,Phone,Friend
Best People to Have on a Survival Team|Doctor,Engineer,Chef,Athlete,Comedian
Best Things to Make Free for Everyone|Healthcare,Education,Public Transport,Housing,Internet
Most Important Things for a Happy Life|Health,Relationships,Money,Purpose,Freedom`;

const local=(en:string,kind:"title"|"option"|"prompt"="option"):Localized=>kind==="prompt"?{en,ko:"가장 좋은 것부터 가장 낮은 것까지 순위를 정해보세요.",zh:"请从最好到最差进行排序。",ja:"最も良いものから順にランキングしてください。"}:kind==="title"?{en,ko:`${en} 순위 정하기`,zh:`${en} 排名`,ja:`${en}ランキング`}:{en,ko:en,zh:en,ja:en};
const categoryFor=(index:number):RankItCategory=>index<10?"travel":index<20?"food":index<30?"daily-life":index<40?"relationships":index<50?"technology":index<60?"entertainment":index<70?"work":index<75?"money":index<80?"education":index<81?"hobbies":index<83?"sports":index<90?"health":index<95?"personality":index<99?"random-fun":"future";
const difficultyFor=(index:number):RankItDifficulty=>index<30||index>=75&&index<90?"beginner":index<70||index>=90&&index<95?"intermediate":"advanced";
const challenges=[
  ["Explain your ranking in exactly 30 seconds.","30초 안에 순위를 설명해보세요.","请在30秒内说明你的排名。","30秒でランキングを説明しましょう。"],
  ["Defend your number five choice.","5위 선택을 옹호해보세요.","为你的第五名选择辩护。","5位の選択を弁護しましょう。"],
  ["Convince someone to swap their top two.","다른 사람의 1위와 2위를 바꾸도록 설득해보세요.","说服某人交换前两名。","誰かの1位と2位を入れ替えるよう説得しましょう。"],
  ["The group must agree on one final ranking.","그룹이 하나의 최종 순위에 합의해보세요.","小组必须就最终排名达成一致。","グループで一つの最終ランキングに合意しましょう。"],
] as const;

export const rankItTopics:RankItTopic[]=raw.trim().split("\n").map((line,index)=>{const [title,optionText]=line.split("|");const options=optionText.split(",");const challenge=challenges[index%challenges.length];return{id:`rank-it-${String(index+1).padStart(3,"0")}`,title:local(title,"title"),prompt:local("Rank these from best to worst.","prompt"),options:options.map((label,optionIndex)=>({id:`rank-it-${index+1}-option-${optionIndex+1}`,label:local(label)})),category:categoryFor(index),difficulty:difficultyFor(index),followUps:{en:[`Why did you rank ${options[0]} highest?`,`Why did you place ${options[4]} lower?`,`Which two choices in “${title}” were hardest to compare?`,`What experience influenced your ranking?`,`Would your ranking change in five years?`],ko:[`${options[0]}을 가장 높게 둔 이유는 무엇인가요?`,`${options[4]}을 더 낮게 둔 이유는 무엇인가요?`,`“${title}”에서 가장 비교하기 어려웠던 두 가지는 무엇인가요?`,`어떤 경험이 이 순위에 영향을 주었나요?`,`5년 뒤에는 순위가 달라질까요?`],zh:[`为什么把${options[0]}排在最高？`,`为什么把${options[4]}排得较低？`,`“${title}”中哪两个选项最难比较？`,`什么经历影响了你的排名？`,`五年后你的排名会改变吗？`],ja:[`${options[0]}を最上位にした理由は何ですか？`,`${options[4]}を低くした理由は何ですか？`,`「${title}」で比較が最も難しかった二つは？`,`どんな経験がランキングに影響しましたか？`,`5年後にはランキングが変わりますか？`]},funChallenge:{en:challenge[0],ko:challenge[1],zh:challenge[2],ja:challenge[3]}}});

export const RANK_IT_CATEGORIES=["travel","food","daily-life","relationships","technology","entertainment","work","money","education","hobbies","sports","health","personality","future","random-fun"] as const;
