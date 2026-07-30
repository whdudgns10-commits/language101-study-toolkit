"use client";

import "./2026-07-30-never-have-i-ever-game.css";
import Link from "next/link";
import {
  ArrowLeft, Check, ChevronLeft, ChevronRight, Clock3, Dices, Heart, RotateCcw,
  ShieldCheck, Sparkles, Trophy, Users, X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { neverHaveIEverQuestions } from "@/data/2026-07-30-never-have-i-ever-questions";
import {
  advanceTurn, alivePlayers, allJudgementsComplete,
  beginJudging, createSurvivalGame, currentLeaders, currentSpeaker, nextAlivePlayer,
  recordExperienceVerification, recordJudgement, resolveTurn, verificationPlayerIds,
} from "@/lib/2026-07-30-experience-survival-engine";
import {
  clearExperienceSurvival, loadExperienceSurvival, saveExperienceSurvival,
} from "@/lib/2026-07-30-experience-survival-storage";
import type {
  ExperienceJudgement, ExperienceMode, ExperienceSurvivalState, SurvivalPlayer,
  SurvivalSettings,
} from "@/types/2026-07-30-experience-survival";
import { useLanguage } from "@/hooks/use-language";

const QUESTION_HISTORY_KEY = "language101-never-question-history";
const QUESTION_FAVORITES_KEY = "language101-never-question-favorites";
const RECENT_LIMIT = 30;

const copy = {
  en: {
    title: "Never Have I Ever",
    randomMode: "Random Question Mode",
    randomDescription: "The system picks a random question and everyone shares their answer.",
    startPractice: "Start Practice",
    survival: "Experience Survival",
    survivalDescription: "Players share unusual real experiences in an offline survival game.",
    startExperience: "Start Experience Game",
    players: "Players",
    lives: "Starting lives",
    start: "Start Game",
    round: "Round",
    survivors: "Survivors",
    currentTurn: "Current Turn",
    speakerBadge: "Speaker",
    prompt: "Share a special experience that you think other players may not have had.",
    upNext: "Up Next",
    checkExperience: "Check Who Has Done It",
    done: "I’ve done it",
    never: "I’ve never done it",
    chooseAll: "Please select every player’s experience status.",
    revealResult: "Reveal Result",
    verification: "Players who selected ‘I’ve done it’ must briefly share and verify their experience.",
    verified: "Verified",
    failed: "Failed",
    verifySuccess: "Verify",
    verifyFail: "Fail",
    lifeLost: "Life −1",
    translate: "Translate",
    hideTranslation: "Hide Korean",
    nextTurn: "Next Turn",
    end: "End Game",
    endConfirm: "Are you sure you want to end the game?",
    cancel: "Cancel",
    finish: "End Now",
    out: "OUT",
    winner: "Winner",
    samePlayers: "Play Again with Same Players",
    setupAgain: "Back to Mode Selection",
    question: "Question",
    roll: "Random Draw",
    next: "Next Question",
    previous: "Previous Question",
    favorite: "Favorite question",
    followUp: "Keep the conversation going",
    restored: "Your saved Experience Survival game was restored.",
  },
  ko: {
    title: "Never Have I Ever",
    randomMode: "자동 질문으로 플레이",
    randomDescription: "시스템이 랜덤 질문을 뽑아 모두가 대답하는 방식",
    startPractice: "Start Practice",
    survival: "실제 경험으로 플레이",
    survivalDescription: "참가자가 직접 특별한 경험을 말하는 생존 게임",
    startExperience: "Start Experience Game",
    players: "참가 인원",
    lives: "시작 목숨",
    start: "게임 시작",
    round: "라운드",
    survivors: "생존자",
    currentTurn: "현재 차례",
    speakerBadge: "발언자",
    prompt: "다른 사람들이 해보지 않았을 것 같은 특별한 경험을 말해주세요.",
    upNext: "다음 차례",
    checkExperience: "경험 확인하기",
    done: "경험 있음",
    never: "경험 없음",
    chooseAll: "모든 참가자의 경험 여부를 선택해주세요.",
    revealResult: "결과 확인",
    verification: "경험이 있다고 체크한 참가자는 어떤 경험을 했는지 차례대로 이야기해주세요.",
    verified: "인증 성공",
    failed: "인증 실패",
    verifySuccess: "인증 성공",
    verifyFail: "인증 실패",
    lifeLost: "목숨 −1",
    translate: "한국어로 번역",
    hideTranslation: "한국어 숨기기",
    nextTurn: "다음 차례",
    end: "게임 종료",
    endConfirm: "정말 게임을 종료하시겠습니까?",
    cancel: "취소",
    finish: "종료하기",
    out: "OUT",
    winner: "최후의 생존자",
    samePlayers: "같은 참가자로 다시 하기",
    setupAgain: "모드 선택으로 돌아가기",
    question: "질문",
    roll: "랜덤 뽑기",
    next: "다음 질문",
    previous: "이전 질문 보기",
    favorite: "질문 즐겨찾기",
    followUp: "이어서 이야기해보세요",
    restored: "저장된 Experience Survival 게임을 복구했습니다.",
  },
} as const;

function readArray(key: string) {
  if (typeof window === "undefined") return [] as string[];
  try {
    const value = JSON.parse(localStorage.getItem(key) ?? "[]");
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function Lives({ player, maximum, label }: { player: SurvivalPlayer; maximum: number; label: string }) {
  return <span className="experience-lives" aria-label={`${label} ${player.lives}/${maximum}`}>
    <span aria-hidden="true">{player.lives > 0 ? "❤️".repeat(player.lives) : "🖤"}</span>
    <b>{player.lives}/{maximum}</b>
  </span>;
}

function ProgressSteps({ phase, ko }: { phase: ExperienceSurvivalState["phase"]; ko: boolean }) {
  const steps = ko
    ? ["경험 말하기", "경험 선택", "결과", "인증", "다음 차례"]
    : ["Share", "Select", "Result", "Verify", "Next"];
  const active = phase === "speaker" ? 0 : phase === "judging" ? 1 : 3;
  return <ol className="experience-turn-steps" aria-label={ko ? "현재 진행 단계" : "Turn progress"}>
    {steps.map((step, index) => <li className={index === active ? "is-current" : index < active ? "is-done" : ""} key={step}>
      {index < active && <Check aria-hidden="true"/>}<span>{step}</span>
    </li>)}
  </ol>;
}

export function NeverHaveIEverGame() {
  const { language } = useLanguage();
  const ko = language === "ko";
  const text = ko ? copy.ko : copy.en;
  const [mode, setMode] = useState<ExperienceMode | null>(null);
  const [playerCount, setPlayerCount] = useState(4);
  const [names, setNames] = useState<string[]>(Array(20).fill(""));
  const [settings, setSettings] = useState<SurvivalSettings>({
    startingLives: 5, uniqueBonus: false, language: "both", turnSeconds: 0, randomStart: false,
  });
  const [game, setGame] = useState<ExperienceSurvivalState | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [questionTrail, setQuestionTrail] = useState<number[]>([0]);
  const [trailIndex, setTrailIndex] = useState(0);
  const [rolling, setRolling] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [confirmEnd, setConfirmEnd] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [failedPlayerId, setFailedPlayerId] = useState<string | null>(null);
  const rollTimer = useRef<number | null>(null);

  useEffect(() => {
    const restored = loadExperienceSurvival();
    queueMicrotask(() => {
      setFavorites(readArray(QUESTION_FAVORITES_KEY));
      if (!restored) return;
      setMode("survival");
      setGame(restored);
      setSettings(restored.settings);
      setPlayerCount(restored.players.length);
      setNames([...restored.players.map((player) => player.name), ...Array(20 - restored.players.length).fill("")]);
      setMessage(text.restored);
    });
  }, [text.restored]);

  useEffect(() => {
    if (game) saveExperienceSurvival(game);
  }, [game]);

  const pickRandomQuestion = useCallback(() => {
    if (rolling) return;
    setRolling(true);
    const recent = readArray(QUESTION_HISTORY_KEY).slice(-RECENT_LIMIT);
    const pool = neverHaveIEverQuestions.map((_, index) => index)
      .filter((index) => !recent.includes(neverHaveIEverQuestions[index].id) && index !== questionIndex);
    const finalIndex = pool[Math.floor(Math.random() * pool.length)] ?? ((questionIndex + 1) % neverHaveIEverQuestions.length);
    const started = performance.now();
    const duration = 650 + Math.random() * 750;
    rollTimer.current = window.setInterval(() => {
      setQuestionIndex(Math.floor(Math.random() * neverHaveIEverQuestions.length));
      if (performance.now() - started < duration) return;
      if (rollTimer.current !== null) window.clearInterval(rollTimer.current);
      setQuestionIndex(finalIndex);
      setShowTranslation(false);
      setQuestionTrail((trail) => [...trail.slice(0, trailIndex + 1), finalIndex]);
      setTrailIndex((value) => value + 1);
      const nextHistory = [...recent, neverHaveIEverQuestions[finalIndex].id].slice(-RECENT_LIMIT);
      localStorage.setItem(QUESTION_HISTORY_KEY, JSON.stringify(nextHistory));
      setRolling(false);
    }, 75);
  }, [questionIndex, rolling, trailIndex]);

  useEffect(() => () => {
    if (rollTimer.current !== null) window.clearInterval(rollTimer.current);
  }, []);

  const question = neverHaveIEverQuestions[questionIndex];
  const speaker = game ? currentSpeaker(game) : null;
  const survivors = game ? alivePlayers(game) : [];
  const nextPlayer = game ? nextAlivePlayer(game) : null;
  const latest = game?.history.at(-1);
  const verificationIds = game ? verificationPlayerIds(game) : [];
  const canReveal = game ? allJudgementsComplete(game) : false;
  const leaders = game ? currentLeaders(game) : [];

  function startSurvival() {
    clearExperienceSurvival();
    setGame(createSurvivalGame(names, playerCount, settings));
    setMessage("");
  }

  function selectJudgement(playerId: string, hasDoneIt: boolean) {
    setGame((state) => state ? recordJudgement(state, { playerId, hasDoneIt }) : state);
  }

  function revealResult() {
    setGame((state) => state && allJudgementsComplete(state) ? resolveTurn(state) : state);
  }

  function nextTurn() {
    if (!game || transitioning) return;
    setTransitioning(true);
    window.setTimeout(() => {
      setGame((state) => state ? advanceTurn(state) : state);
      setTransitioning(false);
    }, 300);
  }

  function chooseMode(next: ExperienceMode) {
    setMode(next);
    setMessage("");
  }

  function backToModes() {
    if (game && game.phase !== "finished") {
      setConfirmEnd(true);
      return;
    }
    clearExperienceSurvival();
    setGame(null);
    setMode(null);
  }

  function endGame() {
    setGame((state) => state ? { ...state, phase: "finished", interrupted: true, updatedAt: Date.now() } : state);
    setConfirmEnd(false);
  }

  function toggleFavorite() {
    const next = favorites.includes(question.id) ? favorites.filter((id) => id !== question.id) : [...favorites, question.id];
    setFavorites(next);
    localStorage.setItem(QUESTION_FAVORITES_KEY, JSON.stringify(next));
  }

  function verifyExperience(playerId: string, status: "verified" | "failed") {
    setGame((state) => state ? recordExperienceVerification(state, playerId, status) : state);
    if (status === "failed") {
      setFailedPlayerId(playerId);
      window.setTimeout(() => setFailedPlayerId((current) => current === playerId ? null : current), 900);
    }
  }

  if (!mode) return <main className="experience-page">
    <header className="experience-header"><Link href="/activities/never-have-i-ever"><ArrowLeft/>{text.title}</Link></header>
    <section className="experience-mode-gateway" aria-labelledby="experience-mode-title">
      <h1 id="experience-mode-title">{text.title}</h1>
      <div>
        <article><Dices/><small>01</small><h2>{text.randomMode}</h2><p>{text.randomDescription}</p><button className="experience-primary" onClick={() => chooseMode("classic")}>{text.startPractice}</button></article>
        <article><ShieldCheck/><small>02</small><h2>{text.survival}</h2><p>{text.survivalDescription}</p><button className="experience-primary" onClick={() => chooseMode("survival")}>{text.startExperience}</button></article>
      </div>
    </section>
  </main>;

  if (mode === "classic") return <main className="experience-page">
    <header className="experience-header"><button onClick={() => setMode(null)}><ArrowLeft/>{text.title}</button><h1>{text.randomMode}</h1></header>
    <section className={`experience-card experience-random-question ${rolling ? "is-rolling" : ""}`}>
      <small>{text.question} {questionIndex + 1} / {neverHaveIEverQuestions.length}</small>
      <button className="experience-translate" aria-pressed={showTranslation} onClick={() => setShowTranslation((value) => !value)}>{showTranslation ? text.hideTranslation : text.translate}</button>
      <article aria-live="polite"><span>NEVER HAVE I EVER</span><h2>Never Have I Ever</h2><h1>{question.english}</h1>{showTranslation && <p>{question.korean}</p>}</article>
      <aside><b>{text.followUp}</b><p>{ko ? question.followUpKo : question.followUpEn}</p></aside>
      <button className={`experience-favorite ${favorites.includes(question.id) ? "is-active" : ""}`} aria-pressed={favorites.includes(question.id)} aria-label={text.favorite} onClick={toggleFavorite}><Heart/></button>
      <button className="experience-primary experience-roll" disabled={rolling} onClick={pickRandomQuestion}><Dices/>{text.roll}</button>
      <div className="experience-question-nav">
        <button disabled={trailIndex === 0 || rolling} onClick={() => { const next = trailIndex - 1; setTrailIndex(next); setQuestionIndex(questionTrail[next]); setShowTranslation(false); }}><ChevronLeft/>{text.previous}</button>
        <button disabled={rolling} onClick={pickRandomQuestion}>{text.next}<ChevronRight/></button>
      </div>
    </section>
  </main>;

  if (!game) return <main className="experience-page">
    <header className="experience-header"><button onClick={() => setMode(null)}><ArrowLeft/>{text.title}</button><h1>Experience Survival</h1></header>
    <section className="experience-card experience-setup">
      <div className="experience-hero"><ShieldCheck/></div><h1>Experience Survival</h1><p>{text.survivalDescription}</p>
      <label className="experience-count">{text.players}<span><button disabled={playerCount <= 4} onClick={() => setPlayerCount((value) => value - 1)}>−</button><b>{playerCount}</b><button disabled={playerCount >= 20} onClick={() => setPlayerCount((value) => value + 1)}>+</button></span></label>
      <div className="experience-names">{Array.from({ length: playerCount }, (_, index) => <label key={index}>P{index + 1}<input value={names[index]} placeholder={`Player ${index + 1}`} onChange={(event) => setNames((values) => values.map((value, itemIndex) => itemIndex === index ? event.target.value : value))}/></label>)}</div>
      <label className="experience-lives-setting">{text.lives}<select value={settings.startingLives} onChange={(event) => setSettings((value) => ({ ...value, startingLives: Number(event.target.value) }))}>{Array.from({ length: 8 }, (_, index) => index + 3).map((value) => <option key={value}>{value}</option>)}</select></label>
      <button className="experience-primary" onClick={startSurvival}><Sparkles/>{text.start}</button>
    </section>
  </main>;

  if (game.phase === "finished") return <main className="experience-page">
    <header className="experience-header"><button onClick={backToModes}><ArrowLeft/>{text.title}</button></header>
    <section className="experience-card experience-finished"><Trophy/><small>{text.winner}</small><h1>{leaders.map((player) => player.name).join(" · ")}</h1>
      <div className="experience-summary"><span>{text.round}<b>{game.round}</b></span><span>{text.survivors}<b>{survivors.length}</b></span><span>{text.question}<b>{game.history.length}</b></span></div>
      <div className="experience-scoreboard">{[...game.players].sort((a, b) => b.lives - a.lives).map((player) => <article className={player.eliminated ? "is-out" : ""} key={player.id}><b>{player.name}</b><Lives player={player} maximum={game.settings.startingLives} label={text.lives}/>{player.eliminated && <em>{text.out}</em>}</article>)}</div>
      <button className="experience-primary" onClick={() => setGame(createSurvivalGame(game.players.map((player) => player.name), game.players.length, game.settings))}><RotateCcw/>{text.samePlayers}</button>
      <button className="experience-secondary" onClick={() => { clearExperienceSurvival(); setGame(null); setMode(null); }}>{text.setupAgain}</button>
    </section>
  </main>;

  const otherPlayers = game.players
    .filter((player) => player.id !== speaker?.id)
    .sort((a, b) => Number(a.eliminated) - Number(b.eliminated));
  const judgementFor = (id: string): ExperienceJudgement | undefined => game.pendingJudgements.find((item) => item.playerId === id);

  return <main className={`experience-page experience-game ${transitioning ? "is-transitioning" : ""}`}>
    <header className="experience-header"><button onClick={() => setConfirmEnd(true)}><ArrowLeft/>{text.end}</button><h1>Experience Survival</h1></header>
    <nav className="experience-status"><span>{text.round} <b>{game.round}</b></span><span><Users/> {text.survivors} <b>{survivors.length}/{game.players.length}</b></span><span><Clock3/> OFFLINE</span></nav>
    <ProgressSteps phase={game.phase} ko={ko}/>

    {speaker && <section className="experience-current-player" key={`${speaker.id}-${game.round}`}>
      <span>{text.currentTurn}</span><h1>{speaker.name}</h1><Lives player={speaker} maximum={game.settings.startingLives} label={text.lives}/><b>{text.speakerBadge}</b>
      <p>{text.prompt}</p>
    </section>}
    {nextPlayer && <div className="experience-up-next"><span>{text.upNext}</span><b>{nextPlayer.name}</b></div>}

    {game.phase === "speaker" && <section className="experience-action-card">
      <p>{ko ? "앱에 입력하지 말고 직접 말해주세요." : "Say it aloud. No typing is needed."}</p>
      <button className="experience-primary" onClick={() => setGame(beginJudging(game, "", true))}><Check/>{text.checkExperience}</button>
    </section>}

    {game.phase === "judging" && <section className="experience-action-card">
      <h2>{text.checkExperience}</h2><p>{ko ? "발언자를 제외한 모든 생존 참가자를 선택해주세요." : "Choose an answer for every living player except the speaker."}</p>
      {!canReveal && <div className="experience-inline-alert" role="status">{text.chooseAll}</div>}
      <div className="experience-judgement-grid">{otherPlayers.filter((player) => !player.eliminated).map((player) => {
        const selected = judgementFor(player.id);
        return <article key={player.id}><b>{player.name}</b><Lives player={player} maximum={game.settings.startingLives} label={text.lives}/>
          <div><button className={selected?.hasDoneIt === true ? "is-selected" : ""} aria-pressed={selected?.hasDoneIt === true} onClick={() => selectJudgement(player.id, true)}>{text.done}</button><button className={selected?.hasDoneIt === false ? "is-selected is-never" : ""} aria-pressed={selected?.hasDoneIt === false} onClick={() => selectJudgement(player.id, false)}>{text.never}</button></div>
        </article>;
      })}</div>
      <button className="experience-primary" disabled={!canReveal} onClick={revealResult}>{text.revealResult}</button>
    </section>}

    {game.phase === "result" && latest && <section className="experience-action-card experience-verification">
      <h2>{text.revealResult}</h2>
      <div className="experience-result-groups"><article><b>{text.done}</b>{latest.judgements.filter((item) => item.hasDoneIt).map((item) => <span key={item.playerId}>{game.players.find((player) => player.id === item.playerId)?.name} · ❤️ 유지</span>)}</article><article><b>{text.never}</b>{latest.judgements.filter((item) => !item.hasDoneIt).map((item) => <span key={item.playerId}>{game.players.find((player) => player.id === item.playerId)?.name} · −1 ❤️</span>)}</article></div>
      <p className="experience-verify-notice">{text.verification}</p>
      {verificationIds.length > 0 && <div className="experience-verify-list">{verificationIds.map((id) => {
        const player = game.players.find((item) => item.id === id);
        const result = game.verificationResults.find((item) => item.playerId === id)?.status;
        return <article className={`${result ? `is-${result}` : ""} ${failedPlayerId === id ? "is-life-lost" : ""}`} key={id}><strong>{player?.name}</strong><div><button className="verify-success" aria-pressed={result === "verified"} onClick={() => verifyExperience(id, "verified")}><Check/>{result === "verified" ? text.verified : text.verifySuccess}</button><button className="verify-fail" aria-pressed={result === "failed"} onClick={() => verifyExperience(id, "failed")}><X/>{result === "failed" ? text.failed : text.verifyFail}</button></div>{failedPlayerId === id && <em role="status">{text.failed} · {text.lifeLost}</em>}</article>;
      })}</div>}
      <button className="experience-primary" disabled={transitioning} onClick={nextTurn}>{text.nextTurn}<ChevronRight/></button>
    </section>}

    <section className="experience-other-players" aria-label={ko ? "나머지 참가자" : "Other players"}>
      {otherPlayers.map((player) => <article className={`${player.eliminated ? "is-out" : ""} ${judgementFor(player.id)?.hasDoneIt === true ? "has-done" : ""}`} key={player.id}>
        <header><b>{player.name}</b>{player.eliminated ? <em>{text.out}</em> : judgementFor(player.id) && <span>{judgementFor(player.id)?.hasDoneIt ? text.done : text.never}</span>}</header>
        <Lives player={player} maximum={game.settings.startingLives} label={text.lives}/>
      </article>)}
    </section>
    <button className="experience-end-button" onClick={() => setConfirmEnd(true)}>{text.end}</button>
    {message && <div className="experience-toast" role="status">{message}<button onClick={() => setMessage("")}><X/></button></div>}
    {confirmEnd && <div className="experience-dialog-backdrop"><section role="alertdialog" aria-modal="true" className="experience-dialog"><h2>{text.endConfirm}</h2><div><button onClick={() => setConfirmEnd(false)}>{text.cancel}</button><button className="is-danger" onClick={endGame}>{text.finish}</button></div></section></div>}
  </main>;
}
