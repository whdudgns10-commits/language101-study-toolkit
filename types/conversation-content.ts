export type ContentLanguage="en"|"ja"|"zh"|"ko";
export type ContentLevel="beginner"|"intermediate"|"advanced";
export type ContentCategory="아이스브레이킹"|"일상대화"|"여행"|"연애"|"직장"|"문화"|"토론"|"역할극"|"재미있는 질문"|"깊은 대화";
export type GroupSize="1:1"|"3~5명"|"그룹";
export type ContentMood="가볍게"|"친해지기"|"진지하게"|"토론용"|"파티용";
export type ConversationContent={id:string;activityIds:string[];type:"topic"|"question"|"roleplay"|"expression"|"icebreaker";title:string;category:ContentCategory;level:ContentLevel;language:ContentLanguage;groupSizes:GroupSize[];moods:ContentMood[];prompt:string;followUpQuestions:string[];usefulExpressions:{expression:string;meaning?:string;example?:string}[];tips?:string[];tags?:string[]};
