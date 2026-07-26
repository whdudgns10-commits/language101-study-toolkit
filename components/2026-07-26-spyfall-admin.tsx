"use client";

import Link from "next/link";
import { ArrowDown, ArrowLeft, ArrowUp, Pencil, Plus, RotateCcw, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  spyfallLocationCategories,
  type SpyfallLocation,
  type SpyfallLocationCategory,
  type SpyfallQuestion,
} from "@/data/2026-07-26-spyfall";
import {
  createDefaultSpyfallSettings,
  loadSpyfallSettings,
  saveSpyfallSettings,
  type SpyfallSettings,
} from "@/lib/2026-07-26-spyfall-storage";

const emptyLocation: Omit<SpyfallLocation, "id"> = {
  nameKo: "",
  nameEn: "",
  category: "여가",
  active: true,
};

const emptyQuestion: Omit<SpyfallQuestion, "id"> = {
  questionKo: "",
  questionEn: "",
  active: true,
};

export function SpyfallAdmin() {
  const [settings, setSettings] = useState<SpyfallSettings | null>(null);
  const [locationDraft, setLocationDraft] = useState(emptyLocation);
  const [locationEditId, setLocationEditId] = useState<string | null>(null);
  const [questionDraft, setQuestionDraft] = useState(emptyQuestion);
  const [questionEditId, setQuestionEditId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setSettings(loadSpyfallSettings()));
  }, []);

  function persist(next: SpyfallSettings) {
    setSettings(next);
    saveSpyfallSettings(next);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1200);
  }

  function submitLocation() {
    if (!settings || !locationDraft.nameKo.trim() || !locationDraft.nameEn.trim()) return;
    const locations = locationEditId
      ? settings.locations.map((item) => item.id === locationEditId ? { ...item, ...locationDraft } : item)
      : [...settings.locations, { ...locationDraft, id: `spyfall-location-custom-${Date.now()}` }];
    persist({ ...settings, locations });
    setLocationDraft(emptyLocation);
    setLocationEditId(null);
  }

  function editLocation(location: SpyfallLocation) {
    setLocationEditId(location.id);
    setLocationDraft({
      nameKo: location.nameKo,
      nameEn: location.nameEn,
      category: location.category,
      active: location.active,
    });
  }

  function submitQuestion() {
    if (!settings || !questionDraft.questionKo.trim() || !questionDraft.questionEn.trim()) return;
    const questions = questionEditId
      ? settings.questions.map((item) => item.id === questionEditId ? { ...item, ...questionDraft } : item)
      : [...settings.questions, { ...questionDraft, id: `spyfall-question-custom-${Date.now()}` }];
    persist({ ...settings, questions });
    setQuestionDraft(emptyQuestion);
    setQuestionEditId(null);
  }

  function editQuestion(question: SpyfallQuestion) {
    setQuestionEditId(question.id);
    setQuestionDraft({
      questionKo: question.questionKo,
      questionEn: question.questionEn,
      active: question.active,
    });
  }

  function restoreDefaults() {
    if (!window.confirm("장소, 질문, 시간, 스파이 수 설정을 초기 데이터로 복원할까요?")) return;
    persist(createDefaultSpyfallSettings());
    setLocationDraft(emptyLocation);
    setQuestionDraft(emptyQuestion);
    setLocationEditId(null);
    setQuestionEditId(null);
  }

  function moveItem<T>(items: T[], index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return items;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    return next;
  }

  if (!settings) return <main className="spyfall-admin"><p>Loading…</p></main>;

  return <main className="spyfall-admin">
    <header>
      <Link href="/activities/spyfall/practice"><ArrowLeft/> Find the Spy</Link>
      <div><h1>Find the Spy Admin</h1><p>장소, 질문, 타이머와 스파이 수를 관리합니다.</p></div>
      {saved && <span>저장됨</span>}
    </header>

    <section className="spyfall-admin-card">
      <h2>게임 기본 설정</h2>
      <label>기본 게임 시간
        <select value={settings.defaultMinutes} onChange={(event) => persist({ ...settings, defaultMinutes: Number(event.target.value) as 5 | 8 | 10 })}>
          <option value={5}>5분</option><option value={8}>8분</option><option value={10}>10분</option>
        </select>
      </label>
      <div className="spyfall-spy-settings">
        {Array.from({ length: 9 }, (_, index) => index + 4).map((players) => <label key={players}>{players}명
          <select value={settings.spyCounts[players]} onChange={(event) => persist({ ...settings, spyCounts: { ...settings.spyCounts, [players]: Number(event.target.value) } })}>
            {Array.from({ length: Math.min(3, players - 1) }, (_, index) => index + 1).map((count) => <option key={count} value={count}>{count}명</option>)}
          </select>
        </label>)}
      </div>
    </section>

    <section className="spyfall-admin-card">
      <div className="spyfall-admin-title"><div><h2>장소 목록</h2><p>{settings.locations.length}개 · 활성 {settings.locations.filter((item) => item.active).length}개</p></div><Plus/></div>
      <div className="spyfall-admin-form">
        <input aria-label="한국어 장소명" placeholder="한국어 장소명" value={locationDraft.nameKo} onChange={(event) => setLocationDraft({ ...locationDraft, nameKo: event.target.value })}/>
        <input aria-label="English location" placeholder="English location" value={locationDraft.nameEn} onChange={(event) => setLocationDraft({ ...locationDraft, nameEn: event.target.value })}/>
        <select aria-label="카테고리" value={locationDraft.category} onChange={(event) => setLocationDraft({ ...locationDraft, category: event.target.value as SpyfallLocationCategory })}>
          {spyfallLocationCategories.map((category) => <option key={category}>{category}</option>)}
        </select>
        <button className="button button-primary" onClick={submitLocation}><Save/>{locationEditId ? "수정 저장" : "장소 추가"}</button>
      </div>
      <div className="spyfall-admin-list">
        {settings.locations.map((location, index) => <article key={location.id} className={!location.active ? "is-disabled" : ""}>
          <button className="spyfall-toggle" aria-label={`${location.nameKo} 활성화`} aria-pressed={location.active} onClick={() => persist({ ...settings, locations: settings.locations.map((item) => item.id === location.id ? { ...item, active: !item.active } : item) })}><i/></button>
          <div><b>{location.nameKo}</b><span>{location.nameEn} · {location.category}</span></div>
          <button aria-label={`${location.nameKo} 수정`} onClick={() => editLocation(location)}><Pencil/></button>
          <button aria-label={`${location.nameKo} 삭제`} onClick={() => persist({ ...settings, locations: settings.locations.filter((item) => item.id !== location.id) })}><Trash2/></button>
          <div className="spyfall-order-buttons"><button aria-label={`${location.nameKo} 위로`} disabled={index === 0} onClick={() => persist({ ...settings, locations: moveItem(settings.locations, index, -1) })}><ArrowUp/></button><button aria-label={`${location.nameKo} 아래로`} disabled={index === settings.locations.length - 1} onClick={() => persist({ ...settings, locations: moveItem(settings.locations, index, 1) })}><ArrowDown/></button></div>
        </article>)}
      </div>
    </section>

    <section className="spyfall-admin-card">
      <div className="spyfall-admin-title"><div><h2>질문 예시</h2><p>{settings.questions.length}개</p></div><Plus/></div>
      <div className="spyfall-admin-form">
        <input aria-label="한국어 질문" placeholder="한국어 질문" value={questionDraft.questionKo} onChange={(event) => setQuestionDraft({ ...questionDraft, questionKo: event.target.value })}/>
        <input aria-label="English question" placeholder="English question" value={questionDraft.questionEn} onChange={(event) => setQuestionDraft({ ...questionDraft, questionEn: event.target.value })}/>
        <button className="button button-primary" onClick={submitQuestion}><Save/>{questionEditId ? "수정 저장" : "질문 추가"}</button>
      </div>
      <div className="spyfall-admin-list">
        {settings.questions.map((question, index) => <article key={question.id} className={!question.active ? "is-disabled" : ""}>
          <button className="spyfall-toggle" aria-label={`${question.questionKo} 활성화`} aria-pressed={question.active} onClick={() => persist({ ...settings, questions: settings.questions.map((item) => item.id === question.id ? { ...item, active: !item.active } : item) })}><i/></button>
          <div><b>{question.questionKo}</b><span>{question.questionEn}</span></div>
          <button aria-label="질문 수정" onClick={() => editQuestion(question)}><Pencil/></button>
          <button aria-label="질문 삭제" onClick={() => persist({ ...settings, questions: settings.questions.filter((item) => item.id !== question.id) })}><Trash2/></button>
          <div className="spyfall-order-buttons"><button aria-label="질문 위로" disabled={index === 0} onClick={() => persist({ ...settings, questions: moveItem(settings.questions, index, -1) })}><ArrowUp/></button><button aria-label="질문 아래로" disabled={index === settings.questions.length - 1} onClick={() => persist({ ...settings, questions: moveItem(settings.questions, index, 1) })}><ArrowDown/></button></div>
        </article>)}
      </div>
    </section>

    <button className="button spyfall-restore" onClick={restoreDefaults}><RotateCcw/>초기 데이터로 복원</button>
  </main>;
}
