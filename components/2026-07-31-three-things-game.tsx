"use client";
import "./2026-07-31-three-things-game.css";
import Link from "next/link";
import { AlarmClock,ArrowLeft,Check,Dices,History,Play,RotateCcw,Shuffle,Trophy,X } from "lucide-react";
import { useCallback,useEffect,useMemo,useRef,useState } from "react";
import { activeThreeThingsPlayers,createThreeThingsGame,judgeThreeThingsTurn,nextThreeThingsPlayerIndex,pickThreeThingsQuestion,threeThingsCategories,threeThingsQuestions } from "@/lib/2026-07-31-three-things-engine";
import type { ThreeThingsSettings,ThreeThingsState } from "@/types/2026-07-31-three-things";
import { useLanguage } from "@/hooks/use-language";

const SETTINGS_KEY="language101-three-things-settings";
const HISTORY_KEY="language101-three-things-recent";
type Phase="setup"|"game";

export function ThreeThingsGame(){
 const {language}=useLanguage();const ko=language==="ko";
 const [phase,setPhase]=useState<Phase>("setup");const [count,setCount]=useState(4);const [names,setNames]=useState<string[]>(Array(20).fill(""));
 const [settings,setSettings]=useState<ThreeThingsSettings>({seconds:5,randomStart:true,category:"전체"});
 const [game,setGame]=useState<ThreeThingsState|null>(null);const [remaining,setRemaining]=useState(5);const [timing,setTiming]=useState(false);
 const [timedOut,setTimedOut]=useState(false);const [showHistory,setShowHistory]=useState(false);const deadline=useRef(0);const alarmed=useRef(false);
 useEffect(()=>{queueMicrotask(()=>{try{const stored=JSON.parse(localStorage.getItem(SETTINGS_KEY)??"null");if(stored)setSettings(stored)}catch{}})},[]);
 const question=useMemo(()=>threeThingsQuestions.find(item=>item.id===game?.questionId)??threeThingsQuestions[0],[game?.questionId]);
 const current=game?.players[game.currentIndex];const alive=game?activeThreeThingsPlayers(game):[];const next=game?game.players[nextThreeThingsPlayerIndex(game)]:null;
 const signalTimeout=useCallback(()=>{if(alarmed.current)return;alarmed.current=true;setTimedOut(true);if("vibrate"in navigator)navigator.vibrate([350,100,650]);try{const audio=new Audio("/2026-07-25-timer-end.wav");audio.play().catch(()=>{})}catch{}},[]);
 useEffect(()=>{if(!timing||settings.seconds===0)return;const timer=window.setInterval(()=>{const value=Math.max(0,Math.ceil((deadline.current-Date.now())/1000));setRemaining(value);if(value===0){setTiming(false);signalTimeout()}},100);return()=>window.clearInterval(timer)},[timing,settings.seconds,signalTimeout]);
 useEffect(()=>{if(!timedOut)return;const timer=window.setTimeout(()=>{setGame(currentGame=>{if(!currentGame)return currentGame;let nextState=judgeThreeThingsTurn(currentGame,false);if(nextState.phase!=="finished")nextState=pickThreeThingsQuestion(nextState);localStorage.setItem(HISTORY_KEY,JSON.stringify(nextState.recentIds));return nextState});setTimedOut(false);setRemaining(settings.seconds)},1200);return()=>window.clearTimeout(timer)},[timedOut,settings.seconds]);
 function persist(next:ThreeThingsSettings){setSettings(next);localStorage.setItem(SETTINGS_KEY,JSON.stringify(next))}
 function startGame(){let next=createThreeThingsGame(names.slice(0,count),settings);try{next={...next,recentIds:JSON.parse(localStorage.getItem(HISTORY_KEY)??"[]")}}catch{}next=pickThreeThingsQuestion(next);setGame(next);setRemaining(settings.seconds);setPhase("game")}
 function shuffle(){if(!game)return;const next=pickThreeThingsQuestion(game);setGame(next);localStorage.setItem(HISTORY_KEY,JSON.stringify(next.recentIds));setTimedOut(false);setRemaining(settings.seconds);setTiming(false)}
 function startTimer(){alarmed.current=false;setTimedOut(false);if(settings.seconds===0){setGame(value=>value?{...value,phase:"judging"}:value);return}setRemaining(settings.seconds);deadline.current=Date.now()+settings.seconds*1000;setTiming(true);setGame(value=>value?{...value,phase:"running"}:value)}
 function judge(success:boolean){if(!game)return;let nextState=judgeThreeThingsTurn(game,success);setTiming(false);setTimedOut(false);if(nextState.phase!=="finished")nextState=pickThreeThingsQuestion(nextState);setGame(nextState);localStorage.setItem(HISTORY_KEY,JSON.stringify(nextState.recentIds));setRemaining(settings.seconds)}
 function reset(){setGame(null);setPhase("setup");setTiming(false);setTimedOut(false)}
 function randomPlayer(){if(!game)return;const candidates=game.players.map((player,index)=>({player,index})).filter(item=>!item.player.out&&item.index!==game.currentIndex);const item=candidates[Math.floor(Math.random()*candidates.length)];if(item)setGame({...game,currentIndex:item.index})}
 if(phase==="setup")return <main className="three-page"><header><Link href="/activities/3-things-5-seconds"><ArrowLeft/>3 Things</Link></header><section className="three-card three-setup"><AlarmClock/><h1>{ko?"5초 안에 3가지 말하기":"3 Things in 5 Seconds"}</h1><b>Think Fast Challenge</b><p>{ko?"주제에 맞는 세 가지를 제한 시간 안에 말하세요.":"Name three things before the timer runs out."}</p>
 <label>{ko?"참가자":"Players"}<span><button disabled={count<=2} onClick={()=>setCount(value=>value-1)}>−</button><strong>{count}</strong><button disabled={count>=20} onClick={()=>setCount(value=>value+1)}>+</button></span></label>
 <div className="three-names">{Array.from({length:count},(_,index)=><input key={index} value={names[index]} placeholder={`Player ${index+1}`} onChange={event=>setNames(values=>values.map((value,i)=>i===index?event.target.value:value))}/>)}</div>
 <fieldset><legend>{ko?"타이머":"Timer"}</legend>{([3,5,7,10,0] as const).map(value=><button className={settings.seconds===value?"is-active":""} onClick={()=>persist({...settings,seconds:value})} key={value}>{value?`${value}s`:ko?"제한 없음":"No limit"}</button>)}</fieldset>
 <label>{ko?"카테고리":"Category"}<select value={settings.category} onChange={event=>persist({...settings,category:event.target.value})}>{threeThingsCategories.map(category=><option key={category}>{category}</option>)}</select></label>
 <label className="three-toggle"><input type="checkbox" checked={settings.randomStart} onChange={event=>persist({...settings,randomStart:event.target.checked})}/>{ko?"랜덤 시작":"Random start"}</label>
 <button className="three-primary" onClick={startGame}><Play/>{ko?"게임 시작":"Start Game"}</button></section></main>;
 if(!game)return null;
 if(game.phase==="finished")return <main className="three-page"><section className="three-card three-winner"><Trophy/><small>WINNER</small><h1>{alive[0]?.name??"—"}</h1><div className="three-player-grid">{game.players.map(player=><article className={player.out?"is-out":""} key={player.id}><b>{player.name}</b><span>{player.out?"OUT":"SURVIVOR"}</span></article>)}</div><button className="three-primary" onClick={reset}><RotateCcw/>{ko?"다시 하기":"Play Again"}</button></section></main>;
 const progress=settings.seconds?remaining/settings.seconds:1;const circumference=2*Math.PI*82;
 return <main className={`three-page${timedOut?" is-timeout":""}`}><header><button onClick={reset}><ArrowLeft/>{ko?"종료":"Exit"}</button><span>Round {game.round}</span></header><section className="three-game-status"><div><small>{ko?"현재 플레이어":"Current Player"}</small><strong>{current?.name}</strong></div><div><small>{ko?"다음 플레이어":"Up Next"}</small><b>{alive.length>1?next?.name:"—"}</b></div></section>
 <section className="three-card three-question"><span>{question.category} · {question.difficulty}</span><h1>{ko?question.ko:question.en}</h1><p><b>{question.count}</b>{ko?"가지를 말하세요":" things"}</p></section>
 <section className="three-clock" role="timer" aria-label={`${remaining} seconds`}><svg viewBox="0 0 190 190"><circle cx="95" cy="95" r="82"/><circle className="three-progress" cx="95" cy="95" r="82" style={{strokeDasharray:circumference,strokeDashoffset:circumference*(1-progress)}}/></svg><strong>{settings.seconds===0?"∞":remaining}</strong></section>
 {timedOut&&<div className="three-timeout" role="alert"><AlarmClock/><b>TIME OUT</b></div>}
 <div className="three-actions">{!timing&&game.phase!=="running"&&<button className="three-primary" onClick={startTimer}><Play/>Start Timer</button>}{timing&&<button disabled><AlarmClock/>{ko?"진행 중":"Running"}</button>}<button className="is-success" onClick={()=>judge(true)}><Check/>Success</button><button className="is-fail" onClick={()=>judge(false)}><X/>Failed</button></div>
 <div className="three-tools"><button onClick={shuffle}><Shuffle/>Shuffle</button><button onClick={shuffle}>Skip</button><button onClick={randomPlayer}><Dices/>{ko?"랜덤 플레이어":"Random Player"}</button><button onClick={()=>setShowHistory(value=>!value)}><History/>{ko?"최근 질문":"Recent"}</button></div>
 {showHistory&&<section className="three-history"><h2>{ko?"최근 질문":"Recent Questions"}</h2>{game.recentIds.slice(-30).reverse().map(id=>{const item=threeThingsQuestions.find(value=>value.id===id);return <p key={id}>{item&&(ko?item.ko:item.en)}</p>})}</section>}
 <section className="three-player-grid">{game.players.map((player,index)=><button className={`${player.out?"is-out":""}${index===game.currentIndex?" is-current":""}`} disabled={player.out} onClick={()=>setGame({...game,currentIndex:index})} key={player.id}><b>{player.name}</b><span>{player.out?"OUT":index===game.currentIndex?"NOW":"READY"}</span></button>)}</section></main>
}
