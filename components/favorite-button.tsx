"use client";

import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const KEY = "language101-favorites";

export function readFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}

export function FavoriteButton({ id, label = false, onChange }: { id: string; label?: boolean; onChange?: (value: boolean) => void }) {
  const [active, setActive] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setActive(readFavorites().includes(id)), 0);
    return () => window.clearTimeout(timer);
  }, [id]);

  function toggle() {
    const next = !active;
    const values = new Set(readFavorites());
    if (next) values.add(id);
    else values.delete(id);
    localStorage.setItem(KEY, JSON.stringify([...values]));
    setActive(next);
    onChange?.(next);
  }

  return (
    <button className={cn("favorite-button", active && "is-active", label && "favorite-with-label")} onClick={toggle} aria-label={active ? "Remove from favorites" : "Add to favorites"} aria-pressed={active}>
      <Heart size={label ? 19 : 21} fill={active ? "currentColor" : "none"} />
      {label && <span>{active ? "Saved" : "Favorite"}</span>}
    </button>
  );
}
