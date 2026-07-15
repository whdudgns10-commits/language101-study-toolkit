"use client";

import { ArrowLeft, Check, Copy, Expand, RefreshCw, Sparkles, X } from "lucide-react";
import { useMemo, useState } from "react";
import { conversationTopics, topicCategories, type ConversationTopic, type TopicCategory } from "@/data/conversation-topics";

export function ConversationGenerator() {
  const [category, setCategory] = useState<TopicCategory>("일상");
  const [current, setCurrent] = useState<ConversationTopic | null>(null);
  const [history, setHistory] = useState<ConversationTopic[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [fullscreen, setFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const pool = useMemo(() => conversationTopics.filter((item) => item.category === category), [category]);
  function draw() { const recent = new Set(history.slice(-5).map((item) => item.id)); const available = pool.filter((item) => !recent.has(item.id)); const source = available.length ? available : pool; const next = source[Math.floor(Math.random() * source.length)]; const nextHistory = [...history.slice(0, historyIndex + 1), next]; setCurrent(next); setHistory(nextHistory); setHistoryIndex(nextHistory.length - 1); }
  function selectCategory(value: TopicCategory) { setCategory(value); setCurrent(null); setHistory([]); setHistoryIndex(-1); }
  function previous() { if (historyIndex <= 0) return; const index = historyIndex - 1; setHistoryIndex(index); setCurrent(history[index]); }
  async function copy() { if (!current) return; await navigator.clipboard.writeText(`${current.question}\n${current.questionKo}`); setCopied(true); setTimeout(() => setCopied(false), 1200); }
  const question = current && <><span className="topic-label">{current.category}</span><h3>{current.question}</h3><p>{current.questionKo}</p></>;
  return <section className="section-shell section-block topic-section" aria-labelledby="topic-title"><div className="section-heading"><div><span className="eyebrow">Conversation rescue</span><h2 id="topic-title">대화가 막혔나요?</h2></div><p>카테고리를 고르고 한 번만 눌러 보세요. 다음 대화가 바로 시작됩니다.</p></div>
    <div className="topic-layout"><div className="topic-controls"><b>어떤 이야기를 나눌까요?</b><div className="topic-chips">{topicCategories.map((item) => <button className={category === item ? "chip is-active" : "chip"} key={item} onClick={() => selectCategory(item)}>{item}</button>)}</div><button className="button button-primary topic-draw" onClick={draw}><Sparkles /> 질문 뽑기</button><small>각 카테고리 10개 · 최근 질문 중복 최소화</small></div>
      <div className={current ? "topic-result has-question" : "topic-result"}>{current ? question : <div className="topic-placeholder"><Sparkles /><b>질문을 뽑아 보세요</b><span>영어 질문과 자연스러운 한국어 뜻이 표시됩니다.</span></div>}{current && <div className="topic-actions"><button onClick={previous} disabled={historyIndex <= 0}><ArrowLeft /> 이전 질문</button><button onClick={draw}><RefreshCw /> 다른 질문</button><button onClick={copy}>{copied ? <Check /> : <Copy />} {copied ? "복사됨" : "질문 복사"}</button><button onClick={() => setFullscreen(true)}><Expand /> 크게 보기</button></div>}</div>
    </div>{fullscreen && current && <div className="question-fullscreen" role="dialog" aria-modal="true"><button className="fullscreen-close" onClick={() => setFullscreen(false)} aria-label="전체 화면 닫기"><X /></button><div>{question}<button className="button button-secondary" onClick={draw}><RefreshCw /> 다음 질문</button></div></div>}
  </section>;
}
