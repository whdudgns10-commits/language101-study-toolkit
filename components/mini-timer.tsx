"use client";

import { ChevronDown, RotateCcw, Timer } from "lucide-react";
import { useEffect, useState } from "react";

const options = [30, 60, 120, 300];

export function MiniTimer() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(60);
  const [remaining, setRemaining] = useState(60);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running || remaining <= 0) return;
    const timer = window.setInterval(() => setRemaining((value) => {
      if (value <= 1) {
        setRunning(false);
        return 0;
      }
      return value - 1;
    }), 1000);
    return () => window.clearInterval(timer);
  }, [running, remaining]);

  const display = `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, "0")}`;

  function choose(seconds: number) { setSelected(seconds); setRemaining(seconds); setRunning(true); }
  function reset() { setRemaining(selected); setRunning(false); }

  return <aside className={open ? "mini-timer is-open" : "mini-timer"} aria-label="Optional activity timer">
    <button className="timer-toggle" onClick={() => setOpen((value) => !value)} aria-expanded={open}><Timer /><span>{open ? display : "Timer"}</span><ChevronDown /></button>
    {open && <div className="timer-body"><div className={remaining === 0 ? "timer-display is-done" : "timer-display"}>{remaining === 0 ? "Time!" : display}</div><div className="timer-options">{options.map((seconds) => <button className={selected === seconds ? "is-active" : ""} key={seconds} onClick={() => choose(seconds)}>{seconds < 60 ? `${seconds}s` : `${seconds / 60}m`}</button>)}</div><div className="timer-actions"><button onClick={() => setRunning((value) => !value)}>{running ? "Pause" : remaining === selected ? "Start" : "Resume"}</button><button onClick={reset}><RotateCcw size={16} /> Reset</button></div></div>}
  </aside>;
}
