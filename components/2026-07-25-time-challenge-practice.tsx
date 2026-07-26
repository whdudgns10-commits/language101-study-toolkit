"use client";

import Link from "next/link";
import { AlarmClock,ArrowLeft,Expand,Pause,Play,RotateCcw,Shuffle,Volume2,VolumeX,X } from "lucide-react";
import { useCallback,useEffect,useMemo,useRef,useState } from "react";
import { timeChallengeQuestions,type TimeChallengeDifficulty } from "@/data/2026-07-25-time-challenge";
import { readTimeChallengePenalties,readTimeChallengeSettings,saveTimeChallengeSettings } from "@/lib/2026-07-25-time-challenge-storage";
import { useLanguage } from "@/hooks/use-language";

type Phase="idle"|"running"|"paused"|"finished";
const copy={
 en:{title:"Time Challenge",subtitle:"Answer before the timer ends.",lead:"Choose a timer and start speaking.",minute:"minute",minutes:"minutes",start:"Start Timer",pause:"Pause",resume:"Resume",reset:"Reset",question:"Random Question",penalty:"Random Penalty",timesUp:"Time's Up!",penaltyTime:"Penalty Time!",difficulty:"Difficulty",sound:"Sound",fullscreen:"Full Screen",presentation:"Presentation Mode",exit:"Exit Presentation",admin:"Edit Penalty List",remaining:"Time remaining"},
 ko:{title:"타임 챌린지",subtitle:"타이머가 끝나기 전에 대답하세요.",lead:"시간을 선택하고 영어로 말해보세요.",minute:"분",minutes:"분",start:"타이머 시작",pause:"일시정지",resume:"계속",reset:"초기화",question:"랜덤 질문",penalty:"랜덤 벌칙",timesUp:"시간 종료!",penaltyTime:"벌칙 시간!",difficulty:"난이도",sound:"소리",fullscreen:"전체 화면",presentation:"프레젠테이션 모드",exit:"프레젠테이션 종료",admin:"벌칙 목록 편집",remaining:"남은 시간"},
 zh:{title:"限时挑战",subtitle:"在计时结束前回答。",lead:"选择时间并开始说英语。",minute:"分钟",minutes:"分钟",start:"开始计时",pause:"暂停",resume:"继续",reset:"重置",question:"随机问题",penalty:"随机惩罚",timesUp:"时间到！",penaltyTime:"惩罚时间！",difficulty:"难度",sound:"声音",fullscreen:"全屏",presentation:"演示模式",exit:"退出演示",admin:"编辑惩罚列表",remaining:"剩余时间"},
 ja:{title:"タイムチャレンジ",subtitle:"タイマーが終わる前に答えよう。",lead:"時間を選んで英語で話しましょう。",minute:"分",minutes:"分",start:"タイマー開始",pause:"一時停止",resume:"再開",reset:"リセット",question:"ランダム質問",penalty:"ランダム罰ゲーム",timesUp:"タイムアップ！",penaltyTime:"罰ゲームタイム！",difficulty:"難易度",sound:"サウンド",fullscreen:"全画面",presentation:"プレゼンテーションモード",exit:"プレゼンテーション終了",admin:"罰ゲーム一覧を編集",remaining:"残り時間"}
} as const;
const difficultyLabels:Record<TimeChallengeDifficulty,string>={beginner:"Beginner",intermediate:"Intermediate","upper-intermediate":"Upper Intermediate",advanced:"Advanced"};

export function TimeChallengePractice(){
 const {language}=useLanguage();const c=copy[language];
 const [minutes,setMinutes]=useState<1|2|3|4|5>(1);const [sound,setSound]=useState(true);const [difficulty,setDifficulty]=useState<TimeChallengeDifficulty>("beginner");const [remaining,setRemaining]=useState(60);const [phase,setPhase]=useState<Phase>("idle");const [question,setQuestion]=useState("");const [penalty,setPenalty]=useState("");const [recentQuestions,setRecentQuestions]=useState<string[]>([]);const [presentation,setPresentation]=useState(false);const [flashing,setFlashing]=useState(false);const deadline=useRef(0);const shellRef=useRef<HTMLElement>(null);const alarmed=useRef(false);
 const duration=minutes*60;const progress=duration?remaining/duration:0;const display=`${String(Math.floor(remaining/60)).padStart(2,"0")}:${String(remaining%60).padStart(2,"0")}`;
 const filteredQuestions=useMemo(()=>timeChallengeQuestions.filter(item=>item.difficulty===difficulty),[difficulty]);
 const persist=useCallback((nextMinutes=minutes,nextSound=sound,nextDifficulty=difficulty)=>saveTimeChallengeSettings({minutes:nextMinutes,sound:nextSound,difficulty:nextDifficulty,lastUsedAt:new Date().toISOString()}),[minutes,sound,difficulty]);
 const fallbackBeep=useCallback(()=>{try{const AudioContextClass=window.AudioContext||(window as typeof window&{webkitAudioContext?:typeof AudioContext}).webkitAudioContext;if(!AudioContextClass)return;const context=new AudioContextClass(),oscillator=context.createOscillator(),gain=context.createGain();oscillator.connect(gain);gain.connect(context.destination);oscillator.frequency.setValueAtTime(880,context.currentTime);gain.gain.setValueAtTime(.18,context.currentTime);gain.gain.exponentialRampToValueAtTime(.001,context.currentTime+.7);oscillator.start();oscillator.stop(context.currentTime+.7)}catch{}},[]);
 const signalEnd=useCallback(()=>{if(alarmed.current)return;alarmed.current=true;if("vibrate" in navigator)navigator.vibrate([500,150,500,150,900]);if(sound){const audio=new Audio("/2026-07-25-timer-end.wav");audio.play().catch(fallbackBeep)}setFlashing(true);window.setTimeout(()=>setFlashing(false),1600)},[sound,fallbackBeep]);
 useEffect(()=>{if(phase!=="running")return;const timer=window.setInterval(()=>{const next=Math.max(0,Math.ceil((deadline.current-Date.now())/1000));setRemaining(next);if(next===0){setPhase("finished");signalEnd()}},250);return()=>window.clearInterval(timer)},[phase,signalEnd]);
 useEffect(()=>{const stored=readTimeChallengeSettings();queueMicrotask(()=>{setMinutes(stored.minutes);setSound(stored.sound);setDifficulty(stored.difficulty);setRemaining(stored.minutes*60)})},[]);
 useEffect(()=>{const handler=()=>{if(!document.fullscreenElement)setPresentation(false)};document.addEventListener("fullscreenchange",handler);return()=>document.removeEventListener("fullscreenchange",handler)},[]);
 function selectMinutes(value:1|2|3|4|5){setMinutes(value);setRemaining(value*60);setPhase("idle");alarmed.current=false;persist(value)}
 function start(){alarmed.current=false;setPenalty("");setRemaining(duration);deadline.current=Date.now()+duration*1000;setPhase("running");persist()}
 function pause(){const next=Math.max(0,Math.ceil((deadline.current-Date.now())/1000));setRemaining(next);setPhase("paused")}
 function resume(){deadline.current=Date.now()+remaining*1000;setPhase("running")}
 function reset(){alarmed.current=false;setRemaining(duration);setPhase("idle");setFlashing(false);setPenalty("")}
 function randomQuestion(){const recent=new Set(recentQuestions.slice(-10));let pool=filteredQuestions.filter(item=>!recent.has(item.id));if(!pool.length)pool=filteredQuestions;const item=pool[Math.floor(Math.random()*pool.length)];if(item){setQuestion(item.question);setRecentQuestions(items=>[...items,item.id].slice(-10))}}
 function randomPenalty(){const items=readTimeChallengePenalties();if(!items.length){setPenalty("");return}const pool=items.filter(item=>item.text!==penalty);const item=(pool.length?pool:items)[Math.floor(Math.random()*(pool.length||items.length))];setPenalty(item.text)}
 async function togglePresentation(){if(!presentation){setPresentation(true);try{await shellRef.current?.requestFullscreen()}catch{}}else{setPresentation(false);if(document.fullscreenElement)await document.exitFullscreen()}}
 const circumference=2*Math.PI*138;
 return <main ref={shellRef} className={`time-challenge${presentation?" is-presentation":""}${flashing?" is-flashing":""}`}>
  {!presentation&&<header className="time-challenge-header"><Link href="/activities/time-challenge"><ArrowLeft/>{c.title}</Link><div><button onClick={()=>{const next=!sound;setSound(next);persist(minutes,next)}} aria-label={`${c.sound}: ${sound?"ON":"OFF"}`}>{sound?<Volume2/>:<VolumeX/>}{c.sound} {sound?"ON":"OFF"}</button><button onClick={togglePresentation}><Expand/>{c.fullscreen}</button></div></header>}
  <section className="time-challenge-shell"><div className="time-challenge-title"><span><AlarmClock/> TIME CHALLENGE</span><h1>{c.title}</h1><b>{c.subtitle}</b><p>{c.lead}</p></div>
  {!presentation&&<section className="time-challenge-settings"><div className="time-duration-options" aria-label="Timer duration">{([1,2,3,4,5] as const).map(value=><button aria-pressed={minutes===value} className={minutes===value?"is-active":""} onClick={()=>selectMinutes(value)} key={value}>{value} {value===1?c.minute:c.minutes}</button>)}</div><label>{c.difficulty}<select value={difficulty} onChange={event=>{const next=event.target.value as TimeChallengeDifficulty;setDifficulty(next);persist(minutes,sound,next)}}>{Object.entries(difficultyLabels).map(([value,label])=><option value={value} key={value}>{label}</option>)}</select></label></section>}
  <section className="time-clock-card"><div className="time-progress" aria-label={`${c.remaining}: ${display}`} role="timer"><svg viewBox="0 0 320 320" aria-hidden="true"><circle className="time-track" cx="160" cy="160" r="138"/><circle className="time-value" cx="160" cy="160" r="138" style={{strokeDasharray:circumference,strokeDashoffset:circumference*(1-progress)}}/></svg><strong>{display}</strong></div><div className="time-controls">{phase==="idle"||phase==="finished"?<button className="time-start" onClick={start}><Play/>{c.start}</button>:phase==="running"?<button onClick={pause}><Pause/>{c.pause}</button>:<button onClick={resume}><Play/>{c.resume}</button>}<button onClick={reset}><RotateCcw/>{c.reset}</button></div></section>
  {!presentation&&<section className="time-question-card"><div><button onClick={randomQuestion}><Shuffle/>{c.question}</button><span>{difficultyLabels[difficulty]}</span></div><p>{question||"Why are you studying English?"}</p></section>}
  {phase==="finished"&&<section className="time-up-card" role="alert"><AlarmClock/><h2>{c.timesUp}</h2><strong>{c.penaltyTime}</strong><button onClick={randomPenalty}><Shuffle/>{c.penalty}</button>{penalty&&<p>{penalty}</p>}</section>}
  {!presentation&&<footer className="time-challenge-footer"><button onClick={togglePresentation}><Expand/>{c.presentation}</button><Link href="/admin/activities/time-challenge">{c.admin}</Link></footer>}
  {presentation&&<button className="time-exit-presentation" onClick={togglePresentation}><X/>{c.exit}</button>}</section>
 </main>
}
