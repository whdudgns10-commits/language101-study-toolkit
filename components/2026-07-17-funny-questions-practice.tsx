"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  History,
  MessageCircleMore,
  Save,
  Shuffle,
  UsersRound,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FUNNY_CATEGORY_META,
  funnyQuestionCategoryCounts,
  funnyQuestions,
} from "@/data/2026-07-17-funny-questions";
import {
  migrateFunnyQuestionStorage,
  readFunnyFavorites,
  readFunnyState,
  saveFunnySession,
  saveFunnyState,
  toggleFunnyFavorite,
  type FunnyPracticeState,
} from "@/lib/2026-07-17-funny-questions-storage";

const RECENT_LIMIT = 30;
const validIds = new Set(funnyQuestions.map(question => question.id));
const initialState: FunnyPracticeState = {
  currentId: funnyQuestions[0].id,
  history: [funnyQuestions[0].id],
  historyIndex: 0,
  recentIds: [funnyQuestions[0].id],
  category: "all",
  level: "all",
  answerStyle: "everyone",
  favoritesOnly: false,
};

const answerStyles = {
  everyone: {
    label: "Everyone Answers",
    description: "Everyone answers the same question one by one.",
  },
  one: {
    label: "One Person Answers",
    description: "One person answers, and the group asks follow-up questions.",
  },
  pair: {
    label: "Pair Discussion",
    description: "Discuss the question in pairs before sharing with the group.",
  },
  vote: {
    label: "Vote First, Explain After",
    description: "Choose your personal answer silently, reveal together, then explain.",
  },
} as const;

function cleanIds(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((id): id is string => typeof id === "string" && validIds.has(id))
    : [];
}

export function FunnyQuestionsPractice() {
  const [state, setState] = useState<FunnyPracticeState>(initialState);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFollowUps, setShowFollowUps] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [memo, setMemo] = useState("");
  const [saved, setSaved] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const shuffleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      migrateFunnyQuestionStorage(validIds);
      const stored = readFunnyState(initialState);
      const history = cleanIds(stored.history);
      const recentIds = cleanIds(stored.recentIds).slice(-RECENT_LIMIT);
      const currentId = validIds.has(stored.currentId) ? stored.currentId : funnyQuestions[0].id;
      setState({
        ...initialState,
        ...stored,
        currentId,
        history: history.length ? history : [currentId],
        historyIndex: Math.min(Math.max(stored.historyIndex || 0, 0), Math.max(history.length - 1, 0)),
        recentIds: recentIds.length ? recentIds : [currentId],
      });
      setFavorites(readFunnyFavorites(validIds).map(item => item.questionId));
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    saveFunnyState(state);
  }, [state]);

  useEffect(() => () => {
    if (shuffleTimer.current) clearTimeout(shuffleTimer.current);
  }, []);

  const filtered = useMemo(() => funnyQuestions.filter(question =>
    (state.category === "all" || question.category === state.category) &&
    (state.level === "all" || question.level === state.level) &&
    (!state.favoritesOnly || favorites.includes(question.id))
  ), [state.category, state.level, state.favoritesOnly, favorites]);

  const current = filtered.find(question => question.id === state.currentId) ?? filtered[0];

  const showQuestion = useCallback((id: string, addToHistory = true) => {
    if (!validIds.has(id)) return;
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

  const previousQuestion = useCallback(() => {
    if (state.historyIndex <= 0) return;
    const historyIndex = state.historyIndex - 1;
    setShowFollowUps(false);
    setState(previous => ({
      ...previous,
      currentId: previous.history[historyIndex],
      historyIndex,
    }));
  }, [state.historyIndex]);

  const nextQuestion = useCallback(() => {
    if (!current || filtered.length === 0) return;
    const index = filtered.findIndex(question => question.id === current.id);
    showQuestion(filtered[(index + 1) % filtered.length].id);
  }, [current, filtered, showQuestion]);

  const shuffleQuestion = useCallback(() => {
    if (isShuffling || filtered.length === 0) return;
    setIsShuffling(true);
    const recent = new Set(state.recentIds.slice(-RECENT_LIMIT));
    let pool = filtered.filter(question => question.id !== current?.id && !recent.has(question.id));
    if (pool.length === 0) pool = filtered.filter(question => question.id !== current?.id);
    if (pool.length === 0) pool = filtered;
    const selected = pool[Math.floor(Math.random() * pool.length)];
    shuffleTimer.current = setTimeout(() => {
      showQuestion(selected.id);
      setIsShuffling(false);
    }, 700);
  }, [current?.id, filtered, isShuffling, showQuestion, state.recentIds]);

  function updateFilters(patch: Partial<FunnyPracticeState>) {
    setShowFollowUps(false);
    setState(previous => ({ ...previous, ...patch }));
  }

  function favoriteQuestion() {
    if (!current) return;
    setFavorites(toggleFunnyFavorite(current).map(item => item.questionId));
  }

  function saveSession() {
    const now = new Date();
    saveFunnySession({
      id: `funny-session-${now.getTime()}`,
      activity: "funny-questions",
      date: now.toLocaleDateString("en-CA"),
      viewedCount: state.recentIds.length,
      answeredQuestionIds: state.recentIds,
      categories: [...new Set(state.recentIds.flatMap(id => {
        const category = funnyQuestions.find(question => question.id === id)?.category;
        return category ? [category] : [];
      }))],
      favoriteQuestionIds: favorites,
      memo,
      createdAt: now.toISOString(),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 1400);
  }

  const answerStyle = answerStyles[state.answerStyle];
  const position = current ? filtered.findIndex(question => question.id === current.id) + 1 : 0;
  const categoryLabel = current
    ? FUNNY_CATEGORY_META.find(category => category.id === current.category)?.label
    : "";

  return (
    <main className="funny-v2-page">
      <header className="funny-v2-header">
        <Link href="/activities/funny-questions" aria-label="Back to Funny Questions"><ArrowLeft /></Link>
        <div>
          <p>Unexpected Questions, Better Conversations</p>
          <h1>Funny Questions</h1>
        </div>
        <span>{funnyQuestions.length}</span>
      </header>

      <section className="funny-v2-shell">
        <div className="funny-v2-categories" role="listbox" aria-label="Question category">
          <button
            role="option"
            aria-selected={state.category === "all"}
            className={state.category === "all" ? "is-active" : ""}
            onClick={() => updateFilters({ category: "all" })}
          >
            {state.category === "all" && <Check />} All <span>{funnyQuestions.length}</span>
          </button>
          {FUNNY_CATEGORY_META.map(category => (
            <button
              key={category.id}
              role="option"
              aria-selected={state.category === category.id}
              className={state.category === category.id ? "is-active" : ""}
              onClick={() => updateFilters({ category: category.id })}
            >
              {state.category === category.id && <Check />}
              {category.label} <span>{funnyQuestionCategoryCounts[category.id]}</span>
            </button>
          ))}
        </div>

        <div className="funny-v2-levels" role="listbox" aria-label="Question level">
          {(["all", "light", "funny", "wild"] as const).map(level => (
            <button
              key={level}
              role="option"
              aria-selected={state.level === level}
              className={state.level === level ? "is-active" : ""}
              onClick={() => updateFilters({ level })}
            >
              {state.level === level && <Check />}
              {level === "all" ? "All Levels" : level[0].toUpperCase() + level.slice(1)}
            </button>
          ))}
          <button
            aria-pressed={state.favoritesOnly}
            className={state.favoritesOnly ? "is-active" : ""}
            onClick={() => updateFilters({ favoritesOnly: !state.favoritesOnly })}
          >
            <Heart /> Favorites
          </button>
        </div>

        <div className="funny-v2-answer-styles" aria-label="Answer Style">
          {(Object.entries(answerStyles) as [FunnyPracticeState["answerStyle"], typeof answerStyles[keyof typeof answerStyles]][]).map(([id, option]) => (
            <button
              key={id}
              aria-pressed={state.answerStyle === id}
              className={state.answerStyle === id ? "is-active" : ""}
              onClick={() => updateFilters({ answerStyle: id })}
            >
              {id === "everyone" ? <UsersRound /> : <MessageCircleMore />}
              <span><b>{option.label}</b><small>{option.description}</small></span>
            </button>
          ))}
        </div>

        {current ? (
          <>
            <article className={`funny-v2-card${isShuffling ? " is-shuffling" : ""}`}>
              <div className="funny-v2-card-meta">
                <span>{position} / {filtered.length}</span>
                <span>{categoryLabel}</span>
                <span>{current.level}</span>
              </div>
              <p>{answerStyle.label}</p>
              <h2>{isShuffling ? "Finding an unexpected question..." : current.question}</h2>
              <button
                aria-label={favorites.includes(current.id) ? "Remove from favorites" : "Add to favorites"}
                aria-pressed={favorites.includes(current.id)}
                className={favorites.includes(current.id) ? "is-active" : ""}
                onClick={favoriteQuestion}
              >
                <Heart />
              </button>
            </article>

            <button className="funny-v2-follow-toggle" onClick={() => setShowFollowUps(value => !value)}>
              {showFollowUps ? "Hide Follow-up Questions" : "Show Follow-up Questions"}
            </button>
            {showFollowUps && (
              <div className="funny-v2-followups">
                {current.followUps.map((followUp, index) => (
                  <p key={followUp}><span>{index + 1}</span>{followUp}</p>
                ))}
              </div>
            )}

            <div className="funny-v2-actions">
              <button disabled={state.historyIndex <= 0} onClick={previousQuestion}>
                <ChevronLeft /> <span>Previous Question</span>
              </button>
              <button disabled={isShuffling} onClick={shuffleQuestion}>
                <Shuffle /> <span>{isShuffling ? "Shuffling..." : "Shuffle"}</span>
              </button>
              <button onClick={nextQuestion}>
                <span>Next Question</span> <ChevronRight />
              </button>
            </div>
          </>
        ) : (
          <div className="funny-v2-empty">
            <Heart />
            <h2>No questions match these filters.</h2>
            <p>Try another category or add questions to your favorites.</p>
            <button onClick={() => updateFilters({ category: "all", level: "all", favoritesOnly: false })}>
              Reset Filters
            </button>
          </div>
        )}

        <button className="funny-v2-history-toggle" onClick={() => setShowHistory(value => !value)}>
          <History /> Recent History ({state.recentIds.length})
        </button>
        {showHistory && (
          <div className="funny-v2-history">
            {[...state.recentIds].reverse().map(id => {
              const question = funnyQuestions.find(item => item.id === id);
              return question ? (
                <button key={id} onClick={() => showQuestion(id)}>
                  <span>{FUNNY_CATEGORY_META.find(category => category.id === question.category)?.label}</span>
                  {question.question}
                </button>
              ) : null;
            })}
          </div>
        )}

        <section className="funny-v2-save">
          <label>
            Session memo
            <textarea value={memo} onChange={event => setMemo(event.target.value)} placeholder="What made the group laugh?" />
          </label>
          <button onClick={saveSession}><Save />{saved ? "Saved to My Study" : "Save to My Study"}</button>
        </section>
      </section>
    </main>
  );
}
