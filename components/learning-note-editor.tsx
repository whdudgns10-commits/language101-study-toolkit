"use client";

import Link from "next/link";
import { Check, NotebookPen } from "lucide-react";
import { useEffect, useState } from "react";
import { getNotes, saveNote, todayKey } from "@/lib/storage";

export function LearningNoteEditor({ activityId, activityTitle }: { activityId: string; activityTitle: string }) {
  const [learned, setLearned] = useState(""); const [corrected, setCorrected] = useState(""); const [nextTime, setNextTime] = useState(""); const [saved, setSaved] = useState(false);
  const noteId = `${todayKey()}-${activityId}`;
  useEffect(() => { const timer = setTimeout(() => { const note = getNotes().find((item) => item.id === noteId); if (note) { setLearned(note.learned); setCorrected(note.corrected); setNextTime(note.nextTime); } }, 0); return () => clearTimeout(timer); }, [noteId]);
  function submit() { if (![learned, corrected, nextTime].some((value) => value.trim())) return; saveNote({ id:noteId,date:todayKey(),activityId,activityTitle,learned,corrected,nextTime,createdAt:new Date().toISOString() }); setSaved(true); setTimeout(() => setSaved(false), 1400); }
  return <section className="note-editor"><div className="note-editor-head"><div><span className="eyebrow">My learning note</span><h2><NotebookPen /> 학습 메모</h2></div><Link href="/notes">전체 메모 보기</Link></div><div className="note-fields"><label>오늘 새로 배운 표현<textarea value={learned} onChange={(e) => setLearned(e.target.value)} placeholder="예: Fair enough — 일리 있네" /></label><label>수정받은 문장<textarea value={corrected} onChange={(e) => setCorrected(e.target.value)} placeholder="수정 전·후 문장을 기록하세요" /></label><label>다음에 써보고 싶은 표현<textarea value={nextTime} onChange={(e) => setNextTime(e.target.value)} placeholder="다음 대화에서 사용할 표현" /></label></div><button className="button button-primary" onClick={submit}>{saved && <Check />}{saved ? "저장됨" : "메모 저장"}</button></section>;
}
