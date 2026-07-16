"use client";

import Link from "next/link";
import { Check, NotebookPen } from "lucide-react";
import { useEffect, useState } from "react";
import { getNotes, saveNote, todayKey } from "@/lib/storage";
import { useLanguage } from "@/hooks/use-language";

export function LearningNoteEditor({ activityId, activityTitle }: { activityId: string; activityTitle: string }) {
  const {language,t}=useLanguage();const copy={en:["Learning Notes","View all notes","New expression learned today","Corrected sentence","Expression to use next time","Save note","Saved"],ko:["학습 메모","전체 메모 보기","오늘 새로 배운 표현","수정받은 문장","다음에 써보고 싶은 표현","메모 저장","저장됨"],zh:["学习笔记","查看所有笔记","今天新学的表达","修改后的句子","下次想使用的表达","保存笔记","已保存"],ja:["学習メモ","すべてのメモを見る","今日学んだ表現","添削された文","次回使いたい表現","メモを保存","保存済み"]}[language];
  const [learned, setLearned] = useState(""); const [corrected, setCorrected] = useState(""); const [nextTime, setNextTime] = useState(""); const [saved, setSaved] = useState(false);
  const noteId = `${todayKey()}-${activityId}`;
  useEffect(() => { const timer = setTimeout(() => { const note = getNotes().find((item) => item.id === noteId); if (note) { setLearned(note.learned); setCorrected(note.corrected); setNextTime(note.nextTime); } }, 0); return () => clearTimeout(timer); }, [noteId]);
  function submit() { if (![learned, corrected, nextTime].some((value) => value.trim())) return; saveNote({ id:noteId,date:todayKey(),activityId,activityTitle,learned,corrected,nextTime,createdAt:new Date().toISOString() }); setSaved(true); setTimeout(() => setSaved(false), 1400); }
  return <section className="note-editor"><div className="note-editor-head"><div><span className="eyebrow">My Study</span><h2><NotebookPen />{copy[0]}</h2></div><Link href="/notes">{copy[1]}</Link></div><div className="note-fields"><label>{copy[2]}<textarea value={learned} onChange={(e) => setLearned(e.target.value)} placeholder={t("common.memo")}/></label><label>{copy[3]}<textarea value={corrected} onChange={(e) => setCorrected(e.target.value)} placeholder={t("common.memo")}/></label><label>{copy[4]}<textarea value={nextTime} onChange={(e) => setNextTime(e.target.value)} placeholder={t("common.memo")}/></label></div><button className="button button-primary" onClick={submit}>{saved&&<Check/>}{saved?copy[6]:copy[5]}</button></section>;
}
