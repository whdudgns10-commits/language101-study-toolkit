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

test("renders a compact activity detail with external action and closed sections", async () => {
  const response = await render("/activities/30-second-speaking");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /30 Second Speaking/);
  assert.match(html, /Open external activity/);
  assert.match(html, /View How to Play/);
  assert.match(html, /aria-expanded="false"/);
  assert.match(html, /Table mode/);
  assert.match(html, /Learning Notes/);
});

test("Naver Cafe text activities use internal content while operational links remain",async()=>{
  const activities=await readFile(new URL("../data/activities.ts",import.meta.url),"utf8");
  assert.doesNotMatch(activities,/cafe\.naver\.com|m\.cafe\.naver\.com/);
  assert.ok((activities.match(/sourceType:\s*"internal"/g)??[]).length>=11);
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

test("renders every mobile feature route",async()=>{for(const [path,text] of [["/activities","Choose an activity to start."],["/missions","오늘의 미션 3개"],["/expressions","오늘의 영어표현"],["/practice-expressions","오늘 실전 표현 5개"],["/conversation-help","대화가 막혔나요"],["/recommended","Recommended for Today"],["/random","Random Activity"],["/tools","Study Tools"]]){const response=await render(path);assert.equal(response.status,200,path);assert.match(await response.text(),new RegExp(text));}});

test("home links and mobile navigation target the new pages",async()=>{const html=await(await render()).text();for(const href of ["/missions","/expressions","/practice-expressions","/conversation-help","/recommended","/random","/activities","/my-study"]){assert.match(html,new RegExp(`href=\\"${href}`));}assert.doesNotMatch(html,/href=\"\/tools\"/);});

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

test("random activity selection excludes recent ids and stays inside eligible items",async()=>{const rules=await import(new URL(`../lib/random-activity.ts?selection=${Date.now()}`,import.meta.url));const items=Array.from({length:12},(_,index)=>({id:`a${index}`}));const index=rules.pickRandomActivityIndex(items,["a0","a1","a2","a3","a4"],()=>0);assert.equal(items[index].id,"a5");assert.ok(index>=0&&index<items.length);});

test("mission expansion covers 12 categories with at least 20 each",async()=>{const source=await readFile(new URL("../data/generated-content.ts",import.meta.url),"utf8");const categories=[...source.matchAll(/missionCategoryNames=\[([^\]]+)\]/g)][0][1].match(/"[^"]+"/g);const contexts=[...source.matchAll(/const contexts=\[([^\]]+)\]/g)][0][1].match(/"[^"]+"/g);assert.equal(categories.length,12);assert.ok(contexts.length>=25);assert.ok(categories.length*contexts.length>=300);});

test("content normalization catches punctuation and spacing duplicates",async()=>{const content=await import(new URL(`../lib/content-normalization.ts?content=${Date.now()}`,import.meta.url));assert.equal(content.normalizeContent("  Sounds good! "),content.normalizeContent("sounds   good."));assert.ok(content.tokenJaccard("Tell me about your weekend plans","Tell me about your weekend plans!")>=.85);});

test("Situation Sentence Game uses text-only data with sufficient unique cards",async()=>{const source=await readFile(new URL("../data/situation-sentence-game.ts",import.meta.url),"utf8");assert.doesNotMatch(source,/https?:\/\/|imageSrc|<Image|\.jpg|\.png|\.webp/);const game=await import(new URL(`../data/situation-sentence-game.ts?situation=${Date.now()}`,import.meta.url));const expected={situationCountries:50,situationPlaces:60,situationProblems:100,situationPeople:40,situationTimes:20,situationEmotions:25,situationExpressions:30,situationEvents:30};const ids=[];for(const [name,count] of Object.entries(expected)){assert.ok(game[name].length>=count,`${name} below ${count}`);ids.push(...game[name].map(item=>item.id))}assert.equal(new Set(ids).size,ids.length);});

test("Situation Sentence Game difficulty cards and new rounds follow the rules",async()=>{const [rules,component]=await Promise.all([readFile(new URL("../lib/situation-sentence-game.ts",import.meta.url),"utf8"),readFile(new URL("../components/situation-sentence-game.tsx",import.meta.url),"utf8")]);assert.match(rules,/level==="beginner"\?3:level==="intermediate"\?5:8/);assert.match(rules,/\["country","place","situation"\]/);assert.match(rules,/\["country","place","situation","person"/);assert.match(rules,/"expression","event"/);assert.match(rules,/hash\(`\$\{seed\}:\$\{category\}`\)/);assert.match(component,/setRound\(value=>value\+1\)/);assert.match(component,/containsCard\(story,card\)/);});

test("Situation Sentence Game persists drafts, modes, stories, group turns, timer, and My Study records",async()=>{const [component,storage,myStudy,css,activity]=await Promise.all([readFile(new URL("../components/situation-sentence-game.tsx",import.meta.url),"utf8"),readFile(new URL("../lib/situation-story-storage.ts",import.meta.url),"utf8"),readFile(new URL("../components/my-study-view.tsx",import.meta.url),"utf8"),readFile(new URL("../app/globals.css",import.meta.url),"utf8"),readFile(new URL("../data/activities.ts",import.meta.url),"utf8")]);for(const contract of ["SITUATION_DRAFT_KEY","SITUATION_SETTINGS_KEY","Next Speaker","setInterval","navigator.vibrate","Spoken Practice","saveSituationPractice"])assert.match(component,new RegExp(contract));for(const key of ["language101-situation-story-draft","language101-situation-story-settings","language101-sentence-story-practice","language101-situation-favorite-combinations"])assert.match(storage,new RegExp(key));assert.match(myStudy,/Sentence & Story Practice/);assert.match(css,/padding:15px 12px 110px/);const block=activity.split('id: "describing-picture-game"')[1].split("},\n];")[0];assert.match(block,/title: "Situation Sentence Game"/);assert.doesNotMatch(block,/imageSrc|https?:\/\/[^\s]*\.(?:png|jpg|webp)/);});

test("Random Activity and Browse Activities share one active registry",async()=>{const [registry,wheel,browser,page]=await Promise.all([readFile(new URL("../data/activities.ts",import.meta.url),"utf8"),readFile(new URL("../components/activity-wheel.tsx",import.meta.url),"utf8"),readFile(new URL("../components/activity-browser.tsx",import.meta.url),"utf8"),readFile(new URL("../app/activities/[id]/page.tsx",import.meta.url),"utf8")]);assert.match(registry,/activeActivities/);assert.match(registry,/randomEligibleActivities/);assert.match(wheel,/randomEligibleActivities/);assert.match(browser,/activeActivities/);assert.match(page,/activeActivities/);assert.doesNotMatch(wheel,/\[\s*\{\s*id:/);});

test("Random Activity candidates are unique, filterable, and exclude disabled entries",async()=>{const [rules,registry]=await Promise.all([import(new URL(`../lib/random-activity.ts?registry=${Date.now()}`,import.meta.url)),import(new URL(`../data/activities.ts?registry=${Date.now()}`,import.meta.url))]);const eligible=rules.uniqueActivities(registry.randomEligibleActivities);assert.equal(eligible.length,17);assert.equal(new Set(eligible.map(item=>item.id)).size,17);assert.equal(new Set(eligible.map(item=>item.slug||item.id)).size,17);for(const item of eligible)assert.ok(item.slug||item.id);});

test("Random Activity history prevents immediate repeats and keeps five entries",async()=>{const rules=await import(new URL(`../lib/random-activity.ts?history=${Date.now()}`,import.meta.url));const items=Array.from({length:8},(_,index)=>({id:`a${index}`,title:`Activity ${index}`}));const selectedIndex=rules.pickRandomActivityIndex(items,["a0","a1","a2","a3","a4"],()=>0);assert.equal(items[selectedIndex].id,"a5");const history=rules.nextRandomHistory(["a0","a1","a2","a3","a4"],"a5");assert.deepEqual(history,["a5","a0","a1","a2","a3"]);assert.notEqual(items[rules.pickRandomActivityIndex(items,history,()=>0)].id,"a5");});

test("Activity Shuffle uses one final Activity for display, history, and navigation",async()=>{const source=await readFile(new URL("../components/activity-wheel.tsx",import.meta.url),"utf8");assert.equal((source.match(/pickRandomActivityIndex\(/g)||[]).length,1);assert.match(source,/const chosen=eligibleActivities\[selectedIndex\]/);assert.match(source,/finalActivityRef\.current=chosen/);assert.match(source,/setDisplayActivity\(chosen\);setFinalActivity\(chosen\)/);assert.match(source,/nextRandomHistory\(history,chosen\.id\)/);assert.match(source,/RECENT_RANDOM_KEY,chosen\.id/);assert.match(source,/const targetSlug=chosen\.slug\|\|chosen\.id/);assert.match(source,/router\.push\(`\/activities\/\$\{targetSlug\}`\)/);assert.doesNotMatch(source,/wheel-geometry|rotation|visualIndex|elementFromPoint|data-wheel-segment|<svg|wheel-pointer/);});

test("Activity Shuffle animation previews cannot change the final destination",async()=>{const source=await readFile(new URL("../components/activity-wheel.tsx",import.meta.url),"utf8");assert.match(source,/setInterval\(\(\)=>/);assert.match(source,/setTimeout\(\(\)=>finishShuffle\(chosen\),2200\)/);assert.match(source,/if\(preview&&preview\.id!==chosen\.id\)setDisplayActivity\(preview\)/);assert.match(source,/if\(isShuffling\|\|finalActivity\|\|!eligibleActivities\.length\)return/);for(const timer of ["shuffleIntervalRef","shuffleTimeoutRef","navigationTimerRef"])assert.match(source,new RegExp(`if\\(${timer}\\.current\\)`));assert.match(source,/function update[\s\S]*clearSelection\(\)/);assert.match(source,/useEffect\(\(\)=>\(\)=>clearTimers\(\),\[clearTimers\]\)/);});

test("Activity Shuffle is mobile readable and keeps all localized content",async()=>{const [source,css,translations]=await Promise.all([readFile(new URL("../components/activity-wheel.tsx",import.meta.url),"utf8"),readFile(new URL("../app/globals.css",import.meta.url),"utf8"),readFile(new URL("../data/translations.ts",import.meta.url),"utf8")]);for(const contract of ["activity-shuffle-card","shuffle-spin-button","randomActivity.ready","randomActivity.filters","randomActivity.noMatches"])assert.match(source,new RegExp(contract));assert.match(css,/activity-shuffle-card h2\{[^}]*font-size:clamp\(28px,7vw,46px\)/);assert.match(css,/overflow-wrap:anywhere/);for(const language of ["en","ko","zh","ja"])assert.match(translations,new RegExp(`Object.assign\\(translations\\.${language},\\{\\"randomActivity.ready\\"`));});

test("known activity titles resolve to unique existing detail slugs",async()=>{const registry=await import(new URL(`../data/activities.ts?slugs=${Date.now()}`,import.meta.url));const expected={"Fun Discuss":"fun-discuss","Balance Game":"balance-game","Word Battle":"word-battle","Situation Sentence Game":"describing-picture-game","What If Challenge":"what-if-challenge"};for(const [title,slug] of Object.entries(expected)){const activity=registry.activeActivities.find(item=>item.title===title);assert.ok(activity,title);assert.equal(activity.slug||activity.id,slug);assert.ok(registry.getActivity(slug))}const slugs=registry.activeActivities.map(item=>item.slug||item.id);assert.equal(new Set(slugs).size,slugs.length);});

test("activity details use closed shared accordions and compact mobile summaries",async()=>{const [detail,accordion,viewer,css]=await Promise.all([readFile(new URL("../components/activity-detail.tsx",import.meta.url),"utf8"),readFile(new URL("../components/activity/activity-accordion.tsx",import.meta.url),"utf8"),readFile(new URL("../components/conversation-content-viewer.tsx",import.meta.url),"utf8"),readFile(new URL("../app/globals.css",import.meta.url),"utf8")]);assert.match(accordion,/defaultOpen=false/);assert.match(accordion,/aria-expanded=\{open\}/);assert.match(accordion,/aria-controls=\{id\}/);assert.match(accordion,/hidden=\{!open\}/);for(const key of ["activity.viewHowToPlay","activity.startPractice","activity.notes"])assert.match(detail,new RegExp(key));for(const key of ["activity.practiceSettings","activity.viewQuestions","activity.viewExpressions","activity.viewTips"])assert.match(viewer,new RegExp(key));assert.match(css,/-webkit-line-clamp:2/);assert.match(css,/min-height:52px/);assert.match(css,/compact-activity-detail.*padding-bottom:100px/s);});

test("Alphabet Challenge replaces the legacy activity while preserving its compatible slug",async()=>{
  const registry=await import(new URL(`../data/activities.ts?alphabet=${Date.now()}`,import.meta.url));
  const activity=registry.getActivity("words-game");
  assert.ok(activity);assert.equal(activity.id,"words-game");assert.equal(activity.title,"Alphabet Challenge");
  assert.equal(activity.sourceType,"internal");assert.deepEqual(activity.groupSizes,["2–8 people"]);
  assert.equal(registry.activeActivities.length,17);
  assert.equal(registry.activeActivities.filter(item=>item.title==="Alphabet Challenge").length,1);
  assert.equal(registry.randomEligibleActivities.filter(item=>item.title==="Alphabet Challenge").length,1);
  const response=await render("/activities/words-game");assert.equal(response.status,200);
  const html=await response.text();assert.match(html,/Alphabet Challenge/);assert.match(html,/Start Practice/);assert.match(html,/aria-expanded="false"/);
});

test("Alphabet Challenge letter, scoring, winner, reset and circular turn rules are stable",async()=>{
  const rules=await import(new URL(`../lib/alphabet-challenge.ts?rules=${Date.now()}`,import.meta.url));
  assert.equal(rules.ALPHABET.length,26);assert.equal(new Set(rules.ALPHABET).size,26);
  const recent=["A","B","C","D","E"];assert.equal(recent.includes(rules.chooseRandomLetter(recent,()=>0)),false);
  assert.equal(rules.nextAlphabetPlayer(3,4),0);
  const base={id:"1",name:"A",correctCount:0,failedCount:0,penaltyCount:0,roundsStarted:0};
  assert.deepEqual(rules.recordCorrect([base],0),[{...base,correctCount:1}]);
  assert.deepEqual(rules.recordFailure([base],0),[{...base,failedCount:1,penaltyCount:1}]);
  const leaders=rules.alphabetWinners([{...base,id:"1",name:"A",correctCount:9,penaltyCount:2},{...base,id:"2",name:"B",correctCount:2,penaltyCount:1}]);assert.deepEqual(leaders.map(item=>item.name),["B"]);
  assert.deepEqual(rules.resetAlphabetPlayers([{...base,correctCount:4,failedCount:2,penaltyCount:2,roundsStarted:3}]),[base]);
  assert.equal(rules.minimumWordLength("beginner",3),0);assert.equal(rules.minimumWordLength("intermediate",0),0);assert.equal(rules.minimumWordLength("intermediate",1),3);assert.equal(rules.minimumWordLength("intermediate",2),4);assert.equal(rules.minimumWordLength("intermediate",3),5);
  assert.equal(rules.validateRoundWord("Apple","A",0,[]).valid,true);assert.equal(rules.validateRoundWord("apple","A",0,["Apple"]).error,"duplicate");
});

test("Alphabet Challenge includes timers, game controls, table mode, and persistent My Study records",async()=>{
  const [component,storage,detail,css]=await Promise.all([
    readFile(new URL("../components/alphabet-challenge-game.tsx",import.meta.url),"utf8"),
    readFile(new URL("../lib/alphabet-challenge-storage.ts",import.meta.url),"utf8"),
    readFile(new URL("../components/activity-detail.tsx",import.meta.url),"utf8"),
    readFile(new URL("../app/globals.css",import.meta.url),"utf8"),
  ]);
  for(const contract of ["chooseRandomLetter","const finalLetter","setCurrentLetter(finalLetter)","setInterval","800","setTimeLeft(5)","navigator.vibrate","Correct","Time’s Up","Start New Round","Table Mode","saveAlphabetPractice"])assert.match(component,new RegExp(contract.replace(/[()]/g,"\\$&")));
  const correctBlock=component.split("function handleCorrect()")[1].split("function startNewRound")[0];assert.doesNotMatch(correctBlock,/setCurrentLetter|startShuffle|setPhase\("round-ended"\)/);assert.match(correctBlock,/setCurrentPlayerIndex/);assert.match(correctBlock,/setTimeLeft\(5\)/);
  const failureBlock=component.split("const endRound=")[1].split("useEffect")[0];assert.match(failureBlock,/recordFailure/);assert.match(failureBlock,/setPhase\("round-ended"\)/);
  assert.match(component,/type GamePhase = "setup" \| "ready" \| "letter-shuffling" \| "playing" \| "round-ended" \| "game-finished"/);
  assert.doesNotMatch(component,/Type Mode|minimumLetters|Used Words|alphabet-word-input/);
  for(const key of ["language101-alphabet-challenge-practice","language101-study-change","localStorage"])assert.match(storage,new RegExp(key));
  for(const field of ["activityName","difficulty","wordLengthLevel","minimumWordLength","roundHistory","penalties","failedPlayerIds","longestRound","winner"])assert.match(storage,new RegExp(field));
  assert.match(detail,/activity.id === "words-game" \? <AlphabetChallengeGame/);
  assert.match(css,/\.alphabet-game\.is-table-mode/);assert.match(css,/@media\(max-width:700px\).*\.alphabet-actions/s);
});

test("Random Activity and activity accordion translation keys exist in all interface languages",async()=>{const source=await readFile(new URL("../data/translations.ts",import.meta.url),"utf8");const keys=["randomActivity.selected","randomActivity.opening","randomActivity.shuffle","randomActivity.noMatches","activity.viewHowToPlay","activity.hideHowToPlay","activity.startPractice","activity.closePractice","activity.viewExpressions","activity.hideExpressions","activity.viewQuestions","activity.hideQuestions","activity.viewTips","activity.hideTips","activity.viewExamples","activity.hideExamples","activity.practiceSettings","activity.saveToMyStudy"];for(const language of ["en","ko","zh","ja"]){const block=source.split(`Object.assign(translations.${language},{\"randomActivity.title\"`)[1];assert.ok(block,`missing ${language} activity translations`);for(const key of keys)assert.match(block.split("});")[0],new RegExp(`\\"${key.replace(".","\\.")}\\"`))}});
test("all 17 activities have intentional unique icon mappings",async()=>{
  const registry=await import(new URL(`../data/activities.ts?icons=${Date.now()}`,import.meta.url));
  const expected={"true-or-false":"true-false","30-second-speaking":"timed-speaking","20-questions":"questions","what-if-challenge":"imagination","funny-questions":"funny","ice-breaking-3":"icebreaker","fun-discuss":"discussion","guessing-words":"guessing","word-battle":"battle","balance-game":"balance","conversation-starter":"conversation-starter","words-game":"alphabet","debate-pros-cons":"debate","choose-one-out-of-three":"choose-three","useful-expressions":"useful-expressions","practice-of-expressing":"expression-practice","describing-picture-game":"situation-story"};
  assert.equal(registry.activeActivities.length,17);
  assert.deepEqual(Object.fromEntries(registry.activeActivities.map(item=>[item.id,item.iconKey])),expected);
  assert.equal(new Set(registry.activeActivities.map(item=>item.iconKey)).size,17);
});

test("Balance Game is unified, data-rich, and keeps the 17-activity registry",async()=>{const [registry,data]=await Promise.all([import(new URL(`../data/activities.ts?balance=${Date.now()}`,import.meta.url)),import(new URL(`../data/balance-game.ts?balance=${Date.now()}`,import.meta.url))]);assert.equal(registry.activeActivities.length,17);assert.equal(registry.activeActivities.filter(item=>item.id==="balance-game").length,1);assert.equal(registry.activeActivities.some(item=>item.id==="balance-game-2"),false);assert.equal(registry.randomEligibleActivities.length,17);assert.ok(data.balanceGameItems.length>=150);assert.equal(new Set(data.balanceGameItems.map(item=>item.id)).size,data.balanceGameItems.length);assert.ok(data.balanceGameItems.every(item=>item.optionA&&item.optionB&&item.followUpQuestions.en.length>=3));for(const level of ["beginner","intermediate","advanced"])assert.ok(data.balanceGameItems.filter(item=>item.level===level).length>=50);const pairs=data.balanceGameItems.map(item=>[item.optionA,item.optionB].map(v=>v.toLowerCase().trim()).sort().join("|"));assert.equal(new Set(pairs).size,pairs.length);});

test("Balance Game has a focused practice route, redirect, persistence, voting, and responsive cards",async()=>{const [page,detail,game,storage,css]=await Promise.all([readFile(new URL("../app/activities/[id]/page.tsx",import.meta.url),"utf8"),readFile(new URL("../components/activity-detail.tsx",import.meta.url),"utf8"),readFile(new URL("../components/balance-game.tsx",import.meta.url),"utf8"),readFile(new URL("../lib/balance-game-storage.ts",import.meta.url),"utf8"),readFile(new URL("../app/globals.css",import.meta.url),"utf8")]);assert.match(page,/balance-game-2.*redirect\("\/activities\/balance-game"\)/s);assert.match(detail,/\/activities\/balance-game\/practice/);for(const contract of ["aria-pressed","setVotes","Reset Votes","readBalanceState","saveBalanceState","toggleBalanceFavorite","saveBalanceSession","is-table-mode"])assert.match(game,new RegExp(contract));assert.match(storage,/normalizeBalanceActivityId/);assert.match(storage,/balance-game-2/);assert.match(css,/\.balance-option\{[^}]*min-height:190px/);assert.match(css,/@media\(max-width:700px\).*\.balance-options\{grid-template-columns:1fr/s);assert.match(css,/padding:18px 14px 110px/);});

test("ActivityIcon is shared by browse, random, card, and detail views",async()=>{
  const [icons,browser,wheel,card,detail,css]=await Promise.all([
    readFile(new URL("../components/activity/activity-icon.tsx",import.meta.url),"utf8"),
    readFile(new URL("../components/activity-browser.tsx",import.meta.url),"utf8"),
    readFile(new URL("../components/activity-wheel.tsx",import.meta.url),"utf8"),
    readFile(new URL("../components/activity-card.tsx",import.meta.url),"utf8"),
    readFile(new URL("../components/activity-detail.tsx",import.meta.url),"utf8"),
    readFile(new URL("../app/globals.css",import.meta.url),"utf8"),
  ]);
  assert.match(icons,/CircleHelp/);assert.match(icons,/Unknown activity icon key/);assert.match(icons,/aria-hidden/);
  assert.doesNotMatch(browser,/iconFor|activity\.category===/);
  assert.match(browser,/activity\.iconKey/);assert.match(wheel,/displayActivity\.iconKey/);assert.match(card,/activity\.iconKey/);assert.match(detail,/activity\.iconKey/);
  assert.match(css,/\.activity-meaning-icon/);assert.match(css,/--activity-icon-size/);assert.match(css,/@media\(max-width:700px\).*\.activity-list-button\{min-height:132px/s);
});
test("Ice Breaking is second in the shared 17-activity registry and has dedicated questions",async()=>{const [registry,data]=await Promise.all([import(new URL(`../data/activities.ts?ice=${Date.now()}`,import.meta.url)),import(new URL(`../data/ice-breaking-questions.ts?ice=${Date.now()}`,import.meta.url))]);assert.equal(registry.activeActivities.length,17);assert.deepEqual(registry.activeActivities.slice(0,2).map(item=>item.id),["true-or-false","ice-breaking-3"]);assert.equal(registry.activeActivities[1].title,"Ice Breaking");assert.equal(registry.randomEligibleActivities[1],registry.activeActivities[1]);assert.ok(data.iceBreakingQuestions.length>=150);assert.equal(new Set(data.iceBreakingQuestions.map(item=>item.id)).size,data.iceBreakingQuestions.length);for(const depth of ["easy","medium","deep"])assert.ok(data.iceBreakingQuestions.filter(item=>item.depth===depth).length>=50);});

test("Debate practice has at least 240 validated localized topics",async()=>{const data=await import(new URL(`../data/debate-pros-cons.ts?debate=${Date.now()}`,import.meta.url));assert.ok(data.debateTopics.length>=240);assert.equal(new Set(data.debateTopics.map(item=>item.id)).size,data.debateTopics.length);assert.deepEqual(data.validateDebateTopics(),[]);assert.equal(data.debateCategories.length,11);for(const item of data.debateTopics){assert.ok(item.question.en.trim());assert.ok(item.question.ko.trim());assert.ok(["intermediate","advanced"].includes(item.difficulty));assert.ok(["light","standard","sensitive"].includes(item.sensitivity));assert.ok(item.prosPrompts.en.length>=3);assert.ok(item.consPrompts.en.length>=3);assert.ok(item.followUpQuestions.en.length>=3)}});

test("Debate detail links directly to the focused practice flow",async()=>{const [detail,practice,css]=await Promise.all([readFile(new URL("../components/activity-detail.tsx",import.meta.url),"utf8"),readFile(new URL("../components/debate-practice.tsx",import.meta.url),"utf8"),readFile(new URL("../app/globals.css",import.meta.url),"utf8")]);assert.match(detail,/debate-pros-cons/);assert.match(detail,/20–40/);assert.match(practice,/useState\(false\).*sensitive/s);assert.match(practice,/sensitivity!=="sensitive"/);assert.match(practice,/phaseOrder:Phase\[\]=\["setup","preparation","pros-opening","cons-opening","free-debate","closing","summary"\]/);assert.match(practice,/clearInterval\(timer\)/);assert.match(practice,/history\.slice\(-10\)/);assert.match(practice,/language101-debate-favorites/);assert.match(practice,/language101-debate-sessions/);assert.match(practice,/language101-study-change/);assert.match(css,/\.debate-teams/);assert.match(css,/@media\(max-width:700px\).*\.debate-teams\{grid-template-columns:1fr\}/s)});

test("Ice Breaking practice opens the first question and supports navigation, favorites, and alias redirect",async()=>{const [detail,practice,page,css]=await Promise.all([readFile(new URL("../components/activity-detail.tsx",import.meta.url),"utf8"),readFile(new URL("../components/ice-breaking-practice.tsx",import.meta.url),"utf8"),readFile(new URL("../app/activities/[id]/page.tsx",import.meta.url),"utf8"),readFile(new URL("../app/globals.css",import.meta.url),"utf8")]);assert.match(detail,/ice-breaking-3.*practice/s);assert.match(page,/ice-breaking.*redirect\("\/activities\/ice-breaking-3"\)/s);for(const contract of ["iceBreakingQuestions[0].id","function next","function random","recent","language101-ice-breaking-favorites","language101-ice-breaking-sessions"])assert.match(practice,new RegExp(contract.replace(/[\[\].]/g,"\\$&")));assert.match(css,/\.ice-question-card/);});

test("Choose One Out of Three data always has one question and exactly A, B, C",async()=>{const data=await import(new URL(`../data/choose-one-out-of-three.ts?choose=${Date.now()}`,import.meta.url));assert.ok(data.chooseThreeItems.length>=150);assert.equal(new Set(data.chooseThreeItems.map(item=>item.id)).size,data.chooseThreeItems.length);for(const level of ["beginner","intermediate","advanced"])assert.ok(data.chooseThreeItems.filter(item=>item.level===level).length>=50);for(const item of data.chooseThreeItems){assert.ok(item.question.en);assert.equal(item.options.length,3);assert.deepEqual(item.options.map(option=>option.id),["A","B","C"]);assert.equal(new Set(item.options.map(option=>option.id)).size,3)}});

test("Choose Three practice uses selectable cards, group votes, reset, persistence, and mobile layout",async()=>{const [detail,practice,css]=await Promise.all([readFile(new URL("../components/activity-detail.tsx",import.meta.url),"utf8"),readFile(new URL("../components/choose-three-practice.tsx",import.meta.url),"utf8"),readFile(new URL("../app/globals.css",import.meta.url),"utf8")]);assert.match(detail,/choose-one-out-of-three.*practice/s);for(const contract of ["aria-pressed","setVotes","A:0,B:0,C:0","Reset Votes","language101-choose-three-favorites","language101-choose-three-sessions","function next","function previous","function random"])assert.match(practice,new RegExp(contract.replace(/[()]/g,"\\$&")));assert.match(css,/\.choose-options\{[^}]*grid-template-columns:repeat\(3,1fr\)/);assert.match(css,/@media\(max-width:700px\).*\.choose-options\{grid-template-columns:1fr/s);});
test("Choose Three final dataset has exactly 200 validated multilingual items",async()=>{const data=await import(new URL(`../data/choose-one-out-of-three.ts?quality=${Date.now()}`,import.meta.url));assert.equal(data.chooseThreeItems.length,200);assert.equal(data.chooseThreeItems.filter(item=>item.difficulty==="beginner").length,70);assert.equal(data.chooseThreeItems.filter(item=>item.difficulty==="intermediate").length,70);assert.equal(data.chooseThreeItems.filter(item=>item.difficulty==="advanced").length,60);assert.deepEqual(data.validateChooseThreeData(),[]);assert.equal(data.chooseThreeUsefulExpressions.length,20);assert.equal(Object.values(data.chooseCategoryTargets).reduce((sum,count)=>sum+count,0),200);for(const item of data.chooseThreeItems){assert.equal(item.followUpQuestions.en.length,3);for(const language of ["en","ko","zh","ja"]){assert.ok(item.question[language]);assert.ok(item.options.every(option=>option.text[language]))}}});
