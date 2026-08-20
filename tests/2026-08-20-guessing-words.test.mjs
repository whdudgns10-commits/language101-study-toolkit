import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("Guessing Words contains exactly nine hundred complete unique learning words",async()=>{
 const data=await import(new URL(`../data/2026-08-20-guessing-words.ts?test=${Date.now()}`,import.meta.url));
 assert.equal(data.beginnerGuessingWords.length,300);
 assert.equal(data.intermediateGuessingWords.length,300);
 assert.equal(data.advancedGuessingWords.length,300);
 assert.equal(data.guessingWords.length,900);
 assert.equal(new Set(data.guessingWords.map(item=>item.word.trim().toLowerCase())).size,900);
 assert.equal(new Set(data.guessingWords.map(item=>item.id)).size,900);
 assert.ok(data.guessingWords.every(item=>item.word&&item.level&&item.speakingQuestions.length===2&&item.speakingQuestions.every(Boolean)));
 assert.deepEqual(data.validateGuessingWords(),[]);
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
 for(const seconds of [30,45,60,90,0])assert.match(game,new RegExp(`\\b${seconds}\\b`));
 assert.match(css,/@media\(max-width:520px\)/);
 assert.match(css,/min-height:250px/);
 assert.doesNotMatch(css,/overflow-x:\s*(?:auto|scroll)/);
 assert.match(css,/@media\(prefers-color-scheme:dark\)/);
});
