import { conversationTopics } from "@/data/conversation-topics";
import { discussionQuestions } from "@/data/discussion-questions";
import { roleplays } from "@/data/roleplays";
import { usefulExpressionContents } from "@/data/useful-expressions";
import { icebreakers } from "@/data/icebreakers";
import type { ContentCategory,ConversationContent } from "@/types/conversation-content";
export { chooseRandomContent,filterConversationContent } from "@/lib/conversation-content-rules";

const categoryMap:Record<(typeof conversationTopics)[number]["category"],ContentCategory>={"일상":"일상대화","여행":"여행","음식":"문화","문화":"문화","취미":"일상대화","일과 직장":"직장","워킹홀리데이":"여행","재미있는 질문":"재미있는 질문"};
const localTopics:ConversationContent[]=conversationTopics.map(item=>({id:`local-${item.id}`,activityIds:["funny-questions","ice-breaking-3","practice-of-expressing"],type:"topic",title:item.questionKo,category:categoryMap[item.category],level:"beginner",language:"en",groupSizes:["1:1","3~5명","그룹"],moods:item.category==="재미있는 질문"?["가볍게","파티용"]:["가볍게","친해지기"],prompt:item.question,followUpQuestions:["Why do you think so?","Can you give an example?","Has your answer changed over time?"],usefulExpressions:[{expression:"In my experience, ...",meaning:"제 경험으로는"},{expression:"The main reason is ...",meaning:"가장 큰 이유는"}],tips:["답변 뒤 상대에게 같은 질문을 자연스럽게 돌려주세요."],tags:[item.category]}));
export const allConversationContent:ConversationContent[]=[...localTopics,...discussionQuestions,...roleplays,...usefulExpressionContents,...icebreakers];
export const getActivityContent=(activityId:string)=>allConversationContent.filter(item=>item.activityIds.includes(activityId));
export const getContentById=(id:string)=>allConversationContent.find(item=>item.id===id);
