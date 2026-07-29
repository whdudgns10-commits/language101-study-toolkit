"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useSecretMissionTimer(initialSeconds: number | null) {
  const [remainingSeconds, setRemainingSeconds] = useState(initialSeconds);
  const [running, setRunning] = useState(false);
  const initialRef = useRef(initialSeconds);
  const intervalRef = useRef<number | null>(null);

  const stopInterval = useCallback(() => {
    if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, []);

  useEffect(() => {
    if (!running) {
      stopInterval();
      return;
    }
    if (intervalRef.current === null) {
      intervalRef.current = window.setInterval(() => {
        setRemainingSeconds((current) => {
          if (current === null || current <= 1) {
            setRunning(false);
            return current === null ? null : 0;
          }
          return current - 1;
        });
      }, 1000);
    }
    return stopInterval;
  }, [running, stopInterval]);

  useEffect(() => stopInterval, [stopInterval]);

  const restore = useCallback((seconds: number | null, nextInitial = seconds) => {
    stopInterval();
    initialRef.current = nextInitial;
    setRemainingSeconds(seconds);
    setRunning(false);
  }, [stopInterval]);

  const reset = useCallback(() => {
    stopInterval();
    setRunning(false);
    setRemainingSeconds(initialRef.current);
    return initialRef.current;
  }, [stopInterval]);

  return {
    remainingSeconds,
    running,
    start: () => setRunning(remainingSeconds === null || remainingSeconds > 0),
    pause: () => setRunning(false),
    toggle: () => setRunning((value) => !value),
    reset,
    restore,
    stop: () => { stopInterval(); setRunning(false); },
  };
}
