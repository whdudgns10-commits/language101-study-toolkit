"use client";

import Link from "next/link";
import {
  ArrowLeft, ChevronDown, ChevronRight, Eye, EyeOff,
  MapPin, Pause, Play, RotateCcw, ShieldQuestion, SkipForward, Users,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "@/hooks/use-language";
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
import { resolveSpyfallWinner, type SpyfallLocation } from "@/data/2026-07-26-spyfall";

type Phase = "setup" | SpyfallSessionSnapshot["phase"];

const copy = {
  en: {
    back: "Activities", title: "Spyfall", subtitle: "Find the spies hiding among players who share the same location.",
    players: "Players", spies: "Spies", time: "Game time", create: "Create Game",
    private: "Hold the phone so only you can see it, then tap Reveal Role.",
    participant: "Participant", reveal: "Reveal Role", location: "Location",
    spy: "You are a spy.", spyHelp: "Listen to the questions and answers and work out the location.",
    hide: "I’ve seen my role", pass: "Pass the phone to the next participant.",
    ready: "Everyone has checked their role.", start: "Start Game", remaining: "Time remaining",
    pause: "Pause", resume: "Resume", reset: "Restart timer", questioner: "Current questioner",
    next: "Next questioner", rules: "Game rules", examples: "Question examples",
    voteNow: "Start voting now", voting: "Private voting", voteInstruction: "Choose one player you think is a spy.",
    vote: "Confirm vote", passVote: "Hide the screen and pass the phone to the next voter.",
    votesComplete: "Voting complete", leaders: "Most votes", majority: "Majority reached",
    noMajority: "No majority", revealIdentity: "Reveal identities", actualSpies: "Actual spies",
    caught: "A spy was selected.", missed: "The spies avoided the vote.",
    lastChance: "Give the spies one last chance to guess the location aloud.",
    correct: "They guessed the location", wrong: "They did not guess the location",
    citizensWin: "Citizens win!", citizensWinText: "You found a spy and protected the location.",
    spiesWin: "Spies win!", spiesWinText: "They stayed hidden or guessed the location.",
    votes: "Votes", same: "Play again with same players", new: "Create a new game", list: "Back to activities",
    resumeGame: "A game in progress was found.", resumeQuestion: "Would you like to continue it?",
    continue: "Continue game", discard: "Start over", warning: "10 seconds left!",
  },
  ko: {
    back: "활동 목록", title: "스파이폴", subtitle: "같은 장소를 받은 참가자들 사이에 숨어 있는 스파이를 찾아보세요.",
    players: "참가 인원", spies: "스파이", time: "게임 시간", create: "게임 만들기",
    private: "휴대폰을 본인만 볼 수 있게 들고 역할 확인 버튼을 눌러주세요.",
    participant: "참가자", reveal: "역할 확인", location: "장소",
    spy: "당신은 스파이입니다.", spyHelp: "다른 사람들의 질문과 답변을 듣고 장소를 추리하세요.",
    hide: "확인 완료", pass: "다음 참가자에게 휴대폰을 전달해주세요.",
    ready: "모든 참가자가 역할을 확인했습니다.", start: "게임 시작", remaining: "남은 시간",
    pause: "일시정지", resume: "다시 시작", reset: "타이머 초기화", questioner: "현재 질문할 참가자",
    next: "질문 순서 넘기기", rules: "게임 규칙", examples: "질문 예시",
    voteNow: "즉시 투표 시작", voting: "비공개 투표", voteInstruction: "스파이라고 생각하는 참가자 한 명을 선택하세요.",
    vote: "투표 확정", passVote: "화면을 가리고 다음 투표자에게 휴대폰을 전달해주세요.",
    votesComplete: "모든 투표가 끝났습니다.", leaders: "최다 득표자", majority: "과반수 획득",
    noMajority: "과반수 미달", revealIdentity: "정체 공개", actualSpies: "실제 스파이",
    caught: "스파이가 최다 득표자로 지목되었습니다.", missed: "스파이가 최다 득표를 피했습니다.",
    lastChance: "스파이에게 장소를 맞힐 마지막 기회를 주세요.",
    correct: "장소를 맞혔어요", wrong: "장소를 맞히지 못했어요",
    citizensWin: "일반 참가자 승리!", citizensWinText: "스파이를 찾아냈고 장소도 지켜냈습니다.",
    spiesWin: "스파이 승리!", spiesWinText: "정체를 숨기거나 장소를 맞히는 데 성공했습니다.",
    votes: "득표", same: "같은 인원으로 다시 하기", new: "새로운 게임 만들기", list: "활동 목록으로 돌아가기",
    resumeGame: "진행 중인 게임을 찾았습니다.", resumeQuestion: "이어서 진행할까요?",
    continue: "게임 이어하기", discard: "새로 시작", warning: "종료 10초 전!",
  },
} as const;

const rules = [
  ["시계 방향으로 한 명씩 질문합니다.", "Ask questions one by one clockwise."],
  ["한 사람을 지목해 질문할 수 있습니다.", "You may choose one person to answer."],
  ["장소 이름을 직접 말하면 안 됩니다.", "Never say the location name directly."],
  ["너무 구체적인 질문은 피해야 합니다.", "Avoid questions that are too specific."],
  ["답변자는 거짓말할 수 있지만 지나치게 티 나면 의심받을 수 있습니다.", "You may bluff, but obvious lies will make you suspicious."],
  ["스파이도 자연스럽게 질문하고 답변해야 합니다.", "Spies should ask and answer naturally too."],
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

function chooseLocation(locations: SpyfallLocation[], previousId: string | null) {
  const active = locations.filter((location) => location.active);
  const candidates = active.length > 1 ? active.filter((location) => location.id !== previousId) : active;
  return candidates[secureIndex(candidates.length)];
}

function formatTime(seconds: number) {
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

function tallyVotes(votes: number[], playerCount: number) {
  const totals = Array.from({ length: playerCount }, () => 0);
  votes.forEach((vote) => {
    if (vote >= 1 && vote <= playerCount) totals[vote - 1] += 1;
  });
  const highest = Math.max(...totals);
  return {
    totals,
    leaders: totals.map((count, index) => count === highest ? index + 1 : 0).filter(Boolean),
    highest,
  };
}

export function SpyfallGame() {
  const { language } = useLanguage();
  const text = language === "ko" ? copy.ko : copy.en;
  const [settings, setSettings] = useState<SpyfallSettings | null>(null);
  const [phase, setPhase] = useState<Phase>("setup");
  const [playerCount, setPlayerCount] = useState(5);
  const [durationMinutes, setDurationMinutes] = useState<5 | 8 | 10>(8);
  const [spyNumbers, setSpyNumbers] = useState<number[]>([]);
  const [location, setLocation] = useState<SpyfallLocation | null>(null);
  const [roleIndex, setRoleIndex] = useState(0);
  const [questioner, setQuestioner] = useState(1);
  const [secondsLeft, setSecondsLeft] = useState(480);
  const [timerRunning, setTimerRunning] = useState(false);
  const [votes, setVotes] = useState<number[]>([]);
  const [voterIndex, setVoterIndex] = useState(0);
  const [selectedVote, setSelectedVote] = useState<number | null>(null);
  const [spyGuessedLocation, setSpyGuessedLocation] = useState<boolean | null>(null);
  const [resumeSnapshot, setResumeSnapshot] = useState<SpyfallSessionSnapshot | null>(null);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [questionsOpen, setQuestionsOpen] = useState(false);
  const endSoundPlayed = useRef(false);

  const spyCount = settings?.spyCounts[playerCount] ?? (playerCount >= 7 ? 2 : 1);
  const voteResult = useMemo(() => tallyVotes(votes, playerCount), [votes, playerCount]);
  const spyCaught = voteResult.leaders.some((number) => spyNumbers.includes(number));
  const citizensWin = resolveSpyfallWinner(spyCaught, spyGuessedLocation) === "citizens";

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
    setLocation(snapshot.location);
    setRoleIndex(snapshot.roleIndex);
    setQuestioner(snapshot.questioner);
    setSecondsLeft(snapshot.secondsLeft);
    setTimerRunning(false);
    setVotes(snapshot.votes);
    setVoterIndex(snapshot.voterIndex);
    setSpyGuessedLocation(snapshot.spyGuessedLocation);
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
    const audio = new Audio("/2026-07-25-timer-end.wav");
    void audio.play().catch(() => undefined);
  }, [secondsLeft]);

  useEffect(() => {
    if (phase === "setup" || !location || !settings) return;
    const safePhase = phase === "reveal" ? "handoff" : phase;
    saveSpyfallSession({
      version: 1,
      phase: safePhase,
      playerCount,
      spyCount,
      spyNumbers,
      location,
      durationMinutes,
      roleIndex,
      questioner,
      secondsLeft,
      timerRunning,
      votes,
      voterIndex,
      spyGuessedLocation,
      savedAt: Date.now(),
    });
  }, [phase, playerCount, spyCount, spyNumbers, location, durationMinutes, roleIndex, questioner, secondsLeft, timerRunning, votes, voterIndex, spyGuessedLocation, settings]);

  function createGame() {
    if (!settings) return;
    const chosen = chooseLocation(settings.locations, loadLastSpyfallLocationId());
    if (!chosen) return;
    saveLastSpyfallLocationId(chosen.id);
    setLocation(chosen);
    setSpyNumbers(createSpyfallSpyNumbers(playerCount, spyCount));
    setRoleIndex(0);
    setQuestioner(1);
    setSecondsLeft(durationMinutes * 60);
    setVotes([]);
    setVoterIndex(0);
    setSelectedVote(null);
    setSpyGuessedLocation(null);
    setTimerRunning(false);
    endSoundPlayed.current = false;
    setPhase("handoff");
  }

  function hideRole() {
    if (roleIndex + 1 >= playerCount) {
      setPhase("ready");
    } else {
      setRoleIndex((current) => current + 1);
      setPhase("handoff");
    }
  }

  function beginVoting() {
    setTimerRunning(false);
    setVotes([]);
    setVoterIndex(0);
    setSelectedVote(null);
    setPhase("voting");
  }

  function confirmVote() {
    if (!selectedVote) return;
    const nextVotes = [...votes, selectedVote];
    setVotes(nextVotes);
    setSelectedVote(null);
    if (voterIndex + 1 >= playerCount) setPhase("vote-summary");
    else setVoterIndex((current) => current + 1);
  }

  function startOver(keepPlayers: boolean) {
    clearSpyfallSession();
    setPhase("setup");
    setLocation(null);
    setSpyNumbers([]);
    setVotes([]);
    setTimerRunning(false);
    setSpyGuessedLocation(null);
    if (keepPlayers) window.setTimeout(createGame, 0);
  }

  if (!settings) return <main className="spyfall-page"><p>Loading Spyfall…</p></main>;

  if (resumeSnapshot) return (
    <main className="spyfall-page"><section className="spyfall-resume-card">
      <ShieldQuestion aria-hidden="true"/>
      <h1>{text.resumeGame}</h1><p>{text.resumeQuestion}</p>
      <button className="button button-primary" onClick={() => restoreSnapshot(resumeSnapshot)}>{text.continue}</button>
      <button className="button button-secondary" onClick={() => { clearSpyfallSession(); setResumeSnapshot(null); }}>{text.discard}</button>
    </section></main>
  );

  return (
    <main className={`spyfall-page phase-${phase} ${secondsLeft <= 10 && phase === "playing" ? "is-warning" : ""}`}>
      <header className="spyfall-header">
        <Link href="/activities/spyfall"><ArrowLeft/>{text.back}</Link>
        <span><ShieldQuestion/> {text.title}</span>
      </header>

      {phase === "setup" && <section className="spyfall-card spyfall-setup">
        <div className="spyfall-hero-icon"><ShieldQuestion/></div>
        <h1>{text.title}</h1><p>{text.subtitle}</p>
        <label>{text.players}
          <div className="spyfall-stepper">
            <button onClick={() => setPlayerCount((count) => Math.max(5, count - 1))} disabled={playerCount === 5}>−</button>
            <strong>{playerCount}</strong>
            <button onClick={() => setPlayerCount((count) => Math.min(12, count + 1))} disabled={playerCount === 12}>+</button>
          </div>
        </label>
        <div className="spyfall-spy-count"><Users/><span>{text.spies}</span><strong>{spyCount}</strong></div>
        <fieldset><legend>{text.time}</legend><div className="spyfall-time-options">
          {([5, 8, 10] as const).map((minutes) => <button key={minutes} className={durationMinutes === minutes ? "is-active" : ""} onClick={() => { setDurationMinutes(minutes); setSecondsLeft(minutes * 60); }}>{minutes} min</button>)}
        </div></fieldset>
        <button className="button button-primary spyfall-main-button" onClick={createGame} disabled={!settings.locations.some((item) => item.active)}>{text.create}</button>
        <Link href="/admin/activities/spyfall" className="spyfall-admin-link">Admin · Spyfall</Link>
      </section>}

      {phase === "handoff" && <section className="spyfall-card spyfall-private">
        <EyeOff/><div className="spyfall-progress">{text.participant} {roleIndex + 1} / {playerCount}</div>
        <h1>{text.pass}</h1><p>{text.private}</p>
        <button className="button button-primary spyfall-main-button" onClick={() => setPhase("reveal")}><Eye/>{text.reveal}</button>
      </section>}

      {phase === "reveal" && location && <section className={`spyfall-card spyfall-role ${spyNumbers.includes(roleIndex + 1) ? "is-spy" : "is-citizen"}`}>
        <div className="spyfall-progress">{text.participant} {roleIndex + 1} / {playerCount}</div>
        {spyNumbers.includes(roleIndex + 1) ? <>
          <span className="spyfall-role-emoji">🕵️</span><h1>{text.spy}</h1><p>{text.spyHelp}</p>
        </> : <>
          <MapPin/><span>{text.location}</span><h1>{language === "ko" ? location.nameKo : location.nameEn}</h1>
          <p>{language === "ko" ? location.nameEn : location.nameKo}</p>
        </>}
        <button className="button spyfall-hide-button" onClick={hideRole}><EyeOff/>{text.hide}</button>
      </section>}

      {phase === "ready" && <section className="spyfall-card spyfall-ready">
        <span>✓</span><h1>{text.ready}</h1><p>{playerCount} {text.players} · {spyCount} {text.spies}</p>
        <button className="button button-primary spyfall-main-button" onClick={() => { setPhase("playing"); setTimerRunning(true); }}><Play/>{text.start}</button>
      </section>}

      {phase === "playing" && <section className="spyfall-game-layout">
        <div className="spyfall-game-top">
          <span>{text.remaining}</span>
          <strong role="timer" aria-live="polite">{formatTime(secondsLeft)}</strong>
          {secondsLeft <= 10 && <b>{text.warning}</b>}
          <div className="spyfall-timer-actions">
            <button onClick={() => setTimerRunning((running) => !running)}>{timerRunning ? <Pause/> : <Play/>}{timerRunning ? text.pause : text.resume}</button>
            <button onClick={() => { setTimerRunning(false); setSecondsLeft(durationMinutes * 60); endSoundPlayed.current = false; }}><RotateCcw/>{text.reset}</button>
          </div>
        </div>
        <div className="spyfall-questioner"><span>{text.questioner}</span><strong>{text.participant} {questioner}</strong>
          <button onClick={() => setQuestioner((current) => current >= playerCount ? 1 : current + 1)}><SkipForward/>{text.next}</button>
        </div>
        <div className="spyfall-accordions">
          <button onClick={() => setRulesOpen((open) => !open)} aria-expanded={rulesOpen}>{text.rules}<ChevronDown/></button>
          {rulesOpen && <ul>{rules.map(([ko, en]) => <li key={en}><b>{ko}</b><span>{en}</span></li>)}</ul>}
          <button onClick={() => setQuestionsOpen((open) => !open)} aria-expanded={questionsOpen}>{text.examples}<ChevronDown/></button>
          {questionsOpen && <ol>{settings.questions.filter((question) => question.active).map((question) => <li key={question.id}><b>{question.questionKo}</b><span>{question.questionEn}</span></li>)}</ol>}
        </div>
        <button className="button spyfall-vote-button" onClick={beginVoting}>{text.voteNow}<ChevronRight/></button>
      </section>}

      {phase === "voting" && <section className="spyfall-card spyfall-voting">
        <EyeOff/><div className="spyfall-progress">{text.participant} {voterIndex + 1} / {playerCount}</div>
        <h1>{text.voting}</h1><p>{voterIndex > 0 ? text.passVote : text.voteInstruction}</p>
        <div className="spyfall-player-grid">
          {Array.from({ length: playerCount }, (_, index) => index + 1).map((number) => <button key={number} disabled={number === voterIndex + 1} className={selectedVote === number ? "is-selected" : ""} onClick={() => setSelectedVote(number)}>{number}</button>)}
        </div>
        <button className="button button-primary spyfall-main-button" disabled={!selectedVote} onClick={confirmVote}>{text.vote}</button>
      </section>}

      {phase === "vote-summary" && <section className="spyfall-card spyfall-results">
        <h1>{text.votesComplete}</h1>
        <p>{text.leaders}: <strong>{voteResult.leaders.map((number) => `${text.participant} ${number}`).join(", ")}</strong></p>
        <p>{voteResult.highest > playerCount / 2 ? `✓ ${text.majority}` : text.noMajority} · {voteResult.highest}/{playerCount}</p>
        <div className="spyfall-vote-bars">{voteResult.totals.map((count, index) => <div key={index}><span>{index + 1}</span><i style={{ width: `${(count / playerCount) * 100}%` }}/><b>{count}</b></div>)}</div>
        <button className="button button-primary spyfall-main-button" onClick={() => { setPhase(spyCaught ? "identity" : "final"); if (!spyCaught) setSpyGuessedLocation(null); }}>{text.revealIdentity}</button>
      </section>}

      {phase === "identity" && location && <section className="spyfall-card spyfall-identity">
        <span>🕵️</span><h1>{text.actualSpies}: {spyNumbers.map((number) => `${text.participant} ${number}`).join(", ")}</h1>
        <div><MapPin/><b>{location.nameKo}</b><small>{location.nameEn}</small></div>
        <p>{text.caught}</p><strong>{text.lastChance}</strong>
        <div className="spyfall-final-choice">
          <button onClick={() => { setSpyGuessedLocation(true); setPhase("final"); }}>{text.correct}</button>
          <button onClick={() => { setSpyGuessedLocation(false); setPhase("final"); }}>{text.wrong}</button>
        </div>
      </section>}

      {phase === "final" && location && <section className={`spyfall-card spyfall-final ${citizensWin ? "citizens-win" : "spies-win"}`}>
        <span>{citizensWin ? "🎉" : "🕵️"}</span><h1>{citizensWin ? text.citizensWin : text.spiesWin}</h1>
        <p>{citizensWin ? text.citizensWinText : text.spiesWinText}</p>
        <dl>
          <div><dt>{text.actualSpies}</dt><dd>{spyNumbers.map((number) => `${text.participant} ${number}`).join(", ")}</dd></div>
          <div><dt>{text.location}</dt><dd>{location.nameKo} · {location.nameEn}</dd></div>
          <div><dt>{text.leaders}</dt><dd>{voteResult.leaders.map((number) => `${text.participant} ${number}`).join(", ")}</dd></div>
        </dl>
        <div className="spyfall-vote-bars">{voteResult.totals.map((count, index) => <div key={index}><span>{index + 1}</span><i style={{ width: `${(count / playerCount) * 100}%` }}/><b>{count} {text.votes}</b></div>)}</div>
        <button className="button button-primary" onClick={() => startOver(true)}>{text.same}</button>
        <button className="button button-secondary" onClick={() => startOver(false)}>{text.new}</button>
        <Link className="button button-secondary" href="/activities" onClick={clearSpyfallSession}>{text.list}</Link>
      </section>}
    </main>
  );
}
