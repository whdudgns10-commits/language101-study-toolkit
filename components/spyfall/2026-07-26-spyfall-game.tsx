"use client";

import Link from "next/link";
import {
  ArrowLeft, ChevronDown, ChevronRight, Eye, EyeOff, MessageCircle,
  Pause, Play, RotateCcw, ShieldQuestion, SkipForward, Sparkles, Target,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SpyfallCandidateGrid } from "@/components/spyfall/2026-07-26-spyfall-candidate-grid";
import { SpyfallPlayerBoard } from "@/components/spyfall/2026-07-26-spyfall-player-board";
import { SpyfallVotePanel } from "@/components/spyfall/2026-07-26-spyfall-vote-panel";
import {
  buildSpyfallCandidates,
  calculateSpyfallVote,
  chooseSpyfallAnswer,
  evaluateSpyfallGuess,
  evaluateSpyfallVote,
  spyfallCategories,
} from "@/lib/2026-07-26-spyfall-engine";
import {
  clearSpyfallSession,
  loadSpyfallAnswerHistory,
  loadLastSpyfallLocationId,
  loadSpyfallSession,
  loadSpyfallSettings,
  saveLastSpyfallLocationId,
  saveSpyfallAnswerHistory,
  saveSpyfallSession,
  type SpyfallSessionSnapshot,
  type SpyfallSettings,
} from "@/lib/2026-07-26-spyfall-storage";
import type {
  SpyfallQuestionLog,
  SpyfallRound,
  SpyfallVoteStage,
  SpyfallWinner,
} from "@/types/2026-07-26-spyfall";

type Phase = "setup" | SpyfallSessionSnapshot["phase"];
type WinnerReason = SpyfallSessionSnapshot["winnerReason"];

const rules = [
  ["시계 방향으로 한 명씩 질문합니다.", "Ask questions one by one clockwise."],
  ["한 사람을 지목해 질문할 수 있습니다.", "Choose one player to answer."],
  ["정답을 직접 말하면 안 됩니다.", "Never say the answer directly."],
  ["너무 구체적인 질문은 피해야 합니다.", "Avoid questions that are too specific."],
  ["답변자는 자연스럽게 답하고 질문과 답변을 로그에 남깁니다.", "Answer naturally and save each exchange in the log."],
  ["스파이는 언제든 정답 맞추기에 도전할 수 있습니다.", "A spy may guess the answer at any time."],
];

function secureIndex(max: number) {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const values = new Uint32Array(1);
    crypto.getRandomValues(values);
    return values[0] % max;
  }
  return Math.floor(Math.random() * max);
}

export function createSpyfallSpyNumbers(playerCount: number, spyCount: number) {
  const pool = Array.from({ length: playerCount }, (_, index) => index + 1);
  const result: number[] = [];
  while (result.length < Math.min(spyCount, playerCount)) {
    result.push(pool.splice(secureIndex(pool.length), 1)[0]);
  }
  return result.sort((a, b) => a - b);
}

function formatTime(seconds: number) {
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

export function SpyfallGame() {
  const [settings, setSettings] = useState<SpyfallSettings | null>(null);
  const [phase, setPhase] = useState<Phase>("setup");
  const [selectedCategoryId, setSelectedCategoryId] = useState("places");
  const [answer, setAnswer] = useState("");
  const [candidates, setCandidates] = useState<string[]>([]);
  const [playerCount, setPlayerCount] = useState(4);
  const [playerNames, setPlayerNames] = useState(["Player 1", "Player 2", "Player 3", "Player 4"]);
  const [durationMinutes, setDurationMinutes] = useState<5 | 8 | 10>(8);
  const [spyNumbers, setSpyNumbers] = useState<number[]>([]);
  const [roleIndex, setRoleIndex] = useState(0);
  const [questioner, setQuestioner] = useState(1);
  const [secondsLeft, setSecondsLeft] = useState(480);
  const [timerRunning, setTimerRunning] = useState(false);
  const [round, setRound] = useState<SpyfallRound>(1);
  const [voteStage, setVoteStage] = useState<SpyfallVoteStage>("mid");
  const [votes, setVotes] = useState<number[]>([]);
  const [voterIndex, setVoterIndex] = useState(0);
  const [selectedVote, setSelectedVote] = useState<number | null>(null);
  const [accusedPlayer, setAccusedPlayer] = useState<number | null>(null);
  const [revealedRole, setRevealedRole] = useState<"citizen" | "spy" | null>(null);
  const [eliminatedPlayers, setEliminatedPlayers] = useState<number[]>([]);
  const [questionLogs, setQuestionLogs] = useState<SpyfallQuestionLog[]>([]);
  const [winner, setWinner] = useState<SpyfallWinner | null>(null);
  const [winnerReason, setWinnerReason] = useState<WinnerReason>(null);
  const [resumeSnapshot, setResumeSnapshot] = useState<SpyfallSessionSnapshot | null>(null);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [questionsOpen, setQuestionsOpen] = useState(false);
  const [guessOpen, setGuessOpen] = useState(false);
  const [guessInput, setGuessInput] = useState("");
  const [logAsker, setLogAsker] = useState(1);
  const [logTarget, setLogTarget] = useState(2);
  const [logQuestion, setLogQuestion] = useState("");
  const [logAnswer, setLogAnswer] = useState("");
  const endSoundPlayed = useRef(false);

  const categories = useMemo(() => {
    if (!settings) return spyfallCategories;
    return spyfallCategories.map((category) => {
      if (category.id !== "places") return category;
      const adminPlaces = settings.locations
        .filter((location) => location.active)
        .map((location) => location.nameEn);
      return { ...category, items: [...new Set([...category.items, ...adminPlaces])] };
    });
  }, [settings]);
  const category = categories.find((item) => item.id === selectedCategoryId) ?? categories[0];
  const spyCount = settings?.spyCounts[playerCount] ?? (playerCount >= 7 ? 2 : 1);
  const alivePlayers = useMemo(
    () => Array.from({ length: playerCount }, (_, index) => index + 1)
      .filter((number) => !eliminatedPlayers.includes(number)),
    [playerCount, eliminatedPlayers],
  );
  const voters = alivePlayers;
  const voteResult = useMemo(() => calculateSpyfallVote(votes, alivePlayers), [votes, alivePlayers]);
  const answerKo = useMemo(() => {
    if (selectedCategoryId !== "places" || !settings) return null;
    return settings.locations.find((location) => location.nameEn === answer)?.nameKo ?? null;
  }, [selectedCategoryId, settings, answer]);

  useEffect(() => {
    queueMicrotask(() => {
      const loaded = loadSpyfallSettings();
      setSettings(loaded);
      setDurationMinutes(loaded.defaultMinutes);
      setSecondsLeft(loaded.defaultMinutes * 60);
      const snapshot = loadSpyfallSession();
      if (snapshot && snapshot.phase !== "final") setResumeSnapshot(snapshot);
    });
  }, []);

  const restoreSnapshot = useCallback((snapshot: SpyfallSessionSnapshot) => {
    setPlayerCount(snapshot.playerCount);
    setPlayerNames(snapshot.playerNames);
    setDurationMinutes(snapshot.durationMinutes);
    setSpyNumbers(snapshot.spyNumbers);
    setSelectedCategoryId(snapshot.categoryId);
    setAnswer(snapshot.answer);
    setCandidates(snapshot.candidates);
    setRoleIndex(snapshot.roleIndex);
    setQuestioner(snapshot.questioner);
    setSecondsLeft(snapshot.secondsLeft);
    setTimerRunning(false);
    setVotes(snapshot.votes);
    setVoterIndex(snapshot.voterIndex);
    setRound(snapshot.round);
    setVoteStage(snapshot.voteStage);
    setEliminatedPlayers(snapshot.eliminatedPlayers);
    setQuestionLogs(snapshot.questionLogs);
    setAccusedPlayer(snapshot.accusedPlayer);
    setRevealedRole(snapshot.revealedRole);
    setWinner(snapshot.winner);
    setWinnerReason(snapshot.winnerReason);
    setPhase(snapshot.phase === "reveal" ? "handoff" : snapshot.phase);
    setResumeSnapshot(null);
  }, []);

  useEffect(() => {
    if (!timerRunning || phase !== "playing") return;
    const interval = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          setTimerRunning(false);
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [timerRunning, phase]);

  useEffect(() => {
    if (secondsLeft !== 0 || endSoundPlayed.current) return;
    endSoundPlayed.current = true;
    navigator.vibrate?.([400, 120, 700]);
    void new Audio("/2026-07-25-timer-end.wav").play().catch(() => undefined);
  }, [secondsLeft]);

  useEffect(() => {
    if (phase === "setup" || !answer || !settings) return;
    saveSpyfallSession({
      version: 3,
      phase: phase === "reveal" ? "handoff" : phase,
      playerCount,
      playerNames,
      spyCount,
      spyNumbers,
      categoryId: selectedCategoryId,
      answer,
      candidates,
      durationMinutes,
      roleIndex,
      questioner,
      secondsLeft,
      timerRunning,
      votes,
      voterIndex,
      round,
      voteStage,
      eliminatedPlayers,
      questionLogs,
      accusedPlayer,
      revealedRole,
      winner,
      winnerReason,
      savedAt: Date.now(),
    });
  }, [phase, answer, settings, playerCount, playerNames, spyCount, spyNumbers, selectedCategoryId, candidates, durationMinutes, roleIndex, questioner, secondsLeft, timerRunning, votes, voterIndex, round, voteStage, eliminatedPlayers, questionLogs, accusedPlayer, revealedRole, winner, winnerReason]);

  function changePlayerCount(nextCount: number) {
    const safeCount = Math.max(4, Math.min(12, nextCount));
    setPlayerCount(safeCount);
    setPlayerNames((names) => Array.from({ length: safeCount }, (_, index) => names[index] ?? `Player ${index + 1}`));
  }

  function playerName(number: number) {
    return playerNames[number - 1]?.trim() || `Player ${number}`;
  }

  function createGame() {
    if (!settings || !category) return;
    const recentAnswers = loadSpyfallAnswerHistory(category.id);
    const chosenAnswer = chooseSpyfallAnswer(category, recentAnswers.length ? recentAnswers : loadLastSpyfallLocationId());
    const chosenCandidates = buildSpyfallCandidates(category, chosenAnswer);
    saveLastSpyfallLocationId(chosenAnswer);
    saveSpyfallAnswerHistory(category.id, chosenAnswer);
    setAnswer(chosenAnswer);
    setCandidates(chosenCandidates);
    setSpyNumbers(createSpyfallSpyNumbers(playerCount, spyCount));
    setRoleIndex(0);
    setQuestioner(1);
    setSecondsLeft(durationMinutes * 60);
    setRound(1);
    setVoteStage("mid");
    setVotes([]);
    setVoterIndex(0);
    setSelectedVote(null);
    setAccusedPlayer(null);
    setRevealedRole(null);
    setEliminatedPlayers([]);
    setQuestionLogs([]);
    setWinner(null);
    setWinnerReason(null);
    setTimerRunning(false);
    setGuessOpen(false);
    setGuessInput("");
    endSoundPlayed.current = false;
    setPhase("handoff");
  }

  function hideRole() {
    if (roleIndex + 1 >= playerCount) setPhase("ready");
    else {
      setRoleIndex((current) => current + 1);
      setPhase("handoff");
    }
  }

  function beginVoting(stage: SpyfallVoteStage) {
    setTimerRunning(false);
    setVoteStage(stage);
    setVotes([]);
    setVoterIndex(0);
    setSelectedVote(null);
    setAccusedPlayer(null);
    setRevealedRole(null);
    setPhase("voting");
  }

  function confirmVote() {
    if (!selectedVote) return;
    const nextVotes = [...votes, selectedVote];
    setVotes(nextVotes);
    setSelectedVote(null);
    if (voterIndex + 1 >= voters.length) setPhase("vote-summary");
    else setVoterIndex((current) => current + 1);
  }

  function revealAccusedRole() {
    if (!accusedPlayer) return;
    const outcome = evaluateSpyfallVote(accusedPlayer, spyNumbers, voteStage);
    const role = spyNumbers.includes(accusedPlayer) ? "spy" : "citizen";
    setRevealedRole(role);
    if (outcome.winner) {
      setWinner(outcome.winner);
      setWinnerReason(outcome.winner === "citizens" ? "vote" : "final-miss");
      setPhase("final");
    } else {
      setEliminatedPlayers((players) => [...players, accusedPlayer]);
      setPhase("round-result");
    }
  }

  function startRoundTwo() {
    setRound(2);
    setVoteStage("final");
    setQuestioner(alivePlayers.find((number) => number !== accusedPlayer) ?? 1);
    setSecondsLeft(durationMinutes * 60);
    setTimerRunning(true);
    endSoundPlayed.current = false;
    setPhase("playing");
  }

  function submitSpyGuess() {
    if (!guessInput.trim()) return;
    const result = evaluateSpyfallGuess(guessInput, answer);
    setWinner(result);
    setWinnerReason(result === "spies" ? "guess-correct" : "guess-wrong");
    setTimerRunning(false);
    setGuessOpen(false);
    setPhase("final");
  }

  function saveQuestionLog() {
    if (!logQuestion.trim() || !logAnswer.trim()) return;
    setQuestionLogs((logs) => [...logs, {
      id: `spyfall-log-${Date.now()}`,
      round,
      asker: logAsker,
      target: logTarget,
      question: logQuestion.trim(),
      answer: logAnswer.trim(),
      createdAt: Date.now(),
    }]);
    setLogQuestion("");
    setLogAnswer("");
  }

  function nextQuestioner() {
    const currentIndex = alivePlayers.indexOf(questioner);
    const next = alivePlayers[(currentIndex + 1) % alivePlayers.length] ?? alivePlayers[0];
    setQuestioner(next);
    setLogAsker(next);
    setLogTarget(alivePlayers.find((number) => number !== next) ?? next);
  }

  function startOver(keepPlayers: boolean) {
    clearSpyfallSession();
    setPhase("setup");
    setAnswer("");
    setCandidates([]);
    setSpyNumbers([]);
    setVotes([]);
    setQuestionLogs([]);
    setEliminatedPlayers([]);
    setWinner(null);
    setWinnerReason(null);
    setTimerRunning(false);
    if (keepPlayers) window.setTimeout(createGame, 0);
  }

  if (!settings) return <main className="spyfall-page"><p>Loading Find the Spy…<small>스파이 찾기를 불러오는 중입니다.</small></p></main>;

  if (resumeSnapshot) return <main className="spyfall-page"><section className="spyfall-resume-card spyfall-card">
    <ShieldQuestion/><h1>Continue your game.<small>진행 중인 게임이 있습니다.</small></h1><p>Would you like to continue the saved game?<small>저장된 게임을 이어서 진행할까요?</small></p>
    <button className="button button-primary" onClick={() => restoreSnapshot(resumeSnapshot)}>Continue Game · 게임 이어하기</button>
    <button className="button button-secondary" onClick={() => { clearSpyfallSession(); setResumeSnapshot(null); }}>Start New · 새로 시작</button>
  </section></main>;

  const currentVoter = voters[voterIndex] ?? voters[0];

  return <main className={`spyfall-page spyfall-v2 phase-${phase} ${secondsLeft <= 10 && phase === "playing" ? "is-warning" : ""}`}>
    <header className="spyfall-header">
      <Link href="/activities/spyfall"><ArrowLeft/>Activities</Link>
      <span><ShieldQuestion/> Find the Spy <small>스파이 찾기</small></span>
    </header>

    {phase !== "setup" && <nav className="spyfall-stage-bar" aria-label="Game progress">
      {[["Roles", "역할"], ["Round 1", "1라운드"], ["Mid Vote", "중간 투표"], ["Round 2", "2라운드"], ["Final Vote", "최종 투표"], ["Result", "결과"]].map(([step, stepKo], index) => {
        const progress = phase === "handoff" || phase === "reveal" || phase === "ready" ? 0
          : phase === "final" ? 5
          : round === 2 ? (phase === "voting" || phase === "vote-summary" ? 4 : 3)
          : phase === "voting" || phase === "vote-summary" || phase === "round-result" ? 2 : 1;
        return <span className={index < progress ? "is-done" : index === progress ? "is-current" : ""} key={step}>{step}<small>{stepKo}</small></span>;
      })}
    </nav>}

    {phase === "setup" && <section className="spyfall-card spyfall-setup">
      <div className="spyfall-hero-icon"><ShieldQuestion/></div>
      <h1>Find the Spy<small>스파이를 찾아보세요</small></h1>
      <p>Most players receive the same word. The spy doesn&apos;t know the answer.<small>대부분의 플레이어는 같은 단어를 받지만, 스파이는 정답을 알 수 없습니다.</small></p>
      <p>Ask questions and give clues without making the answer too obvious.<small>정답이 너무 티 나지 않도록 질문하고 힌트를 주세요.</small></p>
      <fieldset className="spyfall-category-picker"><legend>Category<small>카테고리 · 어떤 종류의 정답으로 플레이할지 선택하세요.</small></legend><div>
        {categories.map((item) => <button
          aria-pressed={selectedCategoryId === item.id}
          className={selectedCategoryId === item.id ? "is-active" : ""}
          key={item.id}
          onClick={() => setSelectedCategoryId(item.id)}
        ><b>{item.title}</b><small>{item.titleKo}</small></button>)}
      </div></fieldset>
      <label>Players<small>플레이어 · 게임에 참여하는 모든 사람의 이름을 입력하세요.</small>
        <div className="spyfall-stepper"><button onClick={() => changePlayerCount(playerCount - 1)} disabled={playerCount === 4}>−</button><strong>{playerCount}</strong><button onClick={() => changePlayerCount(playerCount + 1)} disabled={playerCount === 12}>+</button></div>
      </label>
      <div className="spyfall-name-grid">{playerNames.map((name, index) => <label key={index}>Player {index + 1}<input aria-label={`Player ${index + 1} name`} value={name} onChange={(event) => setPlayerNames((names) => names.map((item, itemIndex) => itemIndex === index ? event.target.value : item))}/></label>)}</div>
      {playerCount < 4 && <p role="alert">At least four players are required.<small>최소 4명 이상이어야 게임을 시작할 수 있습니다.</small></p>}
      <div className="spyfall-spy-count"><EyeOff/><span>Number of Spies<small>스파이 수 · {playerCount < 7 ? "4–6 players: 1 spy recommended" : "7–12 players: 2 spies recommended"}</small></span><strong>{spyCount}</strong></div>
      <fieldset><legend>Timer<small>게임 시간</small></legend><div className="spyfall-time-options">{([5, 8, 10] as const).map((minutes) => <button className={durationMinutes === minutes ? "is-active" : ""} key={minutes} onClick={() => setDurationMinutes(minutes)}>{minutes} min</button>)}</div></fieldset>
      <button className="button button-primary spyfall-main-button" disabled={playerCount < 4} onClick={createGame}>Create Game · 게임 만들기</button>
      <Link href="/admin/activities/spyfall" className="spyfall-admin-link">Admin · Find the Spy</Link>
    </section>}

    {phase === "handoff" && <section className="spyfall-card spyfall-private">
      <EyeOff/><div className="spyfall-progress">Participant {roleIndex + 1} / {playerCount}</div>
      <h1>{roleIndex === 0 ? `${playerName(1)}'s Turn` : "ROLE HIDDEN"}<small>{roleIndex === 0 ? `${playerName(1)}님의 차례` : "역할이 숨겨졌습니다"}</small></h1>
      {roleIndex > 0 && <p>Pass the phone to the next player.<small>옆 사람에게 휴대폰을 넘겨주세요.</small></p>}
      <div className="spyfall-next-player"><span>Next Player</span><strong>{playerName(roleIndex + 1)}</strong></div>
      <p>Only {playerName(roleIndex + 1)} should look at the screen.<small>{playerName(roleIndex + 1)}님만 화면을 확인해주세요.</small></p>
      <button className="button button-primary spyfall-main-button" onClick={() => setPhase("reveal")}><Eye/>{roleIndex === 0 ? "TAP TO REVEAL ROLE · 역할 확인하기" : "I'M READY · 준비됐어요"}</button>
    </section>}

    {phase === "reveal" && <><div className="spyfall-role-toolbar"><button className="button spyfall-hide-button" onClick={hideRole}><EyeOff/>HIDE ROLE · 확인 완료</button></div><section className={`spyfall-card spyfall-role ${spyNumbers.includes(roleIndex + 1) ? "is-spy" : "is-citizen"}`}>
      <div className="spyfall-progress">Participant {roleIndex + 1} / {playerCount}</div>
      <span className="spyfall-category-badge">{category.titleKo} · {category.title}</span>
      {spyNumbers.includes(roleIndex + 1) ? <>
        <span className="spyfall-role-emoji">🕵️</span><small>YOUR ROLE · 당신의 역할</small><h1>SPY<small>스파이</small></h1>
        <p>You don&apos;t know the secret word.<small>비밀 단어를 알 수 없습니다.</small></p><p>Listen carefully and try to figure it out.<small>다른 사람들의 설명을 잘 듣고 정답을 추측하세요.</small></p>
        <SpyfallCandidateGrid candidates={candidates} compact/>
      </> : <>
        <span className="spyfall-role-emoji">🧑‍🤝‍🧑</span><small>YOUR ROLE · 당신의 역할</small><h2>PLAYER<small>일반 플레이어</small></h2>
        <span>SECRET WORD<small>비밀 단어</small></span><h1>{answer}</h1>{answerKo && <p>{answerKo}</p>}<p>Keep the word secret.<small>단어를 다른 사람에게 보여주지 마세요.</small></p>
        <SpyfallCandidateGrid answer={answer} candidates={candidates} compact/>
      </>}
      <button className="button spyfall-hide-button" onClick={hideRole}><EyeOff/>HIDE ROLE · 확인 완료</button>
    </section></>}

    {phase === "ready" && <section className="spyfall-card spyfall-ready">
      <span>✓</span><h1>Everyone has checked their role.<small>모든 참가자가 역할을 확인했습니다.</small></h1>
      <p>Put the phone where everyone can see it.<small>휴대폰을 모두가 볼 수 있는 곳에 놓아주세요.</small></p><p>{category.title} · {category.titleKo} · {playerCount} Players · {spyCount} Spies</p>
      <button className="button button-primary spyfall-main-button" onClick={() => { setPhase("playing"); setTimerRunning(true); }}><Play/>START GAME · 게임 시작</button>
    </section>}

    {phase === "playing" && <section className="spyfall-game-layout">
      <div className="spyfall-round-heading"><span>ROUND {round}<small>라운드 {round}</small></span><b>{category.title}<small>{category.titleKo}</small></b></div>
      <div className="spyfall-game-top">
        <span>Time Remaining<small>남은 시간</small></span><strong role="timer" aria-live="polite">{formatTime(secondsLeft)}</strong>
        {secondsLeft <= 10 && <b>10 seconds left!<small>10초 남았습니다!</small></b>}
        <div className="spyfall-timer-actions">
          <button onClick={() => setTimerRunning((running) => !running)}>{timerRunning ? <Pause/> : <Play/>}{timerRunning ? "Pause" : "Resume"}</button>
          <button onClick={() => { setTimerRunning(false); setSecondsLeft(durationMinutes * 60); endSoundPlayed.current = false; }}><RotateCcw/>Reset</button>
        </div>
      </div>
      <SpyfallPlayerBoard currentQuestioner={questioner} eliminatedPlayers={eliminatedPlayers} playerCount={playerCount} playerNames={playerNames}/>
      <div className="spyfall-questioner"><span>Current Questioner<small>현재 질문할 참가자</small></span><strong>{playerName(questioner)}</strong><button onClick={nextQuestioner}><SkipForward/>Next Player<small>다음 참가자</small></button></div>
      <section className="spyfall-shared-candidates"><h2>20 Possible Answers<small>정답 후보 20개</small></h2><p>The answer is in this list.<small>정답은 이 목록 안에 있습니다.</small></p><SpyfallCandidateGrid candidates={candidates}/></section>
      <section className="spyfall-question-log">
        <header><div><MessageCircle/><h2>Question Log<small>질문 로그</small></h2></div><span>{questionLogs.length}</span></header>
        <div className="spyfall-log-form">
          <label>Asker<small>질문자</small><select value={logAsker} onChange={(event) => setLogAsker(Number(event.target.value))}>{alivePlayers.map((number) => <option key={number} value={number}>{playerName(number)}</option>)}</select></label>
          <label>Answerer<small>답변자</small><select value={logTarget} onChange={(event) => setLogTarget(Number(event.target.value))}>{alivePlayers.map((number) => <option key={number} value={number}>{playerName(number)}</option>)}</select></label>
          <input placeholder="Question in English" value={logQuestion} onChange={(event) => setLogQuestion(event.target.value)}/>
          <input placeholder="Answer" value={logAnswer} onChange={(event) => setLogAnswer(event.target.value)}/>
          <button onClick={saveQuestionLog} disabled={!logQuestion.trim() || !logAnswer.trim()}>Add to Log<small>로그 추가</small></button>
        </div>
        <div className="spyfall-chat">{questionLogs.length ? questionLogs.map((log) => <article key={log.id}><span>R{log.round} · {playerName(log.asker)} → {playerName(log.target)}</span><b>{log.question}</b><p>{log.answer}</p></article>) : <p>No questions saved yet.<small>아직 저장된 질문이 없습니다.</small></p>}</div>
      </section>
      <div className="spyfall-accordions">
        <button onClick={() => setRulesOpen((open) => !open)} aria-expanded={rulesOpen}>How to Play <small>게임 규칙</small><ChevronDown/></button>
        {rulesOpen && <ul>{rules.map(([ko, en]) => <li key={en}><b>{en}</b><span>{ko}</span></li>)}</ul>}
        <button onClick={() => setQuestionsOpen((open) => !open)} aria-expanded={questionsOpen}>Question Examples <small>질문 예시</small><ChevronDown/></button>
        {questionsOpen && <ol>{settings.questions.filter((question) => question.active).map((question) => <li key={question.id}><b>{question.questionEn}</b><span>{question.questionKo}</span></li>)}</ol>}
      </div>
      <div className="spyfall-game-actions">
        <button className="spyfall-guess-button" onClick={() => setGuessOpen(true)}><Target/>Guess the Answer<small>정답 맞추기</small></button>
        <button className="spyfall-vote-button" onClick={() => beginVoting(round === 1 ? "mid" : "final")}><Sparkles/><span>{round === 1 ? "Suspect Vote" : "Final Vote"}<small>{round === 1 ? "스파이 의심 투표" : "최종 투표"}</small></span><ChevronRight/></button>
      </div>
    </section>}

    {phase === "voting" && <SpyfallVotePanel alivePlayers={alivePlayers} playerNames={playerNames} voterNumber={currentVoter} voterPosition={voterIndex + 1} voterTotal={voters.length} selectedVote={selectedVote} onSelect={setSelectedVote} onConfirm={confirmVote}/>}

    {phase === "vote-summary" && <section className="spyfall-card spyfall-results is-animated">
      <span className="spyfall-result-icon">🗳️</span><h1>{voteStage === "mid" ? "Mid-Vote Result" : "Final Vote Result"}<small>{voteStage === "mid" ? "중간 투표 결과" : "최종 투표 결과"}</small></h1>
      <div className="spyfall-vote-bars">{alivePlayers.map((number) => <div key={number}><span>{playerName(number)}</span><i style={{ width: `${(voteResult.totals[number] / voters.length) * 100}%` }}/><b>{voteResult.totals[number]}</b></div>)}</div>
      <p>Most votes: {voteResult.leaders.map(playerName).join(", ")} · {voteResult.majority ? "Majority reached" : "No majority"}<small>최다 득표 · {voteResult.majority ? "과반수 획득" : "과반수 미달"}</small></p>
      {voteResult.leaders.length > 1 && <div className="spyfall-tie-break"><b>Choose one tied player to reveal.<small>동점자 중 공개할 참가자를 선택하세요.</small></b>{voteResult.leaders.map((number) => <button aria-pressed={accusedPlayer === number} className={accusedPlayer === number ? "is-selected" : ""} key={number} onClick={() => setAccusedPlayer(number)}>{playerName(number)}</button>)}</div>}
      {voteResult.leaders.length === 1 && !accusedPlayer && <button className="button button-primary spyfall-main-button" onClick={() => setAccusedPlayer(voteResult.leaders[0])}>Confirm {playerName(voteResult.leaders[0])}<small>지목 확정</small></button>}
      {accusedPlayer && <button className="button button-primary spyfall-main-button" onClick={revealAccusedRole}>Reveal {playerName(accusedPlayer)}&apos;s Role<small>역할 공개</small></button>}
    </section>}

    {phase === "round-result" && accusedPlayer && <section className="spyfall-card spyfall-round-result is-animated">
      <span className="spyfall-role-emoji">🧑‍🤝‍🧑</span><h1>{playerName(accusedPlayer)} is a Citizen.<small>{playerName(accusedPlayer)}님은 일반 플레이어입니다.</small></h1>
      <p>A citizen has been eliminated. Talk once more, then take the final vote.<small>시민이 제거되었습니다. 한 번 더 대화하고 최종 투표를 진행하세요.</small></p>
      <SpyfallPlayerBoard eliminatedPlayers={eliminatedPlayers} playerCount={playerCount} playerNames={playerNames}/>
      <button className="button button-primary spyfall-main-button" onClick={startRoundTwo}>Start Round 2<small>2라운드 시작</small></button>
    </section>}

    {phase === "final" && winner && <section className={`spyfall-card spyfall-final is-animated ${winner === "citizens" ? "citizens-win" : "spies-win"}`}>
      <span>{winner === "citizens" ? "🎉" : "🕵️"}</span>
      <h1>{winner === "citizens" ? "Citizens Win!" : "Spies Win!"}<small>{winner === "citizens" ? "일반 참가자 승리!" : "스파이 승리!"}</small></h1>
      <p>{winnerReason === "guess-correct" ? "The spy guessed the answer."
        : winnerReason === "guess-wrong" ? "The spy guessed incorrectly."
        : winnerReason === "vote" ? "The citizens found the spy."
        : "The spy survived the final vote."}<small>{winnerReason === "guess-correct" ? "스파이가 정답을 맞혔습니다."
          : winnerReason === "guess-wrong" ? "스파이가 정답 맞히기에 실패했습니다."
          : winnerReason === "vote" ? "투표로 스파이를 찾아냈습니다."
          : "최종 투표에서도 스파이를 찾지 못했습니다."}</small></p>
      <dl><div><dt>Category<small>카테고리</small></dt><dd>{category.title}<small>{category.titleKo}</small></dd></div><div><dt>Answer<small>정답</small></dt><dd>{answer}{answerKo && <small>{answerKo}</small>}</dd></div><div><dt>Spies<small>스파이</small></dt><dd>{spyNumbers.map(playerName).join(", ")}</dd></div></dl>
      <SpyfallPlayerBoard eliminatedPlayers={eliminatedPlayers} playerCount={playerCount} playerNames={playerNames}/>
      <button className="button button-primary" onClick={() => startOver(true)}>Play Again with Same Players<small>같은 인원으로 다시 하기</small></button>
      <button className="button button-secondary" onClick={() => startOver(false)}>Create a New Game<small>새로운 게임 만들기</small></button>
      <Link className="button button-secondary" href="/activities" onClick={clearSpyfallSession}>Back to Activities<small>활동 목록으로 돌아가기</small></Link>
    </section>}

    {guessOpen && phase === "playing" && <div className="spyfall-modal-backdrop" role="presentation"><section className="spyfall-guess-modal" role="dialog" aria-modal="true" aria-labelledby="spyfall-guess-title">
      <Target/><h2 id="spyfall-guess-title">Guess the Answer<small>스파이 정답 맞추기</small></h2><p>Only the spy should look. One guess ends the game immediately.<small>스파이만 화면을 보세요. 한 번 입력하면 즉시 게임이 끝납니다.</small></p>
      <b>{category.title}<small>{category.titleKo}</small></b>
      <input autoFocus placeholder="Enter the exact answer · 정답 입력" value={guessInput} onChange={(event) => setGuessInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") submitSpyGuess(); }}/>
      <button className="button button-primary" disabled={!guessInput.trim()} onClick={submitSpyGuess}>Submit Answer<small>정답 제출</small></button>
      <button className="button button-secondary" onClick={() => { setGuessOpen(false); setGuessInput(""); }}>Cancel<small>취소</small></button>
    </section></div>}
  </main>;
}
