"use client";

import "./2026-08-20-guessing-words-game.css";
import { Check,ChevronLeft,Eye,Pause,Play,RotateCcw,SkipForward,Timer } from "lucide-react";
import { useCallback,useEffect,useMemo,useRef,useState } from "react";
import { guessingWordsByLevel,type GuessingWord,type GuessingWordsLevel } from "@/data/2026-08-20-guessing-words";
import { multilingualGuessingWords,multilingualSpeakingQuestions } from "@/data/2026-10-23-multilingual-guessing-words";
import { useLanguage } from "@/hooks/use-language";

const TIMER_KEY="language101-guessing-words-timer";
const timerOptions=[30,45,60,90,0] as const;
type Phase="setup"|"game";

function pickRandom(pool:GuessingWord[],used:Set<string>,currentId?:string){
 const fresh=pool.filter(item=>!used.has(item.id)&&item.id!==currentId);
 const candidates=fresh.length?fresh:pool.filter(item=>item.id!==currentId);
 return candidates[Math.floor(Math.random()*candidates.length)]??pool[0];
}

export function GuessingWordsGame(){
 const {language}=useLanguage();
 const ui={
  en:{title:"Guessing Words",description:"Describe the word without saying it. Can your teammates guess it?",timer:"Choose a Timer",noTimer:"No Timer",seconds:"sec",levels:["Beginner","Intermediate","Upper Intermediate","Advanced"],words:"Words",practical:"TOEIC & Practical",word:"Word",played:"Played",correct:"Correct",skipped:"Skipped",yourWord:"YOUR WORD",reveal:"TAP TO REVEAL",ready:"Tap when you're ready",describe:"DESCRIBE THE WORD",rule:"Explain this word in the selected language without saying the word itself.",questions:"SPEAKING QUESTIONS",pause:"Pause",resume:"Resume",reset:"Reset",timeUp:"TIME'S UP!",back:"Back to level selection"},
  ko:{title:"단어 맞히기",description:"정답 단어를 말하지 않고 설명해 동료가 맞히게 해보세요.",timer:"타이머 선택",noTimer:"타이머 없음",seconds:"초",levels:["초급","중급","중상급","고급"],words:"단어",practical:"실전 및 TOEIC",word:"단어",played:"진행",correct:"정답",skipped:"건너뜀",yourWord:"나의 단어",reveal:"단어 확인하기",ready:"준비되면 눌러주세요",describe:"단어를 설명하세요",rule:"정답을 직접 말하지 말고 선택한 학습 언어로 설명하세요.",questions:"말하기 질문",pause:"일시정지",resume:"계속",reset:"초기화",timeUp:"시간 종료!",back:"난이도 선택으로 돌아가기"},
  ja:{title:"単語当て",description:"答えの単語を言わずに説明し、仲間に当ててもらいましょう。",timer:"タイマーを選択",noTimer:"タイマーなし",seconds:"秒",levels:["初級","中級","中上級","上級"],words:"単語",practical:"実践・TOEIC",word:"単語",played:"プレイ",correct:"正解",skipped:"スキップ",yourWord:"あなたの単語",reveal:"タップして表示",ready:"準備ができたらタップ",describe:"単語を説明",rule:"答えを言わずに、選択した学習言語で説明してください。",questions:"スピーキング質問",pause:"一時停止",resume:"再開",reset:"リセット",timeUp:"タイムアップ！",back:"レベル選択に戻る"},
  zh:{title:"猜词",description:"不说出答案词，用目标语言描述并让队友猜。",timer:"选择计时器",noTimer:"不计时",seconds:"秒",levels:["初级","中级","中高级","高级"],words:"个单词",practical:"实用与 TOEIC",word:"单词",played:"已练习",correct:"正确",skipped:"跳过",yourWord:"你的单词",reveal:"点击显示",ready:"准备好后点击",describe:"描述这个单词",rule:"不要直接说出答案，请使用所选学习语言描述。",questions:"口语问题",pause:"暂停",resume:"继续",reset:"重置",timeUp:"时间到！",back:"返回级别选择"}
 }[language];
 const [phase,setPhase]=useState<Phase>("setup");
 const [level,setLevel]=useState<GuessingWordsLevel>("beginner");
 const [timerSeconds,setTimerSeconds]=useState<number>(60);
 const [remaining,setRemaining]=useState(60);
 const [running,setRunning]=useState(false);
 const [revealed,setRevealed]=useState(false);
 const [timeUp,setTimeUp]=useState(false);
 const [current,setCurrent]=useState<GuessingWord>(guessingWordsByLevel.beginner[0]);
 const [usedIds,setUsedIds]=useState<string[]>([]);
 const [stats,setStats]=useState({played:0,correct:0,skipped:0});
 const deadline=useRef(0);

 useEffect(()=>{const timer=window.setTimeout(()=>{const raw=localStorage.getItem(TIMER_KEY);if(raw===null)return;const stored=Number(raw);if(timerOptions.includes(stored as typeof timerOptions[number])){setTimerSeconds(stored);setRemaining(stored)}},0);return()=>clearTimeout(timer)},[]);
 useEffect(()=>{if(!running||timerSeconds===0)return;const interval=window.setInterval(()=>{const next=Math.max(0,Math.ceil((deadline.current-Date.now())/1000));setRemaining(next);if(next===0){setRunning(false);setTimeUp(true);if("vibrate" in navigator)navigator.vibrate([250,100,500])}},100);return()=>window.clearInterval(interval)},[running,timerSeconds]);
 const pool=guessingWordsByLevel[level];
 const progress=timerSeconds===0?1:remaining/Math.max(1,timerSeconds);
 const clock=useMemo(()=>timerSeconds===0?"∞":`00:${String(remaining).padStart(2,"0")}`,[remaining,timerSeconds]);
 const localizedPool=multilingualGuessingWords.filter(item=>item.level===level);
 const localizedIndex=[...current.id].reduce((sum,char)=>sum+char.charCodeAt(0),0)%localizedPool.length;
 const localizedWord=localizedPool[localizedIndex];
 const displayWord=language==="en"?current.word:localizedWord.term[language];
 const displayMeaning=language==="en"?current.korean:"";
 const displayQuestions=language==="en"?current.speakingQuestions:multilingualSpeakingQuestions(localizedWord,language);

 function chooseTimer(value:number){setTimerSeconds(value);setRemaining(value);localStorage.setItem(TIMER_KEY,String(value))}
 function begin(selected:GuessingWordsLevel){const selectedPool=guessingWordsByLevel[selected];const word=pickRandom(selectedPool,new Set());setLevel(selected);setCurrent(word);setUsedIds([word.id]);setStats({played:0,correct:0,skipped:0});setRemaining(timerSeconds);setRevealed(false);setTimeUp(false);setRunning(false);setPhase("game")}
 function reveal(){if(revealed)return;setRevealed(true);setTimeUp(false);setStats(value=>({...value,played:value.played+1}));if(timerSeconds>0){setRemaining(timerSeconds);deadline.current=Date.now()+timerSeconds*1000;setRunning(true)}}
 const nextWord=useCallback((result:"correct"|"skipped")=>{const used=new Set(usedIds);const word=pickRandom(pool,used,current.id);const nextUsed=used.size>=pool.length?[word.id]:[...usedIds,word.id];setStats(value=>({...value,correct:value.correct+(result==="correct"?1:0),skipped:value.skipped+(result==="skipped"?1:0)}));setUsedIds(nextUsed);setCurrent(word);setRevealed(false);setRunning(false);setTimeUp(false);setRemaining(timerSeconds)},[current.id,pool,timerSeconds,usedIds]);
 function pause(){setRemaining(Math.max(0,Math.ceil((deadline.current-Date.now())/1000)));setRunning(false)}
 function resume(){if(timerSeconds===0||remaining<=0)return;deadline.current=Date.now()+remaining*1000;setTimeUp(false);setRunning(true)}
 function resetTimer(){setRunning(false);setTimeUp(false);setRemaining(timerSeconds);if(revealed&&timerSeconds>0){deadline.current=Date.now()+timerSeconds*1000;setRunning(true)}}
 function exitGame(){setRunning(false);setPhase("setup");setRevealed(false);setTimeUp(false)}

 if(phase==="setup")return <section className="guessing-game guessing-setup" data-no-activity-translate>
  <div className="guessing-mark"><Eye aria-hidden="true"/></div><p className="guessing-kicker">{ui.title}</p>
  <h1>{ui.description}</h1>
  <fieldset className="guessing-timer-select"><legend><Timer/> {ui.timer}</legend><div>{timerOptions.map(value=><button type="button" className={timerSeconds===value?"is-active":""} onClick={()=>chooseTimer(value)} key={value}>{value?`${value} ${ui.seconds}`:ui.noTimer}</button>)}</div></fieldset>
  <div className="guessing-levels">
   <button type="button" onClick={()=>begin("beginner")}><span className="level-dot beginner"/><strong>{ui.levels[0]}</strong><small>500 {ui.words}</small><Play/></button>
   <button type="button" onClick={()=>begin("intermediate")}><span className="level-dot intermediate"/><strong>{ui.levels[1]}</strong><small>500 {ui.words}</small><Play/></button>
   <button type="button" onClick={()=>begin("upper-intermediate")}><span className="level-dot upper-intermediate"/><strong>{ui.levels[2]}</strong><small>500 {ui.words} · {ui.practical}</small><Play/></button>
   <button type="button" onClick={()=>begin("advanced")}><span className="level-dot advanced"/><strong>{ui.levels[3]}</strong><small>500 {ui.words}</small><Play/></button>
  </div>
 </section>;

 return <section className="guessing-game guessing-round" data-no-activity-translate>
  <header><button type="button" onClick={exitGame} aria-label={ui.back}><ChevronLeft/></button><div><p>{ui.title}</p><h1>{ui.levels[["beginner","intermediate","upper-intermediate","advanced"].indexOf(level)]}</h1></div><span>{ui.word} {Math.min(stats.played+1,500)} / 500</span></header>
  <div className="guessing-stats" aria-label={ui.title}><span><b>{stats.played}</b> {ui.played}</span><span><b>{stats.correct}</b> {ui.correct}</span><span><b>{stats.skipped}</b> {ui.skipped}</span></div>
  <div className={`guessing-clock${timeUp?" is-up":""}`} style={{"--timer-progress":`${progress*360}deg`} as React.CSSProperties}><strong>{timeUp?ui.timeUp:clock}</strong></div>
  <button type="button" className={`guessing-word-card${revealed?" is-revealed":""}`} onClick={reveal} aria-label={revealed?displayWord:ui.reveal}>
   {revealed?<span className="guessing-card-content guessing-card-back"><small>{ui.yourWord}</small><strong>{displayWord}</strong>{displayMeaning&&<span className="guessing-korean-meaning">{displayMeaning}</span>}<b>{ui.describe}</b></span>:<span className="guessing-card-content guessing-card-front"><Eye/><strong>{ui.reveal}</strong><small>{ui.ready}</small></span>}
  </button>
  {revealed&&<div className="guessing-reveal-content">
   <section className="guessing-rule"><b>{ui.describe}</b><p>{ui.rule}</p></section>
   <section className="guessing-questions"><b>{ui.questions}</b><ol>{displayQuestions.map(question=><li key={question}>{question}</li>)}</ol></section>
   <div className="guessing-timer-actions">{timerSeconds>0&&(running?<button type="button" onClick={pause}><Pause/>{ui.pause}</button>:<button type="button" onClick={resume} disabled={remaining===0}><Play/>{ui.resume}</button>)}<button type="button" onClick={resetTimer}><RotateCcw/>{ui.reset}</button></div>
   <div className="guessing-result-actions"><button type="button" className="is-correct" onClick={()=>nextWord("correct")}><Check/>{ui.correct}</button><button type="button" onClick={()=>nextWord("skipped")}><SkipForward/>{ui.skipped}</button></div>
  </div>}
 </section>;
}
