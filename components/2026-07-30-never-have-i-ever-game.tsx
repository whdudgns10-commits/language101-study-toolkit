"use client";

import Link from "next/link";
import { ArrowLeft, Check, Clock3, Lightbulb, RotateCcw, ShieldCheck, Sparkles, Trophy, Users, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { experienceHintCategories, experienceHints } from "@/data/2026-07-30-experience-hints";
import {
  advanceTurn,
  alivePlayers,
  beginJudging,
  createSurvivalGame,
  currentLeaders,
  currentSpeaker,
  recordJudgement,
  resolveTurn,
} from "@/lib/2026-07-30-experience-survival-engine";
import {
  clearExperienceSurvival,
  loadExperienceSurvival,
  saveExperienceSurvival,
} from "@/lib/2026-07-30-experience-survival-storage";
import type {
  ExperienceLanguage,
  ExperienceMode,
  ExperienceSurvivalState,
  SurvivalSettings,
} from "@/types/2026-07-30-experience-survival";
import { useLanguage } from "@/hooks/use-language";

const copy = {
  en: {
    title: "Never Have I Ever",
    classic: "Classic Never Have I Ever",
    survival: "Experience Survival",
    survivalTitle: "Only I Have: Survival Game",
    survivalDescription: "Share an experience that you think only you have had. Players who have never had that experience lose one life.",
    start: "Start Game",
    players: "Players",
    lives: "Starting lives",
    bonus: "Unique experience bonus",
    randomStart: "Random starting player",
    language: "Mission language",
    timer: "Turn timer",
    noLimit: "No limit",
    howTo: "How to Play",
    currentTurn: "Current turn",
    prompt: "Share a real experience that you think others may not have had.",
    reveal: "Reveal Experience",
    spoken: "Continue without typing",
    ideas: "View Ideas",
    ideaNotice: "Only share experiences you have actually had. Hints are for inspiration.",
    passTo: "Pass the phone to",
    privateAnswer: "Make sure no one else can see the answer.",
    ready: "I'm ready",
    sameQuestion: "Have you had the same experience as",
    done: "I’ve done it too",
    never: "I’ve never done it",
    nextJudge: "Pass to the next player",
    result: "Turn Result",
    unique: "Unique experience! No one else has done it.",
    common: "Everyone has done it! No one loses a life this turn.",
    bonusApplied: "One life was restored as a bonus.",
    nextTurn: "Next Turn",
    end: "End Game",
    endConfirm: "Are you sure you want to end the game?",
    cancel: "Cancel",
    finish: "End Now",
    eliminated: "Out",
    outMessage: "You’re out of lives!",
    survivor: "Last Survivor",
    joint: "Current Joint Leaders",
    again: "Play Again",
    samePlayers: "Play Again with Same Players",
    setupAgain: "Back to Setup",
    restore: "A saved game was restored.",
    discard: "Discard Saved Game",
  },
  ko: {
    title: "Never Have I Ever",
    classic: "기존 Never Have I Ever",
    survival: "경험 생존전",
    survivalTitle: "나만 해봤어: 생존 게임",
    survivalDescription: "다른 사람들은 해보지 않았을 것 같은 나만의 경험을 말해보세요. 같은 경험이 없는 참가자는 목숨을 잃습니다.",
    start: "게임 시작",
    players: "참가 인원",
    lives: "시작 목숨",
    bonus: "단독 경험 보너스",
    randomStart: "랜덤 시작 참가자",
    language: "표시 언어",
    timer: "턴 제한시간",
    noLimit: "제한 없음",
    howTo: "게임 방법",
    currentTurn: "이번 차례",
    prompt: "다른 사람들이 해보지 않았을 것 같은 실제 경험을 말해주세요.",
    reveal: "경험 공개하기",
    spoken: "입력하지 않고 말로 진행",
    ideas: "아이디어 보기",
    ideaNotice: "실제로 해본 경험만 말해주세요. 힌트는 아이디어를 떠올리는 용도입니다.",
    passTo: "휴대폰을 전달해주세요",
    privateAnswer: "다른 참가자가 선택을 보지 않도록 화면을 가려주세요.",
    ready: "준비됐어요",
    sameQuestion: "같은 경험이 있나요? 발언자:",
    done: "나도 해봤어요",
    never: "해본 적 없어요",
    nextJudge: "다음 참가자에게 넘기기",
    result: "이번 턴 결과",
    unique: "단독 경험 성공! 아무도 같은 경험이 없습니다.",
    common: "모두 해본 경험입니다! 이번 턴에는 아무도 목숨을 잃지 않습니다.",
    bonusApplied: "보너스로 목숨 1개를 회복했습니다.",
    nextTurn: "다음 사람 차례",
    end: "게임 종료",
    endConfirm: "정말 게임을 종료하시겠습니까?",
    cancel: "취소",
    finish: "종료하기",
    eliminated: "탈락",
    outMessage: "목숨을 모두 잃었습니다!",
    survivor: "최후의 생존자",
    joint: "현재 공동 1위",
    again: "다시 하기",
    samePlayers: "같은 참가자로 다시 하기",
    setupAgain: "처음부터 설정하기",
    restore: "저장된 게임을 복구했습니다.",
    discard: "저장 게임 삭제",
  },
} as const;

function Lives({ current, maximum, label }: { current: number; maximum: number; label: string }) {
  return <span className="experience-lives" aria-label={`${label} ${current}/${maximum}`}>
    <span aria-hidden="true">{Array.from({ length: maximum }, (_, index) => index < current ? "❤️" : "🖤").join(" ")}</span>
    <b>{label} {current}/{maximum}</b>
  </span>;
}

export function NeverHaveIEverGame() {
  const { language: interfaceLanguage } = useLanguage();
  const text = interfaceLanguage === "ko" ? copy.ko : copy.en;
  const [mode, setMode] = useState<ExperienceMode>("classic");
  const [playerCount, setPlayerCount] = useState(4);
  const [names, setNames] = useState<string[]>(Array(20).fill(""));
  const [settings, setSettings] = useState<SurvivalSettings>({
    startingLives: 5,
    uniqueBonus: true,
    language: "both",
    turnSeconds: 60,
    randomStart: false,
  });
  const [game, setGame] = useState<ExperienceSurvivalState | null>(null);
  const [experience, setExperience] = useState("");
  const [showIdeas, setShowIdeas] = useState(false);
  const [ideaCategory, setIdeaCategory] = useState("all");
  const [ideaIndex, setIdeaIndex] = useState(0);
  const [classicIndex, setClassicIndex] = useState(0);
  const [confirmEnd, setConfirmEnd] = useState(false);
  const [message, setMessage] = useState("");
  const [judgeVisible, setJudgeVisible] = useState(false);
  const timerRef = useRef<number | null>(null);
  const timerActive = game?.phase === "speaker" && game.secondsLeft !== null && game.secondsLeft > 0;

  useEffect(() => {
    const restored = loadExperienceSurvival();
    if (restored) queueMicrotask(() => {
      setMode(restored.mode);
      setGame(restored);
      setSettings(restored.settings);
      setPlayerCount(restored.players.length);
      setNames([...restored.players.map((player) => player.name), ...Array(20 - restored.players.length).fill("")]);
      setMessage(text.restore);
    });
  }, [text.restore]);

  useEffect(() => {
    if (!game) return;
    saveExperienceSurvival(game);
  }, [game]);

  useEffect(() => {
    if (timerRef.current !== null) window.clearInterval(timerRef.current);
    if (!timerActive) return;
    timerRef.current = window.setInterval(() => setGame((current) => {
      if (!current || current.phase !== "speaker" || current.secondsLeft === null) return current;
      return { ...current, secondsLeft: Math.max(0, current.secondsLeft - 1), updatedAt: Date.now() };
    }), 1000);
    return () => {
      if (timerRef.current !== null) window.clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [timerActive, game?.currentPlayerIndex]);

  const filteredIdeas = useMemo(() => experienceHints.filter((hint) => ideaCategory === "all" || hint.category === ideaCategory), [ideaCategory]);
  const activeHint = filteredIdeas[ideaIndex % Math.max(1, filteredIdeas.length)] ?? experienceHints[0];

  function startSurvival() {
    if (playerCount < 4 || playerCount > 20) return;
    clearExperienceSurvival();
    setGame(createSurvivalGame(names, playerCount, settings));
    setExperience("");
    setMessage("");
  }

  function revealExperience(spokenOnly = false) {
    if (!game || (!spokenOnly && !experience.trim())) return;
    setGame(beginJudging(game, experience, spokenOnly));
    setJudgeVisible(false);
  }

  function judge(hasDoneIt: boolean) {
    if (!game) return;
    const playerId = game.judgeIds[game.judgeIndex];
    const next = recordJudgement(game, { playerId, hasDoneIt });
    if (next.phase === "result") setGame(resolveTurn(next));
    else setGame(next);
    setJudgeVisible(false);
  }

  function nextTurn() {
    if (!game) return;
    const next = advanceTurn(game);
    setGame(next);
    setExperience("");
    setJudgeVisible(false);
  }

  function endGame() {
    if (!game) return;
    setGame({ ...game, phase: "finished", interrupted: true, secondsLeft: null, updatedAt: Date.now() });
    setConfirmEnd(false);
  }

  function samePlayersAgain() {
    if (!game) return;
    setGame(createSurvivalGame(game.players.map((player) => player.name), game.players.length, game.settings));
    setExperience("");
  }

  function resetSetup() {
    clearExperienceSurvival();
    setGame(null);
    setConfirmEnd(false);
    setExperience("");
    setMessage("");
  }

  if (mode === "classic" && !game) {
    const hint = experienceHints[classicIndex % experienceHints.length];
    return <main className="experience-page">
      <header className="experience-header"><Link href="/activities/never-have-i-ever"><ArrowLeft/>{text.title}</Link></header>
      <section className="experience-card experience-mode-select">
        <h1>{text.title}</h1>
        <div><button className="is-active" onClick={() => setMode("classic")}>{text.classic}</button><button onClick={() => setMode("survival")}>{text.survival}</button></div>
        <article><small>NEVER HAVE I EVER</small><h2>Never have I ever…</h2><p>{hint.en}</p>{interfaceLanguage === "ko" && <p>{hint.ko}</p>}</article>
        <div className="experience-classic-actions"><button onClick={() => setClassicIndex((value) => (value - 1 + experienceHints.length) % experienceHints.length)}>Previous</button><button className="is-primary" onClick={() => setClassicIndex((value) => (value + 1) % experienceHints.length)}>Next</button><button onClick={() => setClassicIndex(Math.floor(Math.random() * experienceHints.length))}>Random</button></div>
      </section>
    </main>;
  }

  if (!game) return <main className="experience-page">
    <header className="experience-header"><Link href="/activities/never-have-i-ever"><ArrowLeft/>{text.title}</Link></header>
    <section className="experience-card experience-setup">
      <div className="experience-hero"><ShieldCheck/></div>
      <h1>{text.survivalTitle}</h1><p>{text.survivalDescription}</p>
      <div className="experience-mode-tabs"><button onClick={() => setMode("classic")}>{text.classic}</button><button className="is-active" onClick={() => setMode("survival")}>{text.survival}</button></div>
      <details><summary>{text.howTo}</summary><ol><li>모든 참가자는 설정한 목숨으로 시작합니다.</li><li>자기 차례에 다른 사람들은 해보지 않았을 실제 경험을 말합니다.</li><li>같은 경험이 없는 참가자만 목숨 1개를 잃습니다.</li><li>발언자는 자신의 턴에 목숨을 잃지 않습니다.</li><li>목숨이 0이 되면 탈락하고 마지막 생존자가 승리합니다.</li></ol><p>실제 경험만 말하고, 외모·민감한 사생활·불편한 내용은 피해주세요.</p></details>
      <label className="experience-count">{text.players}<span><button disabled={playerCount <= 4} onClick={() => setPlayerCount((value) => Math.max(4, value - 1))}>−</button><b>{playerCount}</b><button disabled={playerCount >= 20} onClick={() => setPlayerCount((value) => Math.min(20, value + 1))}>+</button></span></label>
      <div className="experience-names">{Array.from({ length: playerCount }, (_, index) => <label key={index}>P{index + 1}<input value={names[index]} placeholder={`Player ${index + 1}`} onChange={(event) => setNames((values) => values.map((value, itemIndex) => itemIndex === index ? event.target.value : value))}/></label>)}</div>
      <div className="experience-settings">
        <label>{text.lives}<select value={settings.startingLives} onChange={(event) => setSettings((value) => ({ ...value, startingLives: Number(event.target.value) }))}>{Array.from({ length: 8 }, (_, index) => index + 3).map((value) => <option key={value}>{value}</option>)}</select></label>
        <label>{text.timer}<select value={settings.turnSeconds} onChange={(event) => setSettings((value) => ({ ...value, turnSeconds: Number(event.target.value) as SurvivalSettings["turnSeconds"] }))}>{[30,45,60,90,0].map((value) => <option value={value} key={value}>{value ? `${value}s` : text.noLimit}</option>)}</select></label>
        <label>{text.language}<select value={settings.language} onChange={(event) => setSettings((value) => ({ ...value, language: event.target.value as ExperienceLanguage }))}><option value="ko">한국어</option><option value="en">English</option><option value="both">한국어 + English</option></select></label>
        <label className="experience-switch"><input type="checkbox" checked={settings.uniqueBonus} onChange={(event) => setSettings((value) => ({ ...value, uniqueBonus: event.target.checked }))}/>{text.bonus}</label>
        <label className="experience-switch"><input type="checkbox" checked={settings.randomStart} onChange={(event) => setSettings((value) => ({ ...value, randomStart: event.target.checked }))}/>{text.randomStart}</label>
      </div>
      <button className="experience-primary" onClick={startSurvival}><Sparkles/>{text.start}</button>
    </section>
  </main>;

  const speaker = currentSpeaker(game);
  const survivors = alivePlayers(game);
  const currentJudgeId = game.judgeIds[game.judgeIndex];
  const currentJudge = game.players.find((player) => player.id === currentJudgeId);
  const latest = game.history.at(-1);
  const namesFor = (ids: string[]) => ids.map((id) => game.players.find((player) => player.id === id)?.name).filter(Boolean).join(", ") || "—";
  const leaders = currentLeaders(game);
  const mostLivesLostTurn = game.history.reduce((best, turn) => turn.lostLifeIds.length > (best?.lostLifeIds.length ?? -1) ? turn : best, game.history[0]);
  const mostSharedTurn = game.history.reduce((best, turn) => turn.judgements.filter((item) => item.hasDoneIt).length > (best?.judgements.filter((item) => item.hasDoneIt).length ?? -1) ? turn : best, game.history[0]);
  const uniquePlayers = game.players.filter((player) => player.uniqueWins > 0);

  return <main className="experience-page">
    <header className="experience-header"><button onClick={() => setConfirmEnd(true)}><ArrowLeft/>{text.end}</button><h1>{text.survival}</h1></header>
    <nav className="experience-status"><span>Round <b>{game.round}</b></span><span><Users/> {survivors.length} / {game.players.length}</span><span><Clock3/> {game.secondsLeft === null ? "∞" : `${game.secondsLeft}s`}</span></nav>
    {message && <div className="experience-toast" role="status">{message}<button onClick={() => setMessage("")}><X/></button></div>}

    {game.phase === "speaker" && <section className="experience-card experience-speaker">
      <small>{text.currentTurn}</small><h1>{speaker.name}</h1><p>{text.prompt}</p>
      <Lives current={speaker.lives} maximum={game.settings.startingLives} label={interfaceLanguage === "ko" ? "목숨" : "Lives"}/>
      <textarea value={experience} disabled={game.secondsLeft === 0} onChange={(event) => setExperience(event.target.value)} placeholder="I have… / 나는… 해봤다."/>
      <button className="experience-idea-button" onClick={() => setShowIdeas((value) => !value)}><Lightbulb/>{text.ideas}</button>
      {showIdeas && <aside className="experience-ideas"><p>{text.ideaNotice}</p><select value={ideaCategory} onChange={(event) => { setIdeaCategory(event.target.value); setIdeaIndex(0); }}><option value="all">All</option>{experienceHintCategories.map((category) => <option key={category}>{category}</option>)}</select><article><b>{activeHint.en}</b>{settings.language !== "en" && <span>{activeHint.ko}</span>}</article><button onClick={() => setIdeaIndex((value) => value + 1)}>다른 아이디어</button></aside>}
      <button className="experience-primary" disabled={!experience.trim()} onClick={() => revealExperience(false)}>{text.reveal}</button>
      <button className="experience-secondary" onClick={() => revealExperience(true)}>{text.spoken}</button>
    </section>}

    {game.phase === "handoff" && currentJudge && <section className="experience-card experience-private">
      <Users/><small>{text.passTo}</small><h1>{currentJudge.name}</h1><p>{text.privateAnswer}</p>
      <button className="experience-primary" onClick={() => { setJudgeVisible(true); setGame((value) => value ? { ...value, phase: "judging" } : value); }}>{text.ready}</button>
    </section>}

    {game.phase === "judging" && currentJudge && judgeVisible && <section className="experience-card experience-private">
      <small>{currentJudge.name}</small><h1>{text.sameQuestion}<br/>{speaker.name}</h1>
      <p className="experience-statement">{game.spokenOnly ? (interfaceLanguage === "ko" ? "현재 참가자가 자신의 경험을 말했습니다." : "The current player shared an experience aloud.") : game.currentExperience}</p>
      <button className="experience-primary" onClick={() => judge(true)}><Check/>{text.done}</button>
      <button className="experience-secondary" onClick={() => judge(false)}><X/>{text.never}</button>
    </section>}

    {game.phase === "result" && latest && <section className="experience-card experience-result">
      <Trophy/><small>{text.result}</small>
      <h1>{latest.spokenOnly ? (interfaceLanguage === "ko" ? "말로 공유한 경험" : "Spoken experience") : latest.experience}</h1>
      {latest.unique && <p className="is-unique">{text.unique}</p>}
      {latest.common && <p className="is-common">{text.common}</p>}
      {latest.bonusApplied && <p>{text.bonusApplied}</p>}
      <dl><div><dt>{text.done}</dt><dd>{namesFor(latest.judgements.filter((item) => item.hasDoneIt).map((item) => item.playerId))}</dd></div><div><dt>{text.never}</dt><dd>{namesFor(latest.judgements.filter((item) => !item.hasDoneIt).map((item) => item.playerId))}</dd></div><div><dt>−1 ❤️</dt><dd>{namesFor(latest.lostLifeIds)}</dd></div>{latest.eliminatedIds.length > 0 && <div><dt>{text.eliminated}</dt><dd>{namesFor(latest.eliminatedIds)} · {text.outMessage}</dd></div>}</dl>
      <div className="experience-scoreboard">{game.players.map((player) => <article className={player.eliminated ? "is-out" : ""} key={player.id}><b>{player.name}</b>{player.eliminated ? <span>{text.eliminated}</span> : <Lives current={player.lives} maximum={game.settings.startingLives} label={interfaceLanguage === "ko" ? "목숨" : "Lives"}/>}</article>)}</div>
      <button className="experience-primary" onClick={nextTurn}>{survivors.length <= 1 ? text.result : text.nextTurn}</button>
    </section>}

    {game.phase === "finished" && <section className="experience-card experience-finished">
      <Trophy/><small>{game.interrupted || leaders.length > 1 ? text.joint : text.survivor}</small><h1>{leaders.map((player) => player.name).join(" · ")}</h1>
      <div className="experience-summary"><span>Rounds <b>{game.round}</b></span><span>Experiences <b>{game.history.length}</b></span><span>Unique <b>{game.history.filter((turn) => turn.unique).length}</b></span></div>
      {game.history.length > 0 && <dl className="experience-final-stats"><div><dt>가장 많은 목숨을 잃게 한 경험</dt><dd>{mostLivesLostTurn?.spokenOnly ? "말로 공유한 경험" : mostLivesLostTurn?.experience || "—"} · {mostLivesLostTurn?.lostLifeIds.length ?? 0}명</dd></div><div><dt>가장 많은 사람이 함께 해본 경험</dt><dd>{mostSharedTurn?.spokenOnly ? "말로 공유한 경험" : mostSharedTurn?.experience || "—"} · {mostSharedTurn?.judgements.filter((item) => item.hasDoneIt).length ?? 0}명</dd></div><div><dt>단독 경험 성공 참가자</dt><dd>{uniquePlayers.map((player) => `${player.name} (${player.uniqueWins})`).join(", ") || "—"}</dd></div></dl>}
      <div className="experience-scoreboard">{[...game.players].sort((a, b) => b.lives - a.lives).map((player) => <article className={player.eliminated ? "is-out" : ""} key={player.id}><b>{player.name}</b><Lives current={player.lives} maximum={game.settings.startingLives} label={interfaceLanguage === "ko" ? "목숨" : "Lives"}/><small>단독 경험 {player.uniqueWins} · 발언 {player.turns}</small></article>)}</div>
      <button className="experience-primary" onClick={samePlayersAgain}><RotateCcw/>{text.samePlayers}</button>
      <button className="experience-secondary" onClick={resetSetup}>{text.setupAgain}</button>
    </section>}

    {!["finished"].includes(game.phase) && <button className="experience-end-button" onClick={() => setConfirmEnd(true)}>{text.end}</button>}
    {confirmEnd && <div className="experience-dialog-backdrop"><section role="alertdialog" aria-modal="true" className="experience-dialog"><h2>{text.endConfirm}</h2><div><button onClick={() => setConfirmEnd(false)}>{text.cancel}</button><button className="is-danger" onClick={endGame}>{text.finish}</button></div></section></div>}
  </main>;
}
