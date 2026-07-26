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
import { useLanguage } from "@/hooks/use-language";
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
  loadLastSpyfallLocationId,
  loadSpyfallSession,
  loadSpyfallSettings,
  saveLastSpyfallLocationId,
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
  const { language } = useLanguage();
  const isKorean = language === "ko";
  const [settings, setSettings] = useState<SpyfallSettings | null>(null);
  const [phase, setPhase] = useState<Phase>("setup");
  const [selectedCategoryId, setSelectedCategoryId] = useState("places");
  const [answer, setAnswer] = useState("");
  const [candidates, setCandidates] = useState<string[]>([]);
  const [playerCount, setPlayerCount] = useState(5);
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
      version: 2,
      phase: phase === "reveal" ? "handoff" : phase,
      playerCount,
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
  }, [phase, answer, settings, playerCount, spyCount, spyNumbers, selectedCategoryId, candidates, durationMinutes, roleIndex, questioner, secondsLeft, timerRunning, votes, voterIndex, round, voteStage, eliminatedPlayers, questionLogs, accusedPlayer, revealedRole, winner, winnerReason]);

  function createGame() {
    if (!settings || !category) return;
    const chosenAnswer = chooseSpyfallAnswer(category, loadLastSpyfallLocationId());
    const chosenCandidates = buildSpyfallCandidates(category, chosenAnswer);
    saveLastSpyfallLocationId(chosenAnswer);
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

  if (!settings) return <main className="spyfall-page"><p>Loading Spyfall…</p></main>;

  if (resumeSnapshot) return <main className="spyfall-page"><section className="spyfall-resume-card spyfall-card">
    <ShieldQuestion/><h1>진행 중인 게임이 있습니다.</h1><p>Continue the saved game?</p>
    <button className="button button-primary" onClick={() => restoreSnapshot(resumeSnapshot)}>게임 이어하기</button>
    <button className="button button-secondary" onClick={() => { clearSpyfallSession(); setResumeSnapshot(null); }}>새로 시작</button>
  </section></main>;

  const currentVoter = voters[voterIndex] ?? voters[0];

  return <main className={`spyfall-page spyfall-v2 phase-${phase} ${secondsLeft <= 10 && phase === "playing" ? "is-warning" : ""}`}>
    <header className="spyfall-header">
      <Link href="/activities/spyfall"><ArrowLeft/>Activities</Link>
      <span><ShieldQuestion/> Spyfall</span>
    </header>

    {phase !== "setup" && <nav className="spyfall-stage-bar" aria-label="Game progress">
      {["Roles", "Round 1", "Mid Vote", "Round 2", "Final Vote", "Result"].map((step, index) => {
        const progress = phase === "handoff" || phase === "reveal" || phase === "ready" ? 0
          : phase === "final" ? 5
          : round === 2 ? (phase === "voting" || phase === "vote-summary" ? 4 : 3)
          : phase === "voting" || phase === "vote-summary" || phase === "round-result" ? 2 : 1;
        return <span className={index < progress ? "is-done" : index === progress ? "is-current" : ""} key={step}>{step}</span>;
      })}
    </nav>}

    {phase === "setup" && <section className="spyfall-card spyfall-setup">
      <div className="spyfall-hero-icon"><ShieldQuestion/></div>
      <h1>Spyfall</h1><p>카테고리를 고르고 질문으로 스파이를 찾아보세요.</p>
      <fieldset className="spyfall-category-picker"><legend>게임 모드 · Game Mode</legend><div>
        {categories.map((item) => <button
          aria-pressed={selectedCategoryId === item.id}
          className={selectedCategoryId === item.id ? "is-active" : ""}
          key={item.id}
          onClick={() => setSelectedCategoryId(item.id)}
        ><b>{isKorean ? item.titleKo : item.title}</b><small>{isKorean ? item.title : item.titleKo}</small></button>)}
      </div></fieldset>
      <label>참가 인원 · Players
        <div className="spyfall-stepper"><button onClick={() => setPlayerCount((count) => Math.max(5, count - 1))} disabled={playerCount === 5}>−</button><strong>{playerCount}</strong><button onClick={() => setPlayerCount((count) => Math.min(12, count + 1))} disabled={playerCount === 12}>+</button></div>
      </label>
      <div className="spyfall-spy-count"><EyeOff/><span>Spies</span><strong>{spyCount}</strong></div>
      <fieldset><legend>게임 시간 · Timer</legend><div className="spyfall-time-options">{([5, 8, 10] as const).map((minutes) => <button className={durationMinutes === minutes ? "is-active" : ""} key={minutes} onClick={() => setDurationMinutes(minutes)}>{minutes} min</button>)}</div></fieldset>
      <button className="button button-primary spyfall-main-button" onClick={createGame}>게임 만들기 · Create Game</button>
      <Link href="/admin/activities/spyfall" className="spyfall-admin-link">Admin · Spyfall</Link>
    </section>}

    {phase === "handoff" && <section className="spyfall-card spyfall-private">
      <EyeOff/><div className="spyfall-progress">Participant {roleIndex + 1} / {playerCount}</div>
      <h1>다음 참가자에게 휴대폰을 전달해주세요.</h1>
      <p>휴대폰을 본인만 볼 수 있게 들고 역할 확인 버튼을 눌러주세요.</p>
      <button className="button button-primary spyfall-main-button" onClick={() => setPhase("reveal")}><Eye/>역할 확인 · Reveal Role</button>
    </section>}

    {phase === "reveal" && <section className={`spyfall-card spyfall-role ${spyNumbers.includes(roleIndex + 1) ? "is-spy" : "is-citizen"}`}>
      <div className="spyfall-progress">Participant {roleIndex + 1} / {playerCount}</div>
      <span className="spyfall-category-badge">{category.titleKo} · {category.title}</span>
      {spyNumbers.includes(roleIndex + 1) ? <>
        <span className="spyfall-role-emoji">🕵️</span><h1>당신은 스파이입니다.</h1>
        <p>정답은 보이지 않습니다. 후보 20개와 대화를 보고 정답을 추리하세요.</p>
        <SpyfallCandidateGrid candidates={candidates} compact/>
      </> : <>
        <span className="spyfall-role-emoji">🧑‍🤝‍🧑</span><small>시민 · CITIZEN</small>
        <h1>{answer}</h1>{answerKo && <p>{answerKo}</p>}
        <SpyfallCandidateGrid answer={answer} candidates={candidates} compact/>
      </>}
      <button className="button spyfall-hide-button" onClick={hideRole}><EyeOff/>확인 완료 · Hide Role</button>
    </section>}

    {phase === "ready" && <section className="spyfall-card spyfall-ready">
      <span>✓</span><h1>모든 참가자가 역할을 확인했습니다.</h1>
      <p>{category.titleKo} · {category.title} · {playerCount} Players · {spyCount} Spies</p>
      <button className="button button-primary spyfall-main-button" onClick={() => { setPhase("playing"); setTimerRunning(true); }}><Play/>게임 시작 · Start Game</button>
    </section>}

    {phase === "playing" && <section className="spyfall-game-layout">
      <div className="spyfall-round-heading"><span>ROUND {round}</span><b>{category.titleKo} · {category.title}</b></div>
      <div className="spyfall-game-top">
        <span>남은 시간 · Time Remaining</span><strong role="timer" aria-live="polite">{formatTime(secondsLeft)}</strong>
        {secondsLeft <= 10 && <b>10 seconds left!</b>}
        <div className="spyfall-timer-actions">
          <button onClick={() => setTimerRunning((running) => !running)}>{timerRunning ? <Pause/> : <Play/>}{timerRunning ? "Pause" : "Resume"}</button>
          <button onClick={() => { setTimerRunning(false); setSecondsLeft(durationMinutes * 60); endSoundPlayed.current = false; }}><RotateCcw/>Reset</button>
        </div>
      </div>
      <SpyfallPlayerBoard currentQuestioner={questioner} eliminatedPlayers={eliminatedPlayers} playerCount={playerCount}/>
      <div className="spyfall-questioner"><span>현재 질문할 참가자</span><strong>Participant {questioner}</strong><button onClick={nextQuestioner}><SkipForward/>Next Player</button></div>
      <section className="spyfall-shared-candidates"><h2>정답 후보 20개 · Possible Answers</h2><p>정답은 이 목록 안에 있습니다.</p><SpyfallCandidateGrid candidates={candidates}/></section>
      <section className="spyfall-question-log">
        <header><div><MessageCircle/><h2>질문 로그 · Question Log</h2></div><span>{questionLogs.length}</span></header>
        <div className="spyfall-log-form">
          <label>질문자<select value={logAsker} onChange={(event) => setLogAsker(Number(event.target.value))}>{alivePlayers.map((number) => <option key={number} value={number}>P{number}</option>)}</select></label>
          <label>답변자<select value={logTarget} onChange={(event) => setLogTarget(Number(event.target.value))}>{alivePlayers.map((number) => <option key={number} value={number}>P{number}</option>)}</select></label>
          <input placeholder="Question in English" value={logQuestion} onChange={(event) => setLogQuestion(event.target.value)}/>
          <input placeholder="Answer" value={logAnswer} onChange={(event) => setLogAnswer(event.target.value)}/>
          <button onClick={saveQuestionLog} disabled={!logQuestion.trim() || !logAnswer.trim()}>로그 추가</button>
        </div>
        <div className="spyfall-chat">{questionLogs.length ? questionLogs.map((log) => <article key={log.id}><span>R{log.round} · P{log.asker} → P{log.target}</span><b>{log.question}</b><p>{log.answer}</p></article>) : <p>아직 저장된 질문이 없습니다.</p>}</div>
      </section>
      <div className="spyfall-accordions">
        <button onClick={() => setRulesOpen((open) => !open)} aria-expanded={rulesOpen}>게임 규칙 <ChevronDown/></button>
        {rulesOpen && <ul>{rules.map(([ko, en]) => <li key={en}><b>{ko}</b><span>{en}</span></li>)}</ul>}
        <button onClick={() => setQuestionsOpen((open) => !open)} aria-expanded={questionsOpen}>질문 예시 <ChevronDown/></button>
        {questionsOpen && <ol>{settings.questions.filter((question) => question.active).map((question) => <li key={question.id}><b>{question.questionKo}</b><span>{question.questionEn}</span></li>)}</ol>}
      </div>
      <div className="spyfall-game-actions">
        <button className="spyfall-guess-button" onClick={() => setGuessOpen(true)}><Target/>정답 맞추기</button>
        <button className="spyfall-vote-button" onClick={() => beginVoting(round === 1 ? "mid" : "final")}><Sparkles/>{round === 1 ? "스파이 의심 투표" : "최종 투표"}<ChevronRight/></button>
      </div>
    </section>}

    {phase === "voting" && <SpyfallVotePanel alivePlayers={alivePlayers} voterNumber={currentVoter} voterPosition={voterIndex + 1} voterTotal={voters.length} selectedVote={selectedVote} onSelect={setSelectedVote} onConfirm={confirmVote}/>}

    {phase === "vote-summary" && <section className="spyfall-card spyfall-results is-animated">
      <span className="spyfall-result-icon">🗳️</span><h1>{voteStage === "mid" ? "중간 투표 결과" : "최종 투표 결과"}</h1>
      <div className="spyfall-vote-bars">{alivePlayers.map((number) => <div key={number}><span>P{number}</span><i style={{ width: `${(voteResult.totals[number] / voters.length) * 100}%` }}/><b>{voteResult.totals[number]}</b></div>)}</div>
      <p>최다 득표: {voteResult.leaders.map((number) => `P${number}`).join(", ")} · {voteResult.majority ? "과반수 획득" : "과반수 미달"}</p>
      {voteResult.leaders.length > 1 && <div className="spyfall-tie-break"><b>동점자 중 공개할 참가자를 선택하세요.</b>{voteResult.leaders.map((number) => <button aria-pressed={accusedPlayer === number} className={accusedPlayer === number ? "is-selected" : ""} key={number} onClick={() => setAccusedPlayer(number)}>P{number}</button>)}</div>}
      {voteResult.leaders.length === 1 && !accusedPlayer && <button className="button button-primary spyfall-main-button" onClick={() => setAccusedPlayer(voteResult.leaders[0])}>P{voteResult.leaders[0]} 지목 확정</button>}
      {accusedPlayer && <button className="button button-primary spyfall-main-button" onClick={revealAccusedRole}>P{accusedPlayer} 역할 공개 · Reveal Role</button>}
    </section>}

    {phase === "round-result" && accusedPlayer && <section className="spyfall-card spyfall-round-result is-animated">
      <span className="spyfall-role-emoji">🧑‍🤝‍🧑</span><h1>P{accusedPlayer}은 시민입니다.</h1>
      <p>시민이 제거되었습니다. 남은 참가자들은 한 번 더 대화하고 최종 투표를 진행합니다.</p>
      <SpyfallPlayerBoard eliminatedPlayers={eliminatedPlayers} playerCount={playerCount}/>
      <button className="button button-primary spyfall-main-button" onClick={startRoundTwo}>Round 2 시작</button>
    </section>}

    {phase === "final" && winner && <section className={`spyfall-card spyfall-final is-animated ${winner === "citizens" ? "citizens-win" : "spies-win"}`}>
      <span>{winner === "citizens" ? "🎉" : "🕵️"}</span>
      <h1>{winner === "citizens" ? "일반 참가자 승리!" : "스파이 승리!"}</h1>
      <p>{winnerReason === "guess-correct" ? "스파이가 정답을 맞혔습니다."
        : winnerReason === "guess-wrong" ? "스파이가 정답 맞히기에 실패했습니다."
        : winnerReason === "vote" ? "투표로 스파이를 찾아냈습니다."
        : "최종 투표에서도 스파이를 찾지 못했습니다."}</p>
      <dl><div><dt>Category</dt><dd>{category.titleKo} · {category.title}</dd></div><div><dt>Answer</dt><dd>{answerKo ? `${answerKo} · ` : ""}{answer}</dd></div><div><dt>Spies</dt><dd>{spyNumbers.map((number) => `P${number}`).join(", ")}</dd></div></dl>
      <SpyfallPlayerBoard eliminatedPlayers={eliminatedPlayers} playerCount={playerCount}/>
      <button className="button button-primary" onClick={() => startOver(true)}>같은 인원으로 다시 하기</button>
      <button className="button button-secondary" onClick={() => startOver(false)}>새로운 게임 만들기</button>
      <Link className="button button-secondary" href="/activities" onClick={clearSpyfallSession}>활동 목록으로 돌아가기</Link>
    </section>}

    {guessOpen && phase === "playing" && <div className="spyfall-modal-backdrop" role="presentation"><section className="spyfall-guess-modal" role="dialog" aria-modal="true" aria-labelledby="spyfall-guess-title">
      <Target/><h2 id="spyfall-guess-title">스파이 정답 맞추기</h2><p>스파이만 화면을 보세요. 한 번 입력하면 즉시 게임이 끝납니다.</p>
      <b>{category.titleKo} · {category.title}</b>
      <input autoFocus placeholder="정답을 직접 입력하세요" value={guessInput} onChange={(event) => setGuessInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") submitSpyGuess(); }}/>
      <button className="button button-primary" disabled={!guessInput.trim()} onClick={submitSpyGuess}>정답 제출</button>
      <button className="button button-secondary" onClick={() => { setGuessOpen(false); setGuessInput(""); }}>취소</button>
    </section></div>}
  </main>;
}
