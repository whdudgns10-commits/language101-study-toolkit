"use client";
import { useCallback, useEffect, useState } from "react";
import { STUDY_EVENT } from "@/lib/study-storage";

export function useStudyProfileRefresh() {
  const [, setVersion] = useState(0);
  const refresh = useCallback(() => setVersion((value) => value + 1), []);
  useEffect(() => { window.addEventListener(STUDY_EVENT, refresh); window.addEventListener("storage", refresh); return () => { window.removeEventListener(STUDY_EVENT, refresh); window.removeEventListener("storage", refresh); }; }, [refresh]);
  return refresh;
}
