import type { Expression,ExpressionLevel } from "@/types/expression";
import type { SupportedLanguage } from "@/types/language";

type Seed={expression:string;meaning:string;example:string;translation:string;tip:string};
const source:Record<Exclude<SupportedLanguage,"en">,Seed[]>={
 ja:[
  {expression:"予定通りで大丈夫？",meaning:"Are we still meeting as planned?",example:"明日の会議は予定通りで大丈夫？",translation:"Is tomorrow's meeting still going ahead as planned?",tip:"予定に変更がないか、自然に確認するときに使います。"},
  {expression:"なるほど。",meaning:"I see. / That makes sense.",example:"なるほど、そういうことだったんですね。",translation:"I see. So that is what happened.",tip:"説明を理解したときの自然な相づちです。"},
  {expression:"気にしないで。",meaning:"Don't worry about it.",example:"少し遅れても気にしないで。",translation:"Don't worry if you're a little late.",tip:"相手の謝罪や心配をやわらげるときに使います。"},
  {expression:"いいですね。",meaning:"Sounds good.",example:"駅で会いましょう。いいですね。",translation:"Let's meet at the station. Sounds good.",tip:"提案に自然に賛成するときに使います。"},
  {expression:"ちょっと考えさせて。",meaning:"Let me think about it.",example:"大事なことなので、ちょっと考えさせて。",translation:"It's important, so let me think about it.",tip:"すぐに決めず、考える時間がほしいときに使います。"},
  {expression:"楽しみにしています。",meaning:"I'm looking forward to it.",example:"来週会えるのを楽しみにしています。",translation:"I'm looking forward to seeing you next week.",tip:"これからの予定への期待を伝える表現です。"},
  {expression:"お任せします。",meaning:"I'll leave it up to you.",example:"お店はお任せします。",translation:"I'll leave the restaurant choice up to you.",tip:"相手に決定を任せるときの丁寧な表現です。"},
  {expression:"それもありですね。",meaning:"That's an option too.",example:"電車で行くのもありですね。",translation:"Taking the train is an option too.",tip:"別の案を前向きに受け入れる会話表現です。"},
  {expression:"無理しないでね。",meaning:"Don't push yourself.",example:"今日は疲れているなら、無理しないでね。",translation:"If you're tired today, don't push yourself.",tip:"相手を気遣う親しい表現です。"},
  {expression:"たしかに。",meaning:"That's true. / Good point.",example:"たしかに、その方法のほうが早いですね。",translation:"That's true. That way is faster.",tip:"相手の意見に納得したときに使います。"},
  {expression:"また連絡します。",meaning:"I'll get back to you.",example:"予定を確認して、また連絡します。",translation:"I'll check my schedule and get back to you.",tip:"確認後に連絡すると約束するときに使います。"},
  {expression:"助かりました。",meaning:"That was a big help.",example:"手伝ってくれて、本当に助かりました。",translation:"Thanks for helping. That was a big help.",tip:"具体的に助かった気持ちを伝える自然な感謝表現です。"}
 ],
 zh:[
  {expression:"还是按原计划吗？",meaning:"Are we still meeting as planned?",example:"我们明天还是按原计划见面吗？",translation:"Are we still meeting as planned tomorrow?",tip:"自然地确认计划是否有变化时使用。"},
  {expression:"有道理。",meaning:"That makes sense.",example:"你说得有道理，我再想想。",translation:"That makes sense. I'll think about it again.",tip:"认可对方观点时常用。"},
  {expression:"没关系。",meaning:"No worries. / It's okay.",example:"晚几分钟也没关系。",translation:"It's okay if you're a few minutes late.",tip:"回应道歉或安慰对方时使用。"},
  {expression:"听起来不错。",meaning:"Sounds good.",example:"周末一起吃饭？听起来不错。",translation:"Dinner together this weekend? Sounds good.",tip:"轻松地接受建议时使用。"},
  {expression:"让我想想。",meaning:"Let me think.",example:"让我想想晚饭吃什么。",translation:"Let me think about what to have for dinner.",tip:"需要一点思考时间时使用。"},
  {expression:"我很期待。",meaning:"I'm looking forward to it.",example:"我很期待下周的旅行。",translation:"I'm looking forward to next week's trip.",tip:"表达对未来安排的期待。"},
  {expression:"你来决定吧。",meaning:"It's up to you.",example:"去哪里吃饭，你来决定吧。",translation:"You decide where we should eat.",tip:"把决定权交给对方时使用。"},
  {expression:"也可以。",meaning:"That works too.",example:"坐地铁去也可以。",translation:"Taking the subway works too.",tip:"接受另一个可行方案时使用。"},
  {expression:"别太勉强。",meaning:"Don't push yourself.",example:"如果累了就休息，别太勉强。",translation:"Rest if you're tired. Don't push yourself.",tip:"关心对方身体或情绪时使用。"},
  {expression:"确实。",meaning:"That's true. / Indeed.",example:"确实，这个办法更方便。",translation:"That's true. This way is more convenient.",tip:"同意对方的重要观点时使用。"},
  {expression:"我再联系你。",meaning:"I'll get back to you.",example:"我确认时间后再联系你。",translation:"I'll get back to you after checking the time.",tip:"表示确认后会再次联系。"},
  {expression:"帮大忙了。",meaning:"That was a big help.",example:"谢谢你，真的帮大忙了。",translation:"Thank you. That was a big help.",tip:"感谢别人提供了实际帮助时使用。"}
 ],
 ko:[
  {expression:"예정대로 하는 거죠?",meaning:"Are we still meeting as planned?",example:"우리 내일 예정대로 만나는 거죠?",translation:"Are we still meeting as planned tomorrow?",tip:"약속이나 일정에 변경이 없는지 자연스럽게 확인할 때 써요."},
  {expression:"말이 되네요.",meaning:"That makes sense.",example:"설명을 들으니 이제 말이 되네요.",translation:"Now that you've explained it, that makes sense.",tip:"상대의 설명이나 의견을 이해했을 때 써요."},
  {expression:"신경 쓰지 마세요.",meaning:"Don't worry about it.",example:"조금 늦어도 신경 쓰지 마세요.",translation:"Don't worry if you're a little late.",tip:"상대의 사과나 걱정을 편하게 받아줄 때 써요."},
  {expression:"좋은데요.",meaning:"Sounds good.",example:"주말에 같이 가요. 좋은데요.",translation:"Let's go together this weekend. Sounds good.",tip:"제안에 자연스럽게 동의할 때 써요."},
  {expression:"좀 생각해 볼게요.",meaning:"Let me think about it.",example:"중요한 일이니 좀 생각해 볼게요.",translation:"It's important, so let me think about it.",tip:"결정하기 전에 시간이 필요할 때 써요."},
  {expression:"기대하고 있어요.",meaning:"I'm looking forward to it.",example:"다음 주 여행을 기대하고 있어요.",translation:"I'm looking forward to next week's trip.",tip:"앞으로 있을 일에 대한 기대를 전할 때 써요."},
  {expression:"맡길게요.",meaning:"I'll leave it up to you.",example:"식당 선택은 맡길게요.",translation:"I'll leave the restaurant choice up to you.",tip:"상대에게 결정을 맡길 때 쓰는 편한 표현이에요."},
  {expression:"그것도 괜찮네요.",meaning:"That works too.",example:"지하철로 가는 것도 괜찮네요.",translation:"Taking the subway works too.",tip:"다른 제안을 긍정적으로 받아들일 때 써요."},
  {expression:"너무 무리하지 마세요.",meaning:"Don't push yourself.",example:"피곤하면 쉬고 너무 무리하지 마세요.",translation:"Rest if you're tired and don't push yourself.",tip:"상대를 걱정하고 배려할 때 써요."},
  {expression:"그러게요.",meaning:"That's true. / You're right.",example:"그러게요, 시간이 정말 빠르네요.",translation:"You're right. Time really flies.",tip:"상대의 말에 자연스럽게 공감할 때 써요."},
  {expression:"다시 연락드릴게요.",meaning:"I'll get back to you.",example:"일정을 확인하고 다시 연락드릴게요.",translation:"I'll check my schedule and get back to you.",tip:"확인 후 다시 답하겠다고 정중하게 말할 때 써요."},
  {expression:"큰 도움이 됐어요.",meaning:"That was a big help.",example:"도와주셔서 큰 도움이 됐어요.",translation:"Thank you. That was a big help.",tip:"상대의 도움에 구체적으로 감사할 때 써요."}
 ]
};

const levels:ExpressionLevel[]=["beginner","beginner","beginner","beginner","intermediate","beginner","intermediate","intermediate","intermediate","beginner","intermediate","beginner"];
const makeExpressions=(language:Exclude<SupportedLanguage,"en">):Expression[]=>source[language].map((item,index)=>({id:`learning-${language}-${index+1}`,expression:item.expression,koreanMeaning:item.meaning,example:item.example,exampleTranslation:item.translation,usageTip:item.tip,similarExpressions:[],level:levels[index],category:"conversation",formality:"neutral",frequency:"common",tags:["learning-language",language],recommendedForPractice:true,practicePriority:2,practiceSituations:["conversation"]}));
export const learningExpressionsByLanguage:Record<Exclude<SupportedLanguage,"en">,Expression[]>={ja:makeExpressions("ja"),zh:makeExpressions("zh"),ko:makeExpressions("ko")};
