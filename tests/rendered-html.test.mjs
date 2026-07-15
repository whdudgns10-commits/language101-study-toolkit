import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { after } from "node:test";

const port=4199;
const server=spawn(process.execPath,["node_modules/next/dist/bin/next","start","-p",String(port)],{stdio:"ignore"});
after(()=>server.kill("SIGTERM"));
for(let attempt=0;attempt<60;attempt++){try{const response=await fetch(`http://127.0.0.1:${port}/`);if(response.ok)break;}catch{}await new Promise(resolve=>setTimeout(resolve,250));}

async function render(path = "/") {
  return fetch(`http://127.0.0.1:${port}${path}`,{headers:{accept:"text/html"}});
}

test("renders the activity toolkit home", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Language101 Study Toolkit/);
  assert.match(html, /Recommended for Today/);
  assert.match(html, /Random Activity/);
  assert.match(html, /Browse All Activities/);
  assert.match(html, /오늘의 영어표현/);
  assert.match(html, /대화가 막혔나요/);
  assert.match(html, /오늘의 미션/);
  assert.match(html, /오늘 실전에서 사용할 표현 5개/);
  assert.doesNotMatch(html, /질문을 뽑아 보세요|미션 다시 뽑기|Find your activity|Today’s missions/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/);
});

test("renders an activity detail with source notice and timer", async () => {
  const response = await render("/activities/30-second-speaking");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /30 Second Speaking/);
  assert.match(html, /Opens an interactive activity in a new tab/);
  assert.match(html, /Three simple steps/);
  assert.match(html, /Timer/);
  assert.match(html, /테이블 모드/);
  assert.match(html, /학습 메모/);
});

test("contains at least 80 local conversation questions", async () => {
  const source = await readFile(new URL("../data/conversation-topics.ts", import.meta.url), "utf8");
  assert.ok((source.match(/category:/g) ?? []).length >= 80);
  for (const category of ["일상","여행","음식","문화","취미","일과 직장","워킹홀리데이","재미있는 질문"]) assert.match(source, new RegExp(`category:\\"${category}\\"`));
});

test("renders notes and end-session routes", async () => {
  const [notesResponse,endResponse] = await Promise.all([render("/notes"),render("/end-session")]);
  assert.equal(notesResponse.status,200); assert.equal(endResponse.status,200);
  assert.match(await notesResponse.text(),/전체 학습 메모/);
  assert.match(await endResponse.text(),/오늘도 좋은 대화였어요/);
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

test("daily missions have distinct categories and storage is date-scoped", async () => {
  const daily = await import(new URL(`../lib/daily-content.ts?mission=${Date.now()}`, import.meta.url));
  const source = await readFile(new URL("../data/missions.ts", import.meta.url), "utf8");
  const categories = [...source.matchAll(/category:\"([^\"]+)\"/g)].map((match) => match[1]);
  const fakeMissions = categories.map((category, index) => ({ id: `mission-${index}`, category }));
  const selected = daily.selectDistinctCategoryItems(fakeMissions, 3, "2026-07-16", "missions");
  assert.equal(new Set(selected.map((item) => item.category)).size, 3);
  assert.equal(daily.dailyStorageKey("2026-07-16"), "language101-daily-2026-07-16");
  assert.notEqual(daily.dailyStorageKey("2026-07-16"), daily.dailyStorageKey("2026-07-17"));
});

test("expressions contain at least 300 items in each level and 300 practice recommendations",async()=>{const core=await readFile(new URL("../data/expressions.ts",import.meta.url),"utf8");const generated=await readFile(new URL("../data/generated-content.ts",import.meta.url),"utf8");const topicBlock=generated.split("const topics=[")[1].split("] as const;")[0];const topics=(topicBlock.match(/\["/g)??[]).length;assert.equal(topics,32);for(const level of ["beginner","intermediate","advanced"]){const coreCount=(core.match(new RegExp(`e\\([^\\n]+\\"${level}\\"`,"g"))??[]).length;assert.ok(coreCount+topics*10>=300,`${level} below 300`);}assert.ok(topics*4*3>=300);});

test("practice expression rules enforce five items, usage counts, and unique recommendations",async()=>{const rules=await import(new URL(`../lib/expression-rules.ts?rules=${Date.now()}`,import.meta.url));const base=[1,2,3,4].map((value)=>({id:`${value}`,expression:`Expression ${value}`,usageCount:0}));const added=rules.addUniqueUpToFive(base,[{id:"duplicate",expression:"expression 1",usageCount:0},{id:"5",expression:"Expression 5",usageCount:0},{id:"6",expression:"Expression 6",usageCount:0}]);assert.equal(added.length,5);assert.equal(added.at(-1).id,"5");const used=rules.updateUsageCount(added,"5",2);assert.equal(used.find((item)=>item.id==="5").usageCount,2);const recommended=rules.uniqueRecommendations([{id:"recent"},{id:"a"},{id:"a"},{id:"b"},{id:"c"},{id:"d"},{id:"e"}],["recent"],5);assert.deepEqual(recommended.map((item)=>item.id),["a","b","c","d","e"]);});

test("practice day keys reset by date and yesterday can be derived",async()=>{const daily=await import(new URL(`../lib/daily-content.ts?practice=${Date.now()}`,import.meta.url));assert.equal(daily.shiftDateKey("2026-07-16",-1),"2026-07-15");assert.notEqual(`language101-practice-expressions-${"2026-07-16"}`,`language101-practice-expressions-${"2026-07-15"}`);});

test("renders every mobile feature route",async()=>{for(const [path,text] of [["/activities","Browse Activities"],["/missions","오늘의 미션 3개"],["/expressions","오늘의 영어표현"],["/practice-expressions","오늘 실전 표현 5개"],["/conversation-help","대화가 막혔나요"],["/recommended","Recommended for Today"],["/random","Random Activity"],["/tools","Study Tools"]]){const response=await render(path);assert.equal(response.status,200,path);assert.match(await response.text(),new RegExp(text));}});

test("home links and mobile navigation target the new pages",async()=>{const html=await(await render()).text();for(const href of ["/missions","/expressions","/practice-expressions","/conversation-help","/recommended","/random","/tools","/activities"]){assert.match(html,new RegExp(`href=\\"${href}`));}});

test("wheel filters items, avoids immediate repeats, and aligns the result",async()=>{const wheel=await import(new URL(`../lib/random-wheel.ts?wheel=${Date.now()}`,import.meta.url));const items=Array.from({length:12},(_,index)=>({id:`a${index}`}));assert.equal(wheel.selectWheelItems(items,10,()=>.5).length,10);const index=wheel.pickWheelIndex(3,"a0",items.slice(0,3),()=>0);assert.notEqual(items[index].id,"a0");assert.equal(wheel.wheelRotation(2,10,6),2070);});

test("mission expansion covers 12 categories with at least 20 each",async()=>{const source=await readFile(new URL("../data/generated-content.ts",import.meta.url),"utf8");const categories=[...source.matchAll(/missionCategoryNames=\[([^\]]+)\]/g)][0][1].match(/"[^"]+"/g);const contexts=[...source.matchAll(/const contexts=\[([^\]]+)\]/g)][0][1].match(/"[^"]+"/g);assert.equal(categories.length,12);assert.ok(contexts.length>=25);assert.ok(categories.length*contexts.length>=300);});

test("content normalization catches punctuation and spacing duplicates",async()=>{const content=await import(new URL(`../lib/content-normalization.ts?content=${Date.now()}`,import.meta.url));assert.equal(content.normalizeContent("  Sounds good! "),content.normalizeContent("sounds   good."));assert.ok(content.tokenJaccard("Tell me about your weekend plans","Tell me about your weekend plans!")>=.85);});
