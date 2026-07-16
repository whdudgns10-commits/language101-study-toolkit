"use client";

import Link from "next/link";
import { Home, Search, UserRound } from "lucide-react";

export function SiteHeader({ onSearch, showSearch = true }: { onSearch?: () => void; showSearch?: boolean }) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="logo" aria-label="Language101 Study Toolkit home">
          <span className="logo-mark">L1</span>
          <span>Language101 <b>Toolkit</b></span>
        </Link>
        <nav className="header-actions" aria-label="Quick navigation">
          {showSearch && <button className="icon-button" onClick={onSearch} aria-label="Search activities"><Search size={20} /></button>}
          <Link className="my-study-desktop-link" href="/my-study" aria-label="My Study"><UserRound size={20} /><span>My Study</span></Link>
          <Link className="icon-button" href="/" aria-label="Go home"><Home size={20} /></Link>
        </nav>
      </div>
    </header>
  );
}
