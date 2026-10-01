"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Heart,
  Shuffle,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  conversationStarterCategories,
  conversationStarterCategoryCounts,
  conversationStarters,
  type ConversationStarterDifficulty,
} from "@/data/ice-breaking-questions";
import { learningPromptFor,localizedActivityCopy } from "@/data/learning-content/2026-10-01-multilingual-content";
import { useLanguage } from "@/hooks/use-language";

const DATA_VERSION_KEY = "conversationStartersDataVersion";
const STATE_KEY = "language101-conversation-starters-state-v2";
const FAVORITES_KEY = "language101-conversation-starters-favorites-v2";
const RECENT_LIMIT = 30;

type SavedState = {
  currentId: string;
  history: string[];
  historyIndex: number;
  recentIds: string[];
  category: string;
  difficulty: "" | ConversationStarterDifficulty;
  favoritesOnly: boolean;
};

const initialState: SavedState = {
  currentId: conversationStarters[0].id,
  history: [conversationStarters[0].id],
  historyIndex: 0,
  recentIds: [conversationStarters[0].id],
  category: "",
  difficulty: "",
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
  const {language}=useLanguage();
  const copy=localizedActivityCopy[language];
  const [state, setState] = useState<SavedState>(initialState);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const shuffleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(DATA_VERSION_KEY, "3");
      const saved = readJson<Partial<SavedState>>(STATE_KEY, {});
      const history = validIds(saved.history);
      const recentIds = validIds(saved.recentIds).slice(-RECENT_LIMIT);
      const currentId = typeof saved.currentId === "string" &&
        conversationStarters.some(item => item.id === saved.currentId)
        ? saved.currentId
        : conversationStarters[0].id;
      setState({
        currentId,
        history: history.length ? history : [currentId],
        historyIndex: Math.min(Math.max(saved.historyIndex ?? 0, 0), Math.max(history.length - 1, 0)),
        recentIds: recentIds.length ? recentIds : [currentId],
        category: conversationStarterCategories.includes(saved.category as never) ? saved.category ?? "" : "",
        difficulty: ["easy", "medium", "deep"].includes(saved.difficulty ?? "") ? saved.difficulty ?? "" : "",
        favoritesOnly: Boolean(saved.favoritesOnly),
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
  const localizedCurrent=current?learningPromptFor(current.id):null;

  const showQuestion = useCallback((id: string, addToHistory = true) => {
    if (!conversationStarters.some(item => item.id === id)) return;
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
  return (
    <main className="conversation-starters-page">
      <header className="conversation-starters-header">
        <Link href="/activities/ice-breaking-3" aria-label={copy.previous}>
          <ArrowLeft />
        </Link>
        <div>
          <h1>{language==="en"?"Conversation Starters":language==="ja"?"会話のきっかけ":language==="zh"?"对话开场": "대화 시작 질문"}</h1>
        </div>
        <span>{conversationStarters.length}</span>
      </header>

      <section className="conversation-starters-shell">
        <div className="conversation-category-scroll" aria-label="Question categories">
          <button className={!state.category ? "is-active" : ""} onClick={() => updateFilter({ category: "" })}>
            {copy.all} <span>{conversationStarters.length}</span>
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
                {difficulty ? difficulty[0].toUpperCase() + difficulty.slice(1) : copy.allLevels}
              </button>
            ))}
          </div>
          <button
            className={state.favoritesOnly ? "is-active" : ""}
            onClick={() => updateFilter({ favoritesOnly: !state.favoritesOnly })}
          >
            <Heart /> {copy.favorites}
          </button>
        </div>

        {state.difficulty === "deep" && (
          <p className="conversation-deep-note">
            {language==="en"?"Deep questions can feel personal. Anyone may skip a question without explaining why.":language==="ja"?"深い質問は個人的に感じることがあります。理由を言わずにスキップできます。":language==="zh"?"深入问题可能涉及隐私，任何人都可以不说明理由直接跳过。":"깊은 질문은 개인적으로 느껴질 수 있어요. 이유를 말하지 않고 건너뛸 수 있습니다."}
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
              <h2>{isShuffling ? copy.shuffling : localizedCurrent?.prompt[language]||current.question}</h2>
              <button
                className={favorites.includes(current.id) ? "is-active" : ""}
                onClick={toggleFavorite}
                aria-label={favorites.includes(current.id) ? "Remove from favorites" : "Add to favorites"}
                aria-pressed={favorites.includes(current.id)}
              >
                <Heart />
              </button>
              <div className="conversation-card-followups">
                <small>{copy.followUps}</small>
                {(localizedCurrent?.followUps[language]||current.followUps).map((question, index) => (
                  <p key={question}><span>{index + 1}</span>{question}</p>
                ))}
              </div>
            </article>

            <div className="conversation-primary-actions">
              <button onClick={previous} disabled={state.historyIndex <= 0}>
                <ChevronLeft /> {copy.previous}
              </button>
              <button onClick={shuffle} disabled={isShuffling}>
                <Shuffle /> {isShuffling ? copy.shuffling : copy.shuffle}
              </button>
              <button onClick={next}>
                {copy.next} <ChevronRight />
              </button>
            </div>
          </>
        ) : (
          <div className="conversation-empty">
            <Heart />
            <h2>{copy.empty}</h2>
            <p>Try another category or add questions to your favorites.</p>
            <button onClick={() => updateFilter({ category: "", difficulty: "", favoritesOnly: false })}>
              {copy.reset}
            </button>
          </div>
        )}

      </section>
    </main>
  );
}
