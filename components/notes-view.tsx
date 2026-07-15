"use client";

import Link from "next/link";
import { ArrowLeft, Copy, NotebookPen, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { deleteNote, getNotes, type LearningNote } from "@/lib/storage";

const noteText = (note: LearningNote) => `${note.date} · ${note.activityTitle}\n새로 배운 표현: ${note.learned || "-"}\n수정받은 문장: ${note.corrected || "-"}\n다음에 쓸 표현: ${note.nextTime || "-"}`;
export function NotesView() {
  const [notes, setNotes] = useState<LearningNote[]>([]);
  useEffect(() => { const timer = setTimeout(() => setNotes(getNotes()), 0); return () => clearTimeout(timer); }, []);
  const groups = useMemo(() => Object.entries(Object.groupBy(notes, (note) => note.date)).sort(([a],[b]) => b.localeCompare(a)), [notes]);
  function remove(id: string) { deleteNote(id); setNotes(getNotes()); }
  return <main className="notes-page"><div className="notes-shell"><Link href="/" className="back-link"><ArrowLeft /> 홈으로</Link><header><span className="eyebrow">My notes</span><h1>전체 학습 메모</h1><p>모임에서 배운 표현과 수정받은 문장을 날짜별로 모았습니다.</p></header>{groups.length ? groups.map(([date,items]) => <section className="note-date-group" key={date}><h2>{date}</h2><div>{items?.map((note) => <article key={note.id}><div className="note-card-head"><b>{note.activityTitle}</b><span><button onClick={() => navigator.clipboard.writeText(noteText(note))} aria-label="메모 복사"><Copy /></button><button onClick={() => remove(note.id)} aria-label="메모 삭제"><Trash2 /></button></span></div>{note.learned && <p><strong>새로 배운 표현</strong>{note.learned}</p>}{note.corrected && <p><strong>수정받은 문장</strong>{note.corrected}</p>}{note.nextTime && <p><strong>다음에 쓸 표현</strong>{note.nextTime}</p>}</article>)}</div></section>) : <div className="notes-empty"><NotebookPen /><h2>아직 저장한 메모가 없어요</h2><p>활동 상세 화면에서 오늘 배운 내용을 기록해 보세요.</p><Link className="button button-primary" href="/#activities">활동 보러 가기</Link></div>}</div></main>;
}
