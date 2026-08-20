"use client";

import "./2026-08-20-guessing-words-game.css";
import { Check,ChevronLeft,Eye,Pause,Play,RotateCcw,SkipForward,Timer } from "lucide-react";
import { useCallback,useEffect,useMemo,useRef,useState } from "react";
import { guessingWordsByLevel,type GuessingWord,type GuessingWordsLevel } from "@/data/2026-08-20-guessing-words";

const TIMER_KEY="language101-guessing-words-timer";
const timerOptions=[30,45,60,90,0] as const;
type Phase="setup"|"game";

function pickRandom(pool:GuessingWord[],used:Set<string>,currentId?:string){
 const fresh=pool.filter(item=>!used.has(item.id)&&item.id!==currentId);
 const candidates=fresh.length?fresh:pool.filter(item=>item.id!==currentId);
 return candidates[Math.floor(Math.random()*candidates.length)]??pool[0];
}

export function GuessingWordsGame(){
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

 function chooseTimer(value:number){setTimerSeconds(value);setRemaining(value);localStorage.setItem(TIMER_KEY,String(value))}
 function begin(selected:GuessingWordsLevel){const selectedPool=guessingWordsByLevel[selected];const word=pickRandom(selectedPool,new Set());setLevel(selected);setCurrent(word);setUsedIds([word.id]);setStats({played:0,correct:0,skipped:0});setRemaining(timerSeconds);setRevealed(false);setTimeUp(false);setRunning(false);setPhase("game")}
 function reveal(){if(revealed)return;setRevealed(true);setTimeUp(false);setStats(value=>({...value,played:value.played+1}));if(timerSeconds>0){setRemaining(timerSeconds);deadline.current=Date.now()+timerSeconds*1000;setRunning(true)}}
 const nextWord=useCallback((result:"correct"|"skipped")=>{const used=new Set(usedIds);const word=pickRandom(pool,used,current.id);const nextUsed=used.size>=pool.length?[word.id]:[...usedIds,word.id];setStats(value=>({...value,correct:value.correct+(result==="correct"?1:0),skipped:value.skipped+(result==="skipped"?1:0)}));setUsedIds(nextUsed);setCurrent(word);setRevealed(false);setRunning(false);setTimeUp(false);setRemaining(timerSeconds)},[current.id,pool,timerSeconds,usedIds]);
 function pause(){setRemaining(Math.max(0,Math.ceil((deadline.current-Date.now())/1000)));setRunning(false)}
 function resume(){if(timerSeconds===0||remaining<=0)return;deadline.current=Date.now()+remaining*1000;setTimeUp(false);setRunning(true)}
 function resetTimer(){setRunning(false);setTimeUp(false);setRemaining(timerSeconds);if(revealed&&timerSeconds>0){deadline.current=Date.now()+timerSeconds*1000;setRunning(true)}}
 function exitGame(){setRunning(false);setPhase("setup");setRevealed(false);setTimeUp(false)}

 if(phase==="setup")return <section className="guessing-game guessing-setup" data-no-activity-translate>
  <div className="guessing-mark"><Eye aria-hidden="true"/></div><p className="guessing-kicker">GUESSING WORDS</p>
  <h1>Describe the word without saying it.<br/>Can your teammates guess it?</h1>
  <fieldset className="guessing-timer-select"><legend><Timer/> Choose a Timer</legend><div>{timerOptions.map(value=><button type="button" className={timerSeconds===value?"is-active":""} onClick={()=>chooseTimer(value)} key={value}>{value?`${value} sec`:"No Timer"}</button>)}</div></fieldset>
  <div className="guessing-levels">
   <button type="button" onClick={()=>begin("beginner")}><span className="level-dot beginner"/><strong>Beginner</strong><small>500 Words</small><Play/></button>
   <button type="button" onClick={()=>begin("intermediate")}><span className="level-dot intermediate"/><strong>Intermediate</strong><small>500 Words</small><Play/></button>
   <button type="button" onClick={()=>begin("advanced")}><span className="level-dot advanced"/><strong>Advanced</strong><small>500 Words</small><Play/></button>
  </div>
 </section>;

 return <section className="guessing-game guessing-round" data-no-activity-translate>
  <header><button type="button" onClick={exitGame} aria-label="Back to level selection"><ChevronLeft/></button><div><p>GUESSING WORDS</p><h1>{level}</h1></div><span>Word {Math.min(stats.played+1,500)} / 500</span></header>
  <div className="guessing-stats" aria-label="Game statistics"><span><b>{stats.played}</b> Played</span><span><b>{stats.correct}</b> Correct</span><span><b>{stats.skipped}</b> Skipped</span></div>
  <div className={`guessing-clock${timeUp?" is-up":""}`} style={{"--timer-progress":`${progress*360}deg`} as React.CSSProperties}><strong>{timeUp?"TIME'S UP!":clock}</strong></div>
  <button type="button" className={`guessing-word-card${revealed?" is-revealed":""}`} onClick={reveal} aria-label={revealed?`Revealed word: ${current.word}`:"Tap to reveal the word"}>
   {revealed?<span className="guessing-card-content guessing-card-back"><small>YOUR WORD</small><strong>{current.word.toLocaleUpperCase("en-US")}</strong><span className="guessing-korean-meaning">{current.korean}</span><b>DON&apos;T SAY THE WORD!</b></span>:<span className="guessing-card-content guessing-card-front"><Eye/><strong>TAP TO REVEAL</strong><small>Tap when you&apos;re ready</small></span>}
  </button>
  {revealed&&<div className="guessing-reveal-content">
   <section className="guessing-rule"><b>DESCRIBE THE WORD</b><p>Explain this word in English without saying the word itself.</p></section>
   <section className="guessing-questions"><b>SPEAKING QUESTIONS</b><ol>{current.speakingQuestions.map(question=><li key={question}>{question}</li>)}</ol></section>
   <div className="guessing-timer-actions">{timerSeconds>0&&(running?<button type="button" onClick={pause}><Pause/>Pause</button>:<button type="button" onClick={resume} disabled={remaining===0}><Play/>Resume</button>)}<button type="button" onClick={resetTimer}><RotateCcw/>Reset</button></div>
   <div className="guessing-result-actions"><button type="button" className="is-correct" onClick={()=>nextWord("correct")}><Check/>CORRECT</button><button type="button" onClick={()=>nextWord("skipped")}><SkipForward/>SKIP</button></div>
  </div>}
 </section>;
}
