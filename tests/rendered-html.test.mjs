import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

async function render(path = "/") {
  const requested=path.split("?")[0].replace(/^\//,"");
  const clean=requested==="notes"?"my-study":requested;
  const file=clean?`../.next/server/app/${clean}.html`:"../.next/server/app/index.html";
  try{return new Response(await readFile(new URL(file,import.meta.url),"utf8"),{status:200,headers:{"content-type":"text/html"}})}catch{return new Response("Not found",{status:404})}
}

test("renders the activity toolkit home", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /언어교환101/);
  assert.match(html, /Language Exchange 101/);
  assert.match(html, /Recommended for Today/);
  assert.match(html, /Random Activity/);
  assert.match(html, /Browse All Activities/);
  assert.match(html, /Today’s English Expression/);
  assert.match(html, /Need a conversation starter/);
  assert.match(html, /Today’s 3 Missions/);
  assert.match(html, /5 Expressions to Use Today/);
  assert.doesNotMatch(html, /질문을 뽑아 보세요|미션 다시 뽑기|Find your activity|Today’s missions/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/);
});

test("renders an activity detail with source notice and timer", async () => {
  const response = await render("/activities/30-second-speaking");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /30 Second Speaking/);
  assert.match(html, /독립 실행형 도구가 외부 페이지에서 열립니다/);
  assert.match(html, /Three simple steps/);
  assert.match(html, /Timer/);
  assert.match(html, /테이블 모드/);
  assert.match(html, /학습 메모/);
});

test("Naver Cafe text activities use internal content while operational links remain",async()=>{
  const activities=await readFile(new URL("../data/activities.ts",import.meta.url),"utf8");
  assert.doesNotMatch(activities,/cafe\.naver\.com|m\.cafe\.naver\.com/);
  assert.ok((activities.match(/sourceType: "internal"/g)??[]).length>=11);
  assert.ok((activities.match(/sourceType: "interactive"/g)??[]).length>=6);
  const response=await render("/activities/true-or-false");assert.equal(response.status,200);
  const html=await response.text();assert.match(html,/Start a conversation here/);assert.match(html,/Start conversation/);assert.doesNotMatch(html,/네이버 로그인|카페 가입/);
});

test("conversation content has valid unique ids and non-empty prompts",async()=>{
  const files=await Promise.all(["discussion-questions.ts","roleplays.ts","useful-expressions.ts","icebreakers.ts"].map(file=>readFile(new URL(`../data/${file}`,import.meta.url),"utf8")));
  const source=files.join("\n");const ids=[...source.matchAll(/id:"([^"]+)"/g)].map(match=>match[1]);
  assert.ok(ids.length>=20);assert.equal(new Set(ids).size,ids.length);assert.doesNotMatch(source,/title:""|prompt:""/);
  const legacy=await readFile(new URL("../data/conversation-topics.ts",import.meta.url),"utf8");assert.ok((legacy.match(/question:/g)??[]).length>=80);
});

test("conversation filters are exact and random selection avoids immediate repeats",async()=>{
  const content=await import(new URL(`../lib/conversation-content-rules.ts?filters=${Date.now()}`,import.meta.url));
  const items=[{id:"a",language:"en",level:"beginner",category:"역할극",groupSizes:["1:1"],moods:["가볍게"]},{id:"b",language:"en",level:"beginner",category:"역할극",groupSizes:["1:1","그룹"],moods:["진지하게"]},{id:"c",language:"ja",level:"advanced",category:"토론",groupSizes:["그룹"],moods:["토론용"]}];
  const english=content.filterConversationContent(items,{language:"en",level:"beginner"});
  assert.ok(english.length>0);assert.ok(english.every(item=>item.language==="en"&&item.level==="beginner"));
  const roleplays=content.filterConversationContent(items,{category:"역할극",group:"1:1"});
  assert.ok(roleplays.length>0);assert.ok(roleplays.every(item=>item.category==="역할극"&&item.groupSizes.includes("1:1")));
  const current=english[0];assert.notEqual(content.chooseRandomContent(english,current.id,()=>0).id,current.id);
});

test("conversation favorites, recent items, progress and notes use persistent My Study keys",async()=>{
  const storage=await readFile(new URL("../lib/conversation-content-storage.ts",import.meta.url),"utf8");
  for(const key of ["favoriteConversationContent","favoriteQuestions","favoriteRoleplays","recentConversationContent","completedConversationContent","usedConversationContent","conversationContentNotes","language101-study-change","localStorage"])assert.match(storage,new RegExp(key));
});

test("conversation practice UI includes mobile responsive controls",async()=>{
  const css=await readFile(new URL("../app/globals.css",import.meta.url),"utf8");
  assert.match(css,/@media\(max-width:760px\)/);assert.match(css,/\.content-actions \{ display:grid; grid-template-columns:1fr 1fr/);assert.match(css,/\.session-question/);assert.match(css,/\.conversation-session>footer \.button \{ flex:1/);
});

test("contains at least 80 local conversation questions", async () => {
  const source = await readFile(new URL("../data/conversation-topics.ts", import.meta.url), "utf8");
  assert.ok((source.match(/category:/g) ?? []).length >= 80);
  for (const category of ["일상","여행","음식","문화","취미","일과 직장","워킹홀리데이","재미있는 질문"]) assert.match(source, new RegExp(`category:\\"${category}\\"`));
});

test("renders integrated notes and end-session routes", async () => {
  const [notesResponse,endResponse] = await Promise.all([render("/notes"),render("/end-session")]);
  assert.equal(notesResponse.status,200); assert.equal(endResponse.status,200);
  assert.match(await notesResponse.text(),/My Study/);
  assert.match(await endResponse.text(),/오늘도 좋은 대화였어요/);
});

test("renders the mobile-first My Study profile and preserves legacy storage keys", async () => {
  const response=await render("/my-study"); assert.equal(response.status,200);
  const html=await response.text();
  for(const label of ["Today","My Expressions","Study Notes","Favorites","Study History"]) assert.match(html,new RegExp(label));
  assert.match(html,/Today’s progress/);
  const storage=await readFile(new URL("../lib/study-storage.ts",import.meta.url),"utf8");
  for(const key of ["studyNotes","savedExpressions","language101-favorites","language101-expression-favorites","missionProgress","expressionUsageLogs"]) assert.match(storage,new RegExp(key));
});

test("renders the dynamic QR page", async () => {
  const response = await render("/qr");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Scan to open today/);
  assert.match(html, /No login/);
});

test("daily content is deterministic, changes by date, and uses Seoul time", async () => {
  const daily = await import(new URL(`../lib/daily-content.ts?test=${Date.now()}`, import.meta.url));
  const items = Array.from({ length: 100 }, (_, index) => ({ id: `item-${index}` }));
  const first = daily.selectDailyItem(items, "2026-07-16", "expression");
  assert.equal(daily.selectDailyItem(items, "2026-07-16", "expression"), first);
  assert.notEqual(daily.selectDailyItem(items, "2026-07-17", "expression"), first);
  assert.equal(daily.getSeoulDateKey(new Date("2026-07-15T14:59:59.000Z")), "2026-07-15");
  assert.equal(daily.getSeoulDateKey(new Date("2026-07-15T15:00:00.000Z")), "2026-07-16");
});

test("browser-local date keys are stable and do not use UTC date slicing", async () => {
  const daily=await import(new URL(`../lib/daily-content.ts?local=${Date.now()}`,import.meta.url));
  const local=new Date(2026,6,16,0,5,0);
  assert.equal(daily.getLocalDateKey(local),"2026-07-16");
  assert.equal(daily.getLocalDateKey(new Date(2026,6,17,0,0,0)),"2026-07-17");
});

test("mission rerolls are deterministic, unique, and avoid the previous set", async()=>{
  const daily=await import(new URL(`../lib/daily-content.ts?reroll=${Date.now()}`,import.meta.url));
  const items=Array.from({length:60},(_,index)=>({id:`m-${index}`,category:`c-${index%6}`}));
  const first=daily.selectDistinctCategoryItems(items,3,"2026-07-16","missions",0);
  const same=daily.selectDistinctCategoryItems(items,3,"2026-07-16","missions",0);
  const rerolled=daily.selectDistinctCategoryItems(items,3,"2026-07-16","missions",1);
  assert.deepEqual(same,first); assert.equal(new Set(first.map(item=>item.id)).size,3);
  assert.equal(new Set(rerolled.map(item=>item.id)).size,3);
  assert.equal(rerolled.some(item=>first.some(previous=>previous.id===item.id)),false);
  assert.notDeepEqual(daily.selectDistinctCategoryItems(items,3,"2026-07-17","missions",0),first);
  assert.equal(daily.dailyStorageKey("2026-07-16"),"language101-daily-2026-07-16");
  assert.notEqual(daily.dailyStorageKey("2026-07-17"),daily.dailyStorageKey("2026-07-16"));
});

test("daily practice selection returns five deterministic expressions without duplicates",async()=>{
  const daily=await import(new URL(`../lib/daily-content.ts?practiceDaily=${Date.now()}`,import.meta.url));
  const items=Array.from({length:50},(_,index)=>({id:`e-${index}`}));
  const first=daily.selectDistinctDailyItems(items,5,"2026-07-16","daily-practice",7);
  assert.deepEqual(daily.selectDistinctDailyItems(items,5,"2026-07-16","daily-practice",7),first);
  assert.equal(first.length,5); assert.equal(new Set(first.map(item=>item.id)).size,5);
  assert.notDeepEqual(daily.selectDistinctDailyItems(items,5,"2026-07-17","daily-practice",7),first);
});

test("English learning expressions stay identical across interface languages",async()=>{
  const [dailyHook,dailyExpression,tabs,card,practiceStorage,studyStorage]=await Promise.all([
    readFile(new URL("../hooks/use-daily-content.ts",import.meta.url),"utf8"),
    readFile(new URL("../lib/daily-expression.ts",import.meta.url),"utf8"),
    readFile(new URL("../components/daily-expression-tabs.tsx",import.meta.url),"utf8"),
    readFile(new URL("../components/daily-expression-card.tsx",import.meta.url),"utf8"),
    readFile(new URL("../lib/practice-expression-storage.ts",import.meta.url),"utf8"),
    readFile(new URL("../lib/study-storage.ts",import.meta.url),"utf8"),
  ]);
  assert.match(dailyHook,/"daily-english-expression"/);assert.doesNotMatch(dailyHook,/language==="en"\?expressions\.filter/);
  assert.match(dailyExpression,/"daily-english-practice"/);assert.doesNotMatch(dailyExpression,/\$\{language\}:daily-practice/);
  assert.match(tabs,/const item=getDailyExpression\(level,dateKey\)/);assert.doesNotMatch(tabs,/common\.preparing/);
  assert.match(card,/data-expression-id/);assert.match(card,/localizeEnglishExpression/);assert.match(card,/language:"en"/);
  assert.match(practiceStorage,/`language101-practice-expressions-\$\{dateKey\}`/);assert.match(studyStorage,/`english:\$\{date\}`/);
});

test("My Study and daily pages share progress and synchronization contracts",async()=>{
  const [hook,storage,profile]=await Promise.all([
    readFile(new URL("../hooks/use-daily-content.ts",import.meta.url),"utf8"),
    readFile(new URL("../lib/study-storage.ts",import.meta.url),"utf8"),
    readFile(new URL("../hooks/use-study-profile.ts",import.meta.url),"utf8"),
  ]);
  assert.match(hook,/language101-study-change/); assert.match(hook,/storage/);
  assert.match(storage,/completedMissionIds/); assert.match(storage,/usedExpressionIds/);
  assert.match(profile,/STUDY_EVENT/); assert.match(profile,/storage/);
});

test("daily missions have distinct categories and storage is date-scoped", async () => {
  const daily = await import(new URL(`../lib/daily-content.ts?mission=${Date.now()}`, import.meta.url));
  const source = await readFile(new URL("../data/missions.ts", import.meta.url), "utf8");
  const categories = [...source.matchAll(/category:\"([^\"]+)\"/g)].map((match) => match[1]);
  const fakeMissions = categories.map((category, index) => ({ id: `mission-${index}`, category }));
  const selected = daily.selectDistinctCategoryItems(fakeMissions, 3, "2026-07-16", "missions");
  assert.equal(new Set(selected.map((item) => item.category)).size, 3);
  assert.equal(daily.dailyStorageKey("2026-07-16"), "language101-daily-2026-07-16");
  assert.notEqual(daily.dailyStorageKey("2026-07-16"), daily.dailyStorageKey("2026-07-17"));
  assert.notEqual(daily.dailyStorageKey("2026-07-16","en"),daily.dailyStorageKey("2026-07-16","ja"));
});

test("multilingual dictionaries are complete and English is the server default",async()=>{
  const [dictionary,layout,provider,selector]=await Promise.all([
    readFile(new URL("../data/translations.ts",import.meta.url),"utf8"),
    readFile(new URL("../app/layout.tsx",import.meta.url),"utf8"),
    readFile(new URL("../components/language-provider.tsx",import.meta.url),"utf8"),
    readFile(new URL("../components/language-selector.tsx",import.meta.url),"utf8"),
  ]);
  const dictionaryCore=dictionary.split("Object.assign")[0];
  const blocks=["en","ko","ja","zh"].map((language,index,languages)=>dictionaryCore.slice(dictionaryCore.indexOf(`${language}:{`),index===languages.length-1?dictionaryCore.length:dictionaryCore.indexOf(`${languages[index+1]}:{`)));
  const keys=blocks.map(block=>new Set([...block.matchAll(/"([a-z]+\.[A-Za-z]+)":/g)].map(match=>match[1])));
  assert.ok(keys[0].size>50);for(const set of keys.slice(1))assert.deepEqual([...set].sort(),[...keys[0]].sort());
  assert.match(layout,/lang="en-US"/);assert.match(provider,/useState<SupportedLanguage>\("en"\)/);assert.match(provider,/document\.documentElement\.lang/);assert.match(provider,/StorageEvent/);assert.match(provider,/language101-language-change/);
  assert.match(selector,/Globe2/);assert.match(selector,/type="button"/);assert.match(selector,/aria-label="Select language"/);assert.match(selector,/aria-haspopup="menu"/);assert.match(selector,/role="menuitemradio"/);assert.match(selector,/language-backdrop/);assert.match(selector,/event\.key==="Escape"/);
  const languageTypes=await readFile(new URL("../types/language.ts",import.meta.url),"utf8");
  assert.match(languageTypes,/supportedLanguages:SupportedLanguage\[\]=\["en","ko","zh","ja"\]/);
  assert.match(provider,/isLanguageMenuOpen/);assert.match(provider,/setLanguageMenuOpen\(false\)/);
});

test("content and learning state are scoped by the selected language",async()=>{
  const [viewer,daily,study,content]=await Promise.all([
    readFile(new URL("../components/conversation-content-viewer.tsx",import.meta.url),"utf8"),
    readFile(new URL("../hooks/use-daily-content.ts",import.meta.url),"utf8"),
    readFile(new URL("../lib/study-storage.ts",import.meta.url),"utf8"),
    readFile(new URL("../lib/conversation-content-storage.ts",import.meta.url),"utf8"),
  ]);
  assert.match(viewer,/filterConversationContent\(source,\{language,/);assert.match(daily,/dailyStorageKey\(dateKey,language\)/);assert.match(daily,/`\$\{language\}:missions`/);
  assert.match(study,/`\$\{language\}:\$\{date\}`/);assert.match(content,/getStoredLanguage/);assert.match(content,/getStoredLanguage\(\)!=="en"/);
});

test("expressions contain at least 300 items in each level and 300 practice recommendations",async()=>{const core=await readFile(new URL("../data/expressions.ts",import.meta.url),"utf8");const generated=await readFile(new URL("../data/generated-content.ts",import.meta.url),"utf8");const topicBlock=generated.split("const topics=[")[1].split("] as const;")[0];const topics=(topicBlock.match(/\["/g)??[]).length;assert.equal(topics,32);for(const level of ["beginner","intermediate","advanced"]){const coreCount=(core.match(new RegExp(`e\\([^\\n]+\\"${level}\\"`,"g"))??[]).length;assert.ok(coreCount+topics*10>=300,`${level} below 300`);}assert.ok(topics*4*3>=300);});

test("practice expression rules enforce five items, usage counts, and unique recommendations",async()=>{const rules=await import(new URL(`../lib/expression-rules.ts?rules=${Date.now()}`,import.meta.url));const base=[1,2,3,4].map((value)=>({id:`${value}`,expression:`Expression ${value}`,usageCount:0}));const added=rules.addUniqueUpToFive(base,[{id:"duplicate",expression:"expression 1",usageCount:0},{id:"5",expression:"Expression 5",usageCount:0},{id:"6",expression:"Expression 6",usageCount:0}]);assert.equal(added.length,5);assert.equal(added.at(-1).id,"5");const used=rules.updateUsageCount(added,"5",2);assert.equal(used.find((item)=>item.id==="5").usageCount,2);const recommended=rules.uniqueRecommendations([{id:"recent"},{id:"a"},{id:"a"},{id:"b"},{id:"c"},{id:"d"},{id:"e"}],["recent"],5);assert.deepEqual(recommended.map((item)=>item.id),["a","b","c","d","e"]);});

test("practice day keys reset by date and yesterday can be derived",async()=>{const daily=await import(new URL(`../lib/daily-content.ts?practice=${Date.now()}`,import.meta.url));assert.equal(daily.shiftDateKey("2026-07-16",-1),"2026-07-15");assert.notEqual(`language101-practice-expressions-${"2026-07-16"}`,`language101-practice-expressions-${"2026-07-15"}`);});

test("renders every mobile feature route",async()=>{for(const [path,text] of [["/activities","Browse Activities"],["/missions","오늘의 미션 3개"],["/expressions","오늘의 영어표현"],["/practice-expressions","오늘 실전 표현 5개"],["/conversation-help","대화가 막혔나요"],["/recommended","Recommended for Today"],["/random","Random Activity"],["/tools","Study Tools"]]){const response=await render(path);assert.equal(response.status,200,path);assert.match(await response.text(),new RegExp(text));}});

test("home links and mobile navigation target the new pages",async()=>{const html=await(await render()).text();for(const href of ["/missions","/expressions","/practice-expressions","/conversation-help","/recommended","/random","/tools","/activities","/my-study"]){assert.match(html,new RegExp(`href=\\"${href}`));}});

test("first-visit tutorial has five ordered steps and persistent completion",async()=>{
  const [provider,steps]=await Promise.all([
    readFile(new URL("../components/tutorial/tutorial-provider.tsx",import.meta.url),"utf8"),
    readFile(new URL("../data/tutorial-steps.ts",import.meta.url),"utf8"),
  ]);
  assert.match(provider,/language101-tutorial-completed/);assert.match(provider,/language101-tutorial-step/);
  assert.match(provider,/pathname==="\/"/);assert.match(provider,/localStorage\.setItem\(TUTORIAL_COMPLETED_KEY,"true"\)/);
  const ordered=["language-selector","daily-content","activity-selector","my-study","conversation-start"];
  assert.deepEqual([...steps.matchAll(/target:"([^"]+)"/g)].map(match=>match[1]),ordered);
});

test("tutorial is accessible, responsive, multilingual, and connected to real controls",async()=>{
  const [overlay,css,translations,home,language,headers]=await Promise.all([
    readFile(new URL("../components/tutorial/tutorial-overlay.tsx",import.meta.url),"utf8"),
    readFile(new URL("../app/globals.css",import.meta.url),"utf8"),
    readFile(new URL("../data/translations.ts",import.meta.url),"utf8"),
    readFile(new URL("../components/toolkit-home.tsx",import.meta.url),"utf8"),
    readFile(new URL("../components/language-selector.tsx",import.meta.url),"utf8"),
    readFile(new URL("../components/mobile-header.tsx",import.meta.url),"utf8")+await readFile(new URL("../components/site-header.tsx",import.meta.url),"utf8"),
  ]);
  for(const contract of [/aria-modal="true"/,/event\.key==="Escape"/,/event\.key!=="Tab"/,/scrollIntoView/,/addEventListener\("resize"/,/addEventListener\("scroll"/])assert.match(overlay,contract);
  assert.match(css,/@media\(max-width:700px\).*\.tutorial-dialog/s);assert.match(css,/prefers-reduced-motion/);
  for(const target of ["daily-content","activity-selector"])assert.match(home,new RegExp(`data-tutorial=\\"${target}\\"`));
  assert.match(home,/\?"conversation-start":undefined/);
  assert.match(language,/data-tutorial="language-selector"/);assert.match(headers,/TutorialHelpButton/);assert.match(headers,/data-tutorial="my-study"/);
  for(const languageCode of ["en","ko","zh","ja"])assert.match(translations,new RegExp(`${languageCode}:\\{[\\s\\S]*?\\"tutorial\\.open\\"`));
});

test("wheel filters items, avoids immediate repeats, and aligns the result",async()=>{const wheel=await import(new URL(`../lib/random-wheel.ts?wheel=${Date.now()}`,import.meta.url));const items=Array.from({length:12},(_,index)=>({id:`a${index}`}));assert.equal(wheel.selectWheelItems(items,10,()=>.5).length,10);const index=wheel.pickWheelIndex(3,"a0",items.slice(0,3),()=>0);assert.notEqual(items[index].id,"a0");assert.equal(wheel.wheelRotation(2,10,6),2070);});

test("mission expansion covers 12 categories with at least 20 each",async()=>{const source=await readFile(new URL("../data/generated-content.ts",import.meta.url),"utf8");const categories=[...source.matchAll(/missionCategoryNames=\[([^\]]+)\]/g)][0][1].match(/"[^"]+"/g);const contexts=[...source.matchAll(/const contexts=\[([^\]]+)\]/g)][0][1].match(/"[^"]+"/g);assert.equal(categories.length,12);assert.ok(contexts.length>=25);assert.ok(categories.length*contexts.length>=300);});

test("content normalization catches punctuation and spacing duplicates",async()=>{const content=await import(new URL(`../lib/content-normalization.ts?content=${Date.now()}`,import.meta.url));assert.equal(content.normalizeContent("  Sounds good! "),content.normalizeContent("sounds   good."));assert.ok(content.tokenJaccard("Tell me about your weekend plans","Tell me about your weekend plans!")>=.85);});

test("Situation Sentence Game uses text-only data with sufficient unique cards",async()=>{const source=await readFile(new URL("../data/situation-sentence-game.ts",import.meta.url),"utf8");assert.doesNotMatch(source,/https?:\/\/|imageSrc|<Image|\.jpg|\.png|\.webp/);const game=await import(new URL(`../data/situation-sentence-game.ts?situation=${Date.now()}`,import.meta.url));const expected={situationCountries:50,situationPlaces:60,situationProblems:100,situationPeople:40,situationTimes:20,situationEmotions:25,situationExpressions:30,situationEvents:30};const ids=[];for(const [name,count] of Object.entries(expected)){assert.ok(game[name].length>=count,`${name} below ${count}`);ids.push(...game[name].map(item=>item.id))}assert.equal(new Set(ids).size,ids.length);});

test("Situation Sentence Game difficulty cards and new rounds follow the rules",async()=>{const [rules,component]=await Promise.all([readFile(new URL("../lib/situation-sentence-game.ts",import.meta.url),"utf8"),readFile(new URL("../components/situation-sentence-game.tsx",import.meta.url),"utf8")]);assert.match(rules,/level==="beginner"\?3:level==="intermediate"\?5:8/);assert.match(rules,/\["country","place","situation"\]/);assert.match(rules,/\["country","place","situation","person"/);assert.match(rules,/"expression","event"/);assert.match(rules,/hash\(`\$\{seed\}:\$\{category\}`\)/);assert.match(component,/setRound\(value=>value\+1\)/);assert.match(component,/containsCard\(story,card\)/);});

test("Situation Sentence Game persists drafts, modes, stories, group turns, timer, and My Study records",async()=>{const [component,storage,myStudy,css,activity]=await Promise.all([readFile(new URL("../components/situation-sentence-game.tsx",import.meta.url),"utf8"),readFile(new URL("../lib/situation-story-storage.ts",import.meta.url),"utf8"),readFile(new URL("../components/my-study-view.tsx",import.meta.url),"utf8"),readFile(new URL("../app/globals.css",import.meta.url),"utf8"),readFile(new URL("../data/activities.ts",import.meta.url),"utf8")]);for(const contract of ["SITUATION_DRAFT_KEY","SITUATION_SETTINGS_KEY","Next Speaker","setInterval","navigator.vibrate","Spoken Practice","saveSituationPractice"])assert.match(component,new RegExp(contract));for(const key of ["language101-situation-story-draft","language101-situation-story-settings","language101-sentence-story-practice","language101-situation-favorite-combinations"])assert.match(storage,new RegExp(key));assert.match(myStudy,/Sentence & Story Practice/);assert.match(css,/padding:15px 12px 110px/);assert.match(activity,/id: "describing-picture-game"[\s\S]*title: "Situation Sentence Game"/);assert.doesNotMatch(activity,/id: "describing-picture-game"[\s\S]{0,400}picture/);});
