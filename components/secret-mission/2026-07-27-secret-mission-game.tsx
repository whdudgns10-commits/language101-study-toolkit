"use client";

import Link from "next/link";
import {
  ArrowLeft, Check, ChevronRight, Clock3, Drama, Eye, EyeOff, Plus,
  RotateCcw, Search, Sparkles, Trash2, Trophy, Users, X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { defaultSecretMissions } from "@/data/2026-07-27-secret-missions";
import {
  assignSecretMissions,
  getSecretMissionStats,
  normalizeSecretMissionPlayers,
} from "@/lib/2026-07-27-secret-mission-engine";
import {
  clearSecretMissionSession,
  loadCustomSecretMissions,
  loadSecretMissionSession,
  saveCustomSecretMissions,
  saveSecretMissionSession,
} from "@/lib/2026-07-27-secret-mission-storage";
import {
  secretMissionCategories,
  secretMissionDifficulties,
  type SecretMission,
  type SecretMissionAssignment,
  type SecretMissionCategory,
  type SecretMissionDifficulty,
  type SecretMissionLanguage,
  type SecretMissionTimer,
} from "@/types/2026-07-27-secret-mission";

type Phase = "setup" | "handoff" | "reveal" | "ready" | "playing" | "private" | "private-reveal" | "results";
type DifficultyFilter = SecretMissionDifficulty | "random";

const categoryLabels: Record<SecretMissionCategory, string> = {
  conversation: "대화", action: "행동", expression: "표현", "get-to-know": "서로 알기",
  culture: "문화", photo: "사진", humor: "유머", mystery: "미스터리", teamwork: "팀워크",
  "english-expression": "영어 표현", "getting-to-know": "서로 알아가기",
  observation: "관찰", memory: "기억", networking: "교류",
  storytelling: "스토리텔링", "language-exchange": "언어 교환",
};
const difficultyLabels = { easy: "쉬움", medium: "보통", hard: "어려움", random: "랜덤" } as const;

function formatTime(seconds: number | null) {
  if (seconds === null) return "∞";
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

function MissionText({ mission, language }: { mission: SecretMission; language: SecretMissionLanguage }) {
  return <div className="secret-mission-text">
    {language !== "en" && <strong>{mission.ko}</strong>}
    {language !== "ko" && <span>{mission.en}</span>}
  </div>;
}

export function SecretMissionGame() {
  const [phase, setPhase] = useState<Phase>("setup");
  const [playerCount, setPlayerCount] = useState(4);
  const [names, setNames] = useState<string[]>(Array(20).fill(""));
  const [language, setLanguage] = useState<SecretMissionLanguage>("both");
  const [difficulty, setDifficulty] = useState<DifficultyFilter>("random");
  const [timerMinutes, setTimerMinutes] = useState<SecretMissionTimer>(15);
  const [customMissions, setCustomMissions] = useState<SecretMission[]>([]);
  const [assignments, setAssignments] = useState<SecretMissionAssignment[]>([]);
  const [revealIndex, setRevealIndex] = useState(0);
  const [privateIndex, setPrivateIndex] = useState<number | null>(null);
  const [revealedResults, setRevealedResults] = useState<Set<number>>(new Set());
  const [secondsLeft, setSecondsLeft] = useState<number | null>(15 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<SecretMissionCategory | "all">("all");
  const [selectionDifficulty, setSelectionDifficulty] = useState<SecretMissionDifficulty | "all">("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set(defaultSecretMissions.map((item) => item.id)));
  const [showMissionPicker, setShowMissionPicker] = useState(false);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customKo, setCustomKo] = useState("");
  const [customEn, setCustomEn] = useState("");
  const [customDifficulty, setCustomDifficulty] = useState<SecretMissionDifficulty>("easy");
  const [customCategory, setCustomCategory] = useState<SecretMissionCategory>("conversation");

  const allMissions = useMemo(() => [...defaultSecretMissions, ...customMissions], [customMissions]);
  const visibleMissions = useMemo(() => allMissions.filter((mission) => {
    const query = search.trim().toLowerCase();
    return (!query || mission.ko.toLowerCase().includes(query) || mission.en.toLowerCase().includes(query))
      && (categoryFilter === "all" || mission.category === categoryFilter)
      && (selectionDifficulty === "all" || mission.difficulty === selectionDifficulty);
  }), [allMissions, categoryFilter, search, selectionDifficulty]);
  const missionStats = useMemo(() => getSecretMissionStats(allMissions), [allMissions]);
  const completedCount = assignments.filter((item) => item.completed).length;

  useEffect(() => {
    queueMicrotask(() => {
      const custom = loadCustomSecretMissions();
      setCustomMissions(custom);
      setSelectedIds((current) => new Set([...current, ...custom.map((item) => item.id)]));
      const session = loadSecretMissionSession();
      if (session && session.assignments.length >= 4) {
        setAssignments(session.assignments);
        setLanguage(session.language);
        setTimerMinutes(session.timerMinutes);
        setSecondsLeft(session.secondsLeft);
        setPlayerCount(session.assignments.length);
        setPhase("playing");
      }
    });
  }, []);

  useEffect(() => {
    if (!timerRunning || secondsLeft === null || secondsLeft <= 0) return;
    const timer = window.setInterval(() => {
      if (secondsLeft <= 1) {
        setSecondsLeft(0);
        setTimerRunning(false);
      } else {
        setSecondsLeft(secondsLeft - 1);
      }
    }, 1000);
    return () => window.clearInterval(timer);
  }, [secondsLeft, timerRunning]);

  const persistSession = useCallback((nextAssignments: SecretMissionAssignment[], nextSeconds = secondsLeft) => {
    saveSecretMissionSession({
      version: 1, assignments: nextAssignments, language, timerMinutes,
      secondsLeft: nextSeconds, startedAt: Date.now(),
    });
  }, [language, secondsLeft, timerMinutes]);

  function createGame() {
    if (playerCount < 4 || playerCount > 20) return;
    const eligible = allMissions.filter((mission) =>
      selectedIds.has(mission.id) && (difficulty === "random" || mission.difficulty === difficulty));
    if (!eligible.length) return;
    const next = assignSecretMissions(normalizeSecretMissionPlayers(names, playerCount), eligible);
    setAssignments(next);
    setRevealIndex(0);
    setSecondsLeft(timerMinutes === 0 ? null : timerMinutes * 60);
    setRevealedResults(new Set());
    setPhase("handoff");
    persistSession(next, timerMinutes === 0 ? null : timerMinutes * 60);
  }

  function hideMission() {
    if (revealIndex + 1 >= assignments.length) setPhase("ready");
    else {
      setRevealIndex((index) => index + 1);
      setPhase("handoff");
    }
  }

  function setCompleted(index: number, completed: boolean) {
    const next = assignments.map((item, itemIndex) => itemIndex === index ? { ...item, completed } : item);
    setAssignments(next);
    persistSession(next);
  }

  function addCustomMission() {
    if (!customKo.trim() || !customEn.trim()) return;
    const mission: SecretMission = {
      id: `secret-custom-${Date.now()}`, ko: customKo.trim(), en: customEn.trim(),
      difficulty: customDifficulty, category: customCategory, custom: true,
    };
    const next = [...customMissions, mission];
    setCustomMissions(next);
    setSelectedIds((ids) => new Set([...ids, mission.id]));
    saveCustomSecretMissions(next);
    setCustomKo("");
    setCustomEn("");
  }

  function deleteCustomMission(id: string) {
    const next = customMissions.filter((item) => item.id !== id);
    setCustomMissions(next);
    setSelectedIds((ids) => {
      const copy = new Set(ids);
      copy.delete(id);
      return copy;
    });
    saveCustomSecretMissions(next);
  }

  function resetGame() {
    clearSecretMissionSession();
    setAssignments([]);
    setPhase("setup");
    setTimerRunning(false);
    setSecondsLeft(timerMinutes === 0 ? null : timerMinutes * 60);
  }

  if (phase === "setup") return <main className="secret-mission-page">
    <header className="secret-mission-header"><Link href="/activities"><ArrowLeft/>Activities</Link><span><Drama/>비밀 미션 · Secret Mission</span></header>
    <section className="secret-mission-card secret-mission-setup">
      <div className="secret-mission-hero"><Drama/></div>
      <h1>비밀 미션</h1><p>각자 비밀 미션을 받고, 대화 속에서 들키지 않게 미션을 완료해보세요.</p>
      <dl className="secret-mission-stats" aria-label="사용 가능한 미션 통계">
        <div><dt>전체 미션</dt><dd>{missionStats.total}개</dd></div>
        <div><dt>쉬움</dt><dd>{missionStats.easy}개</dd></div>
        <div><dt>보통</dt><dd>{missionStats.medium}개</dd></div>
        <div><dt>어려움</dt><dd>{missionStats.hard}개</dd></div>
      </dl>
      <div className="secret-mission-steps"><b>1 설정</b><span>2 비공개 확인</span><span>3 게임</span><span>4 결과</span></div>
      <label className="secret-mission-count">참가 인원 · Players
        <div><button disabled={playerCount === 4} onClick={() => setPlayerCount((count) => Math.max(4, count - 1))}>−</button><strong>{playerCount}</strong><button disabled={playerCount === 20} onClick={() => setPlayerCount((count) => Math.min(20, count + 1))}>+</button></div>
      </label>
      {playerCount < 4 && <p role="alert">최소 4명 이상이어야 게임을 시작할 수 있습니다.</p>}
      <div className="secret-mission-names">{Array.from({ length: playerCount }, (_, index) => <label key={index}>P{index + 1}<input aria-label={`Player ${index + 1} name`} value={names[index]} placeholder={`Player ${index + 1}`} onChange={(event) => setNames((values) => values.map((value, valueIndex) => valueIndex === index ? event.target.value : value))}/></label>)}</div>
      <fieldset><legend>미션 표시 언어</legend><div className="secret-mission-options">{(["ko","en","both"] as const).map((value) => <button className={language === value ? "is-active" : ""} key={value} onClick={() => setLanguage(value)}>{value === "ko" ? "한국어" : value === "en" ? "English" : "한국어 + English"}</button>)}</div></fieldset>
      <fieldset><legend>난이도</legend><div className="secret-mission-options">{(["easy","medium","hard","random"] as const).map((value) => <button className={difficulty === value ? "is-active" : ""} key={value} onClick={() => setDifficulty(value)}>{difficultyLabels[value]}</button>)}</div></fieldset>
      <fieldset><legend>게임 시간</legend><div className="secret-mission-options">{([10,15,20,30,0] as const).map((value) => <button className={timerMinutes === value ? "is-active" : ""} key={value} onClick={() => setTimerMinutes(value)}>{value ? `${value}분` : "무제한"}</button>)}</div></fieldset>

      <button className="secret-mission-secondary" onClick={() => setShowMissionPicker((open) => !open)}><Search/>미션 선택 및 제외 ({selectedIds.size}/{allMissions.length})<ChevronRight/></button>
      {showMissionPicker && <section className="secret-mission-picker">
        <div className="secret-mission-filter"><label><Search/><input placeholder="한국어 또는 영어 미션 검색" value={search} onChange={(event) => setSearch(event.target.value)}/></label><select aria-label="난이도 필터" value={selectionDifficulty} onChange={(event) => setSelectionDifficulty(event.target.value as SecretMissionDifficulty | "all")}><option value="all">모든 난이도</option>{secretMissionDifficulties.map((value) => <option key={value} value={value}>{difficultyLabels[value]}</option>)}</select><select aria-label="카테고리 필터" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value as SecretMissionCategory | "all")}><option value="all">모든 카테고리</option>{secretMissionCategories.map((value) => <option key={value} value={value}>{categoryLabels[value]}</option>)}</select></div>
        <div className="secret-mission-select-actions"><button onClick={() => setSelectedIds((ids) => new Set([...ids, ...visibleMissions.map((item) => item.id)]))}>현재 목록 전체 선택</button><button onClick={() => setSelectedIds((ids) => { const copy = new Set(ids); visibleMissions.forEach((item) => copy.delete(item.id)); return copy; })}>현재 목록 선택 해제</button></div>
        <div className="secret-mission-pick-list">{visibleMissions.map((mission) => <label key={mission.id}><input type="checkbox" checked={selectedIds.has(mission.id)} onChange={() => setSelectedIds((ids) => { const copy = new Set(ids); if (copy.has(mission.id)) copy.delete(mission.id); else copy.add(mission.id); return copy; })}/><span><b>{mission.ko}</b><small>{categoryLabels[mission.category]} · {difficultyLabels[mission.difficulty]}</small></span>{mission.custom && <button aria-label="커스텀 미션 삭제" onClick={(event) => { event.preventDefault(); deleteCustomMission(mission.id); }}><Trash2/></button>}</label>)}</div>
      </section>}

      <button className="secret-mission-secondary" onClick={() => setShowCustomForm((open) => !open)}><Plus/>직접 미션 추가</button>
      {showCustomForm && <section className="secret-mission-custom"><input placeholder="한국어 미션" value={customKo} onChange={(event) => setCustomKo(event.target.value)}/><input placeholder="English mission" value={customEn} onChange={(event) => setCustomEn(event.target.value)}/><select value={customDifficulty} onChange={(event) => setCustomDifficulty(event.target.value as SecretMissionDifficulty)}>{secretMissionDifficulties.map((value) => <option value={value} key={value}>{difficultyLabels[value]}</option>)}</select><select value={customCategory} onChange={(event) => setCustomCategory(event.target.value as SecretMissionCategory)}>{secretMissionCategories.map((value) => <option value={value} key={value}>{categoryLabels[value]}</option>)}</select><button disabled={!customKo.trim() || !customEn.trim()} onClick={addCustomMission}><Plus/>추가</button></section>}
      <button className="secret-mission-primary" disabled={playerCount < 4 || selectedIds.size === 0} onClick={createGame}><Sparkles/>미션 배정하기</button>
    </section>
  </main>;

  if (phase === "handoff" || phase === "reveal") {
    const current = assignments[revealIndex];
    return <main className="secret-mission-page secret-mission-private"><section className="secret-mission-card">
      <div className="secret-mission-progress">MISSION {revealIndex + 1} / {assignments.length}</div>
      {phase === "handoff" ? <><EyeOff/><h1>{current.player.name}님에게<br/>휴대폰을 전달해주세요.</h1><p>화면을 본인만 볼 수 있을 때 미션 확인을 눌러주세요.</p><button className="secret-mission-primary" onClick={() => setPhase("reveal")}><Eye/>내 미션 확인</button></> : <><span className="secret-mission-label">{categoryLabels[current.mission.category]} · {difficultyLabels[current.mission.difficulty]}</span><h1>{current.player.name}님의 비밀 미션</h1><MissionText mission={current.mission} language={language}/><p>미션을 기억한 뒤 화면을 숨겨주세요.</p><button className="secret-mission-primary" onClick={hideMission}><EyeOff/>기억했어요 · 화면 숨기기</button></>}
    </section></main>;
  }

  if (phase === "ready") return <main className="secret-mission-page secret-mission-private"><section className="secret-mission-card"><div className="secret-mission-hero"><Check/></div><h1>모든 미션이 준비됐어요!</h1><p>{assignments.length}명 · {timerMinutes ? `${timerMinutes}분` : "무제한"} · 서로의 미션을 모르게 대화를 시작하세요.</p><button className="secret-mission-primary" onClick={() => { setPhase("playing"); setTimerRunning(true); }}><Sparkles/>게임 시작</button></section></main>;

  if (phase === "private" || phase === "private-reveal") {
    const current = privateIndex === null ? null : assignments[privateIndex];
    return <main className="secret-mission-page secret-mission-private"><section className="secret-mission-card">
      {phase === "private" ? <><EyeOff/><h1>본인의 이름을 선택하세요.</h1><p>다른 참가자가 화면을 보지 않도록 가려주세요.</p><div className="secret-mission-player-grid">{assignments.map((item, index) => <button key={item.player.id} onClick={() => { setPrivateIndex(index); setPhase("private-reveal"); }}>{item.completed && <Check/>}{item.player.name}</button>)}</div><button className="secret-mission-secondary" onClick={() => setPhase("playing")}><X/>취소</button></> : current && <><span className="secret-mission-label">{current.player.name}</span><h1>내 비밀 미션</h1><MissionText mission={current.mission} language={language}/><button className={`secret-mission-primary ${current.completed ? "is-complete" : ""}`} onClick={() => setCompleted(privateIndex!, !current.completed)}>{current.completed ? <RotateCcw/> : <Check/>}{current.completed ? "완료 취소" : "미션 완료"}</button><button className="secret-mission-secondary" onClick={() => { setPrivateIndex(null); setPhase("playing"); }}><EyeOff/>화면 숨기기</button></>}
    </section></main>;
  }

  if (phase === "results") {
    const revealedAssignments = assignments.filter((_, index) => revealedResults.has(index));
    const revealedSuccess = revealedAssignments.filter((item) => item.completed).length;
    const hardest = assignments.find((item) => item.mission.difficulty === "hard") ?? assignments[0];
    return <main className="secret-mission-page"><header className="secret-mission-header"><Link href="/activities"><ArrowLeft/>Activities</Link><span><Trophy/>Mission Results</span></header><section className="secret-mission-card secret-mission-results">
      <Trophy/><h1>최종 미션 공개</h1><p>한 명씩 미션과 성공 여부를 공개해보세요.</p>
      <button className="secret-mission-secondary" onClick={() => setRevealedResults(new Set(assignments.map((_, index) => index)))}><Eye/>모두 공개</button>
      <div>{assignments.map((item, index) => <article className={revealedResults.has(index) ? item.completed ? "is-success" : "is-fail" : ""} key={item.player.id}><header><b>{item.player.name}</b><span>{revealedResults.has(index) ? item.completed ? "성공 ✓" : "실패" : "비공개"}</span></header>{revealedResults.has(index) ? <MissionText mission={item.mission} language={language}/> : <button onClick={() => setRevealedResults((values) => new Set([...values, index]))}><Eye/>미션 공개</button>}</article>)}</div>
      {revealedResults.size === assignments.length && <dl><div><dt>성공</dt><dd>{revealedSuccess}</dd></div><div><dt>실패</dt><dd>{assignments.length - revealedSuccess}</dd></div><div><dt>성공률</dt><dd>{Math.round(revealedSuccess / assignments.length * 100)}%</dd></div><div><dt>가장 어려운 미션</dt><dd>{hardest.mission.ko}</dd></div></dl>}
      <button className="secret-mission-primary" onClick={() => { const next = assignments.map((item) => ({ ...item, completed: false })); setAssignments(next); setRevealIndex(0); setRevealedResults(new Set()); setPhase("handoff"); persistSession(next); }}><RotateCcw/>같은 미션으로 다시 하기</button>
      <button className="secret-mission-secondary" onClick={resetGame}><Sparkles/>새로운 미션 받기</button>
    </section></main>;
  }

  return <main className="secret-mission-page">
    <header className="secret-mission-header"><Link href="/activities/secret-mission"><ArrowLeft/>Activities</Link><span><Drama/>비밀 미션 · Secret Mission</span></header>
    <nav className="secret-mission-game-status"><span><Clock3/>{formatTime(secondsLeft)}</span><span><Users/>{assignments.length}명</span><span><Check/>{completedCount}/{assignments.length}</span></nav>
    <section className="secret-mission-card secret-mission-playing">
      <div className="secret-mission-steps"><span>1 설정</span><span>2 비공개 확인</span><b>3 게임</b><span>4 결과</span></div>
      <span className="secret-mission-label">SECRET MISSION IN PROGRESS</span>
      <h1>{formatTime(secondsLeft)}</h1>
      <p>서로의 미션을 추리하면서 자연스럽게 대화하세요.</p>
      <div className="secret-mission-timer-actions">{secondsLeft !== null && <button onClick={() => setTimerRunning((running) => !running)}>{timerRunning ? "일시정지" : "계속하기"}</button>}<button onClick={() => { const value = timerMinutes === 0 ? null : timerMinutes * 60; setSecondsLeft(value); setTimerRunning(false); persistSession(assignments, value); }}><RotateCcw/>시간 초기화</button></div>
      <button className="secret-mission-primary" onClick={() => setPhase("private")}><EyeOff/>내 미션 확인 · 완료 체크</button>
      <aside><b>완료 현황</b><strong>{completedCount} / {assignments.length}</strong><small>누가 완료했는지는 비공개입니다.</small></aside>
      <button className="secret-mission-end" onClick={() => { setTimerRunning(false); setRevealedResults(new Set()); setPhase("results"); }}><Trophy/>게임 종료 및 결과 보기</button>
    </section>
  </main>;
}
