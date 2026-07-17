"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check, Clock3, Maximize2, Plus, RefreshCw, Save, Shuffle, Trash2, Trophy, X } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import {
  alphabetWinners,
  applyAlphabetResult,
  chooseRandomLetter,
  nextAlphabetPlayer,
  resetAlphabetPlayers,
  type AlphabetPlayer,
  type AlphabetRoundResult,
} from "@/lib/alphabet-challenge";
import { saveAlphabetPractice } from "@/lib/alphabet-challenge-storage";

const ui = {
  en: { title:"Alphabet Challenge", current:"Current Player", letter:"Current Letter", remaining:"Time Remaining", draw:"Draw a Letter", prompt:"Say an English word beginning with", initial:"Press Draw a Letter to begin.", correct:"Correct", timeout:"Time’s Up", skip:"Skip", finish:"Finish Game", settings:"Player Settings", players:"Players", add:"Add Player", scoreboard:"Scoreboard", correctScore:"correct", missedScore:"missed", winner:"Winner", joint:"Joint Winners", rounds:"Rounds", letters:"Letters Used", again:"Play Again", save:"Save to My Study", saved:"Saved to My Study.", memo:"Memo", table:"Table Mode", close:"Exit Table Mode" },
  ko: { title:"5초 알파벳 게임", current:"현재 참가자", letter:"현재 알파벳", remaining:"남은 시간", draw:"알파벳 뽑기", prompt:"5초 안에 다음 글자로 시작하는 영어 단어를 말하세요:", initial:"알파벳 뽑기를 눌러 시작하세요.", correct:"정답", timeout:"시간 초과", skip:"건너뛰기", finish:"게임 종료", settings:"참가자 설정", players:"참가자", add:"참가자 추가", scoreboard:"점수판", correctScore:"정답", missedScore:"실패", winner:"우승자", joint:"공동 우승", rounds:"진행한 라운드", letters:"사용한 알파벳", again:"다시 하기", save:"My Study에 저장", saved:"My Study에 저장했습니다.", memo:"메모", table:"테이블 모드", close:"테이블 모드 종료" },
  zh: { title:"5秒字母挑战", current:"当前玩家", letter:"当前字母", remaining:"剩余时间", draw:"抽取字母", prompt:"请在5秒内说出以这个字母开头的英语单词：", initial:"点击抽取字母开始。", correct:"正确", timeout:"时间到", skip:"跳过", finish:"结束游戏", settings:"玩家设置", players:"玩家", add:"添加玩家", scoreboard:"记分板", correctScore:"正确", missedScore:"失败", winner:"获胜者", joint:"共同获胜者", rounds:"回合数", letters:"已用字母", again:"再玩一次", save:"保存到 My Study", saved:"已保存到 My Study。", memo:"备注", table:"桌面模式", close:"退出桌面模式" },
  ja: { title:"5秒アルファベットチャレンジ", current:"現在のプレイヤー", letter:"現在の文字", remaining:"残り時間", draw:"文字を引く", prompt:"5秒以内にこの文字で始まる英単語を言ってください：", initial:"文字を引くを押して始めましょう。", correct:"正解", timeout:"時間切れ", skip:"スキップ", finish:"ゲーム終了", settings:"プレイヤー設定", players:"プレイヤー", add:"プレイヤー追加", scoreboard:"スコアボード", correctScore:"正解", missedScore:"失敗", winner:"優勝者", joint:"同時優勝", rounds:"ラウンド数", letters:"使用した文字", again:"もう一度", save:"My Studyに保存", saved:"My Studyに保存しました。", memo:"メモ", table:"テーブルモード", close:"テーブルモード終了" },
} as const;

const defaultPlayers = (): AlphabetPlayer[] => Array.from({ length:4 }, (_, index) => ({ id:`player-${index + 1}`, name:"", correct:0, missed:0 }));

export function AlphabetChallengeGame() {
  const { language } = useLanguage();
  const text = ui[language];
  const drawInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const drawTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [players, setPlayers] = useState<AlphabetPlayer[]>(defaultPlayers);
  const [current, setCurrent] = useState(0);
  const [letter, setLetter] = useState("");
  const [usedLetters, setUsedLetters] = useState<string[]>([]);
  const [remaining, setRemaining] = useState(5);
  const [phase, setPhase] = useState<"ready" | "drawing" | "playing" | "finished">("ready");
  const [rounds, setRounds] = useState(0);
  const [tableMode, setTableMode] = useState(false);
  const [memo, setMemo] = useState("");
  const [saved, setSaved] = useState(false);
  const winners = useMemo(() => alphabetWinners(players), [players]);
  const playerName = useCallback((player:AlphabetPlayer, index:number) => player.name.trim() || `${language === "en" ? "Player" : text.players} ${index + 1}`, [language, text.players]);

  const clearDrawTimers = useCallback(() => {
    if (drawInterval.current) clearInterval(drawInterval.current);
    if (drawTimeout.current) clearTimeout(drawTimeout.current);
    drawInterval.current = null;
    drawTimeout.current = null;
  }, []);

  const finishRound = useCallback((result:AlphabetRoundResult) => {
    setPlayers((values) => values.map((player, index) => index === current ? applyAlphabetResult(player, result) : player));
    setRounds((value) => value + 1);
    setCurrent((value) => nextAlphabetPlayer(value, players.length));
    setLetter("");
    setRemaining(5);
    setPhase("ready");
  }, [current, players.length]);

  useEffect(() => () => clearDrawTimers(), [clearDrawTimers]);
  useEffect(() => {
    if (phase !== "playing") return;
    if (remaining === 0) {
      if (navigator.vibrate) navigator.vibrate([120, 70, 120]);
      const resultTimer = setTimeout(() => finishRound("missed"), 350);
      return () => clearTimeout(resultTimer);
    }
    const timer = setTimeout(() => setRemaining((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [finishRound, phase, remaining]);

  function drawLetter() {
    if (phase !== "ready") return;
    clearDrawTimers();
    const finalLetter = chooseRandomLetter(usedLetters);
    setPhase("drawing");
    let cursor = 0;
    drawInterval.current = setInterval(() => {
      setLetter(String.fromCharCode(65 + (cursor % 26)));
      cursor += 1;
    }, 60);
    drawTimeout.current = setTimeout(() => {
      clearDrawTimers();
      setLetter(finalLetter);
      setUsedLetters((values) => values.length >= 26 ? [finalLetter] : [...values, finalLetter]);
      setRemaining(5);
      setPhase("playing");
    }, 800);
  }

  function addPlayer() {
    if (players.length >= 8) return;
    setPlayers((values) => [...values, { id:`player-${Date.now()}`, name:"", correct:0, missed:0 }]);
  }

  function removePlayer(id:string) {
    if (players.length <= 2) return;
    setPlayers((values) => values.filter((player) => player.id !== id));
    setCurrent(0);
  }

  function finishGame() {
    clearDrawTimers();
    setPhase("finished");
  }

  function playAgain() {
    clearDrawTimers();
    setPlayers((values) => resetAlphabetPlayers(values));
    setCurrent(0);
    setLetter("");
    setUsedLetters([]);
    setRemaining(5);
    setRounds(0);
    setSaved(false);
    setPhase("ready");
  }

  function save() {
    const now = new Date();
    saveAlphabetPractice({
      id:`alphabet-${now.getTime()}`,
      date:now.toLocaleDateString("en-CA"),
      participantCount:players.length,
      level:"All Levels",
      letters:usedLetters,
      rounds,
      correct:players.reduce((sum, player) => sum + player.correct, 0),
      missed:players.reduce((sum, player) => sum + player.missed, 0),
      winner:winners.map((winner) => playerName(winner, players.indexOf(winner))).join(", "),
      memo,
      createdAt:now.toISOString(),
    });
    setSaved(true);
  }

  return <section className={`alphabet-game${tableMode ? " is-table-mode" : ""}`}>
    <header className="alphabet-game-head"><div><span>ALPHABET CHALLENGE</span><h2>{text.title}</h2></div><button onClick={() => setTableMode((value) => !value)}><Maximize2/>{tableMode ? text.close : text.table}</button></header>
    {phase === "finished" ? <div className="alphabet-results"><Trophy/><span>{winners.length > 1 ? text.joint : text.winner}</span><h2>{winners.map((winner) => playerName(winner, players.indexOf(winner))).join(" · ")}</h2><div>{players.map((player, index) => <p key={player.id}><b>{playerName(player, index)}</b><span>{text.correctScore} {player.correct} · {text.missedScore} {player.missed}</span></p>)}</div><p><b>{text.rounds}</b><span>{rounds}</span></p><p><b>{text.letters}</b><span>{usedLetters.join(" · ") || "—"}</span></p><label>{text.memo}<textarea value={memo} onChange={(event) => setMemo(event.target.value)}/></label><button className="button button-primary" onClick={save}><Save/>{saved ? text.saved : text.save}</button><button className="button button-secondary" onClick={playAgain}><RefreshCw/>{text.again}</button></div> : <>
      {!tableMode && <details className="alphabet-settings"><summary>{text.settings}</summary><div className="alphabet-player-settings"><label>{text.players}<span>{players.map((player, index) => <span key={player.id}><input value={player.name} placeholder={playerName(player, index)} onChange={(event) => setPlayers((values) => values.map((item, itemIndex) => itemIndex === index ? { ...item, name:event.target.value } : item))}/><button aria-label={`Remove ${playerName(player, index)}`} onClick={() => removePlayer(player.id)} disabled={players.length <= 2}><Trash2/></button></span>)}</span><button onClick={addPlayer} disabled={players.length >= 8}><Plus/>{text.add}</button></label></div></details>}
      <div className="alphabet-stage"><span>{text.current}</span><h2>{playerName(players[current], current)}</h2><small>{text.letter}</small><strong className={phase === "drawing" ? "is-drawing" : ""}>{letter || "?"}</strong><small>{text.remaining}</small><div className={`alphabet-countdown${remaining <= 3 && phase === "playing" ? " is-urgent" : ""}`}>{phase === "playing" ? remaining === 0 ? text.timeout : remaining : "—"}</div><p>{letter && phase === "playing" ? `${text.prompt} ${letter}` : text.initial}</p></div>
      <div className="alphabet-actions">{phase === "ready" ? <button className="draw-letter" onClick={drawLetter}><Shuffle/>{text.draw}</button> : <><button className="correct" disabled={phase !== "playing"} onClick={() => finishRound("correct")}><Check/>{text.correct}</button><button className="timeout" disabled={phase !== "playing"} onClick={() => finishRound("missed")}><Clock3/>{text.timeout}</button><button disabled={phase !== "playing"} onClick={() => finishRound("skip")}><X/>{text.skip}</button></>}<button className="finish" onClick={finishGame}>{text.finish}</button></div>
      {!tableMode && <details className="alphabet-scoreboard" open><summary>{text.scoreboard}</summary>{players.map((player, index) => <p className={index === current ? "is-current" : ""} key={player.id}><b>{playerName(player, index)}</b><span>{text.correctScore} {player.correct} · {text.missedScore} {player.missed}</span></p>)}</details>}
    </>}
  </section>;
}
