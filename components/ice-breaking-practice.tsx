"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Heart,
  History,
  MessageCircleMore,
  Shuffle,
  UsersRound,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  conversationStarterCategories,
  conversationStarterCategoryCounts,
  conversationStarters,
  type ConversationStarterDifficulty,
} from "@/data/ice-breaking-questions";

const DATA_VERSION_KEY = "conversationStartersDataVersion";
const STATE_KEY = "language101-conversation-starters-state-v2";
const FAVORITES_KEY = "language101-conversation-starters-favorites-v2";
const RECENT_LIMIT = 30;

type AnswerStyle = "everyone" | "one" | "pair";
type SavedState = {
  currentId: string;
  history: string[];
  historyIndex: number;
  recentIds: string[];
  category: string;
  difficulty: "" | ConversationStarterDifficulty;
  answerStyle: AnswerStyle;
  favoritesOnly: boolean;
};

const initialState: SavedState = {
  currentId: conversationStarters[0].id,
  history: [conversationStarters[0].id],
  historyIndex: 0,
  recentIds: [conversationStarters[0].id],
  category: "",
  difficulty: "",
  answerStyle: "everyone",
  favoritesOnly: false,
};

function readJson<T>(key: string, fallback: T): T {
  try {
    return JSON.parse(localStorage.getItem(key) ?? "") as T;
  } catch {
    return fallback;
  }
}

function validIds(ids: unknown): string[] {
  if (!Array.isArray(ids)) return [];
  const available = new Set(conversationStarters.map(item => item.id));
  return ids.filter((id): id is string => typeof id === "string" && available.has(id));
}

export function IceBreakingPractice() {
  const [state, setState] = useState<SavedState>(initialState);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFollowUps, setShowFollowUps] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const shuffleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(DATA_VERSION_KEY, "2");
      const saved = readJson<Partial<SavedState>>(STATE_KEY, {});
      const history = validIds(saved.history);
      const recentIds = validIds(saved.recentIds).slice(-RECENT_LIMIT);
      const currentId = typeof saved.currentId === "string" &&
        conversationStarters.some(item => item.id === saved.currentId)
        ? saved.currentId
        : conversationStarters[0].id;
      setState({
        ...initialState,
        ...saved,
        currentId,
        history: history.length ? history : [currentId],
        historyIndex: Math.min(Math.max(saved.historyIndex ?? 0, 0), Math.max(history.length - 1, 0)),
        recentIds: recentIds.length ? recentIds : [currentId],
      });
      setFavorites(validIds(readJson<unknown>(FAVORITES_KEY, [])));
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => () => {
    if (shuffleTimer.current) clearTimeout(shuffleTimer.current);
  }, []);

  const filtered = useMemo(() => conversationStarters.filter(item =>
    (!state.category || item.category === state.category) &&
    (!state.difficulty || item.difficulty === state.difficulty) &&
    (!state.favoritesOnly || favorites.includes(item.id))
  ), [state.category, state.difficulty, state.favoritesOnly, favorites]);

  const current = filtered.find(item => item.id === state.currentId) ?? filtered[0];

  const showQuestion = useCallback((id: string, addToHistory = true) => {
    if (!conversationStarters.some(item => item.id === id)) return;
    setShowFollowUps(false);
    setState(previous => {
      const history = addToHistory
        ? [...previous.history.slice(0, previous.historyIndex + 1), id]
        : previous.history;
      return {
        ...previous,
        currentId: id,
        history,
        historyIndex: addToHistory ? history.length - 1 : previous.historyIndex,
        recentIds: [...previous.recentIds.filter(recentId => recentId !== id), id].slice(-RECENT_LIMIT),
      };
    });
  }, []);

  const previous = useCallback(() => {
    if (state.historyIndex <= 0) return;
    const nextIndex = state.historyIndex - 1;
    const id = state.history[nextIndex];
    setShowFollowUps(false);
    setState(previousState => ({ ...previousState, currentId: id, historyIndex: nextIndex }));
  }, [state.history, state.historyIndex]);

  const next = useCallback(() => {
    if (!current || filtered.length === 0) return;
    const currentIndex = filtered.findIndex(item => item.id === current.id);
    showQuestion(filtered[(currentIndex + 1) % filtered.length].id);
  }, [current, filtered, showQuestion]);

  const shuffle = useCallback(() => {
    if (isShuffling || filtered.length === 0) return;
    setIsShuffling(true);
    const recent = new Set(state.recentIds.slice(-RECENT_LIMIT));
    let pool = filtered.filter(item => item.id !== current?.id && !recent.has(item.id));
    if (pool.length === 0) pool = filtered.filter(item => item.id !== current?.id);
    if (pool.length === 0) pool = filtered;
    const selected = pool[Math.floor(Math.random() * pool.length)];
    shuffleTimer.current = setTimeout(() => {
      showQuestion(selected.id);
      setIsShuffling(false);
    }, 700);
  }, [current?.id, filtered, isShuffling, showQuestion, state.recentIds]);

  function updateFilter(patch: Partial<SavedState>) {
    setShowFollowUps(false);
    setState(previous => ({ ...previous, ...patch }));
  }

  function toggleFavorite() {
    if (!current) return;
    const nextFavorites = favorites.includes(current.id)
      ? favorites.filter(id => id !== current.id)
      : [...favorites, current.id];
    setFavorites(nextFavorites);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(nextFavorites));
    window.dispatchEvent(new CustomEvent("language101-study-change"));
  }

  const position = current ? filtered.findIndex(item => item.id === current.id) + 1 : 0;
  const answerStyleLabels: Record<AnswerStyle, string> = {
    everyone: "Everyone Answers",
    one: "One Person Answers",
    pair: "Pair Discussion",
  };

  return (
    <main className="conversation-starters-page">
      <header className="conversation-starters-header">
        <Link href="/activities/ice-breaking-3" aria-label="Back to activity">
          <ArrowLeft />
        </Link>
        <div>
          <p>Questions That Get People Talking</p>
          <h1>Conversation Starters</h1>
        </div>
        <span>{conversationStarters.length}</span>
      </header>

      <section className="conversation-starters-shell">
        <div className="conversation-category-scroll" aria-label="Question categories">
          <button className={!state.category ? "is-active" : ""} onClick={() => updateFilter({ category: "" })}>
            All <span>{conversationStarters.length}</span>
          </button>
          {conversationStarterCategories.map(category => (
            <button
              key={category}
              className={state.category === category ? "is-active" : ""}
              onClick={() => updateFilter({ category })}
            >
              {category} <span>{conversationStarterCategoryCounts[category]}</span>
            </button>
          ))}
        </div>

        <div className="conversation-filter-row">
          <div aria-label="Difficulty filter">
            {(["", "easy", "medium", "deep"] as const).map(difficulty => (
              <button
                key={difficulty || "all"}
                className={state.difficulty === difficulty ? "is-active" : ""}
                onClick={() => updateFilter({ difficulty })}
              >
                {difficulty ? difficulty[0].toUpperCase() + difficulty.slice(1) : "All Levels"}
              </button>
            ))}
          </div>
          <button
            className={state.favoritesOnly ? "is-active" : ""}
            onClick={() => updateFilter({ favoritesOnly: !state.favoritesOnly })}
          >
            <Heart /> Favorites
          </button>
        </div>

        <div className="conversation-answer-style" aria-label="Answer style">
          {(Object.keys(answerStyleLabels) as AnswerStyle[]).map(style => (
            <button
              key={style}
              className={state.answerStyle === style ? "is-active" : ""}
              onClick={() => updateFilter({ answerStyle: style })}
            >
              {style === "everyone" ? <UsersRound /> : <MessageCircleMore />}
              {answerStyleLabels[style]}
            </button>
          ))}
        </div>

        {state.difficulty === "deep" && (
          <p className="conversation-deep-note">
            Deep questions can feel personal. Anyone may skip a question without explaining why.
          </p>
        )}

        {current ? (
          <>
            <article className={`conversation-question-card${isShuffling ? " is-shuffling" : ""}`}>
              <div>
                <span>{position} / {filtered.length}</span>
                <span>{current.category}</span>
                <span>{current.difficulty}</span>
              </div>
              <p>{answerStyleLabels[state.answerStyle]}</p>
              <h2>{isShuffling ? "Finding a great question..." : current.question}</h2>
              <button
                className={favorites.includes(current.id) ? "is-active" : ""}
                onClick={toggleFavorite}
                aria-label={favorites.includes(current.id) ? "Remove from favorites" : "Add to favorites"}
                aria-pressed={favorites.includes(current.id)}
              >
                <Heart />
              </button>
            </article>

            <button className="conversation-follow-toggle" onClick={() => setShowFollowUps(value => !value)}>
              {showFollowUps ? "Hide Follow-up Questions" : "Show Follow-up Questions"}
            </button>
            {showFollowUps && (
              <div className="conversation-followups">
                {current.followUps.map((question, index) => (
                  <p key={question}><span>{index + 1}</span>{question}</p>
                ))}
              </div>
            )}

            <div className="conversation-primary-actions">
              <button onClick={previous} disabled={state.historyIndex <= 0}>
                <ChevronLeft /> Previous
              </button>
              <button onClick={shuffle} disabled={isShuffling}>
                <Shuffle /> {isShuffling ? "Shuffling..." : "Shuffle"}
              </button>
              <button onClick={next}>
                Next <ChevronRight />
              </button>
            </div>
          </>
        ) : (
          <div className="conversation-empty">
            <Heart />
            <h2>No questions match these filters.</h2>
            <p>Try another category or add questions to your favorites.</p>
            <button onClick={() => updateFilter({ category: "", difficulty: "", favoritesOnly: false })}>
              Reset Filters
            </button>
          </div>
        )}

        <button className="conversation-history-toggle" onClick={() => setShowHistory(value => !value)}>
          <History /> Recent History ({state.recentIds.length})
        </button>
        {showHistory && (
          <div className="conversation-history">
            {[...state.recentIds].reverse().map(id => {
              const item = conversationStarters.find(question => question.id === id);
              return item ? (
                <button key={id} onClick={() => showQuestion(id)}>
                  <span>{item.category}</span>{item.question}
                </button>
              ) : null;
            })}
          </div>
        )}
      </section>
    </main>
  );
}
