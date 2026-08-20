import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("Guessing Words contains exactly fifteen hundred bilingual learning words",async()=>{
 const data=await import(new URL(`../data/2026-08-20-guessing-words.ts?test=${Date.now()}`,import.meta.url));
 assert.equal(data.beginnerGuessingWords.length,500);
 assert.equal(data.intermediateGuessingWords.length,500);
 assert.equal(data.advancedGuessingWords.length,500);
 assert.equal(data.guessingWords.length,1500);
 assert.equal(new Set(data.guessingWords.map(item=>item.word.trim().toLowerCase())).size,1500);
 assert.equal(new Set(data.guessingWords.map(item=>item.id)).size,1500);
 assert.ok(data.guessingWords.every(item=>item.word&&item.korean&&item.level&&item.speakingQuestions.length===2&&item.speakingQuestions.every(Boolean)));
 assert.equal(data.guessingWords.reduce((total,item)=>total+item.speakingQuestions.length,0),3000);
 assert.deepEqual(data.validateGuessingWords(),[]);
 assert.equal(data.guessingWordsStats.koreanMeanings,1500);
 assert.equal(data.guessingWordsStats.missingKorean,0);
 assert.equal(data.guessingWordsStats.speakingQuestions,3000);
 assert.equal(data.guessingWordsStats.missingQuestions,0);
});

test("Guessing Words is an internal Activity with no legacy v0 dependency",async()=>{
 const [registry,detail,game]=await Promise.all([
  readFile(new URL("../data/activities.ts",import.meta.url),"utf8"),
  readFile(new URL("../components/activity-detail.tsx",import.meta.url),"utf8"),
  readFile(new URL("../components/2026-08-20-guessing-words-game.tsx",import.meta.url),"utf8"),
 ]);
 const block=registry.split('id: "guessing-words"')[1].split("},")[0];
 assert.match(block,/externalUrl: ""/);
 assert.match(block,/sourceType: "internal"/);
 assert.doesNotMatch(block,/v0-101language101\.vercel\.app/);
 assert.match(detail,/activity\.id === "guessing-words"[\s\S]*?<GuessingWordsGame\/>/);
 for(const forbidden of ["iframe","window.open","redirect(","externalUrl"])assert.ok(!game.includes(forbidden),`found forbidden Guessing Words dependency: ${forbidden}`);
});

test("Guessing Words implements reveal-first random play, timer controls, scoring, and mobile-safe UI",async()=>{
 const [game,css]=await Promise.all([
  readFile(new URL("../components/2026-08-20-guessing-words-game.tsx",import.meta.url),"utf8"),
  readFile(new URL("../components/2026-08-20-guessing-words-game.css",import.meta.url),"utf8"),
 ]);
 for(const contract of ["TAP TO REVEAL","Tap when you&apos;re ready","DON&apos;T SAY THE WORD!","SPEAKING QUESTIONS","TIME'S UP!","CORRECT","SKIP","Pause","Resume","Reset","Math.random","usedIds"])assert.ok(game.includes(contract),`missing ${contract}`);
 assert.match(game,/current\.korean/);
 assert.match(game,/500 Words/);
 assert.match(game,/\/ 500/);
 for(const seconds of [30,45,60,90,0])assert.match(game,new RegExp(`\\b${seconds}\\b`));
 assert.match(css,/@media\(max-width:520px\)/);
 assert.match(css,/min-height:250px/);
 assert.doesNotMatch(css,/overflow-x:\s*(?:auto|scroll)/);
 assert.match(css,/@media\(prefers-color-scheme:dark\)/);
});
