import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const root=new URL("../",import.meta.url);

test("activity cards and detail metadata use the selected learning language",async()=>{
 const [card,detail,localization]=await Promise.all([
  readFile(new URL("components/activity-card.tsx",root),"utf8"),
  readFile(new URL("components/activity-detail.tsx",root),"utf8"),
  readFile(new URL("lib/activity-localization.ts",root),"utf8")
 ]);
 assert.match(card,/localizeActivity\(activity,language\)/);
 assert.match(card,/localized\.title/);
 assert.match(card,/localized\.description/);
 assert.match(detail,/activity\.category\.\$\{activity\.category\}/);
 assert.match(detail,/groupLabels/);
 for(const language of ["ko","ja","zh"])assert.match(localization,new RegExp(`${language}:\\[`));
});

test("Guessing Words changes target vocabulary and speaking questions with the global selector",async()=>{
 const [game,data]=await Promise.all([
  readFile(new URL("components/2026-08-20-guessing-words-game.tsx",root),"utf8"),
  import(new URL(`../data/2026-10-23-multilingual-guessing-words.ts?test=${Date.now()}`,import.meta.url))
 ]);
 assert.match(game,/useLanguage\(\)/);
 assert.match(game,/localizedWord\.term\[language\]/);
 assert.match(game,/multilingualSpeakingQuestions\(localizedWord,language\)/);
 assert.equal(data.multilingualGuessingWords.length,40);
 assert.equal(new Set(data.multilingualGuessingWords.map(item=>item.id)).size,40);
 for(const item of data.multilingualGuessingWords){
  for(const language of ["en","ko","ja","zh"])assert.ok(item.term[language].trim(),`${item.id}:${language}`);
  for(const language of ["en","ko","ja","zh"]){
   const questions=data.multilingualSpeakingQuestions(item,language);
   assert.equal(questions.length,3);
   assert.ok(questions.every(question=>question.includes(item.term[language])));
  }
 }
});

test("legacy activity screens receive four-language control and state labels",async()=>{
 const bridge=await readFile(new URL("components/2026-08-03-activity-language-bridge.tsx",root),"utf8");
 for(const label of ["How to Play","Search & Filters","Show Answer","Scoreboard","Question categories","Timer duration","Role Play","New Topic"]){
  assert.match(bridge,new RegExp(`en:\"${label.replace(/[&]/g,"&")}\"`));
 }
});
