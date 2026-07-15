"use client";

import Link from "next/link";
import { ArrowLeft, ScanLine } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";

export function QrView() {
  const [url, setUrl] = useState("https://language101-study-toolkit.vercel.app");
  useEffect(() => {
    const timer = window.setTimeout(() => setUrl(window.location.origin), 0);
    return () => window.clearTimeout(timer);
  }, []);
  return <main className="qr-page"><Link href="/" className="qr-back"><ArrowLeft /> Home</Link><div className="qr-card"><div className="qr-icon"><ScanLine /></div><span className="eyebrow">Language101 Study Toolkit</span><h1>Scan to open today’s<br />study materials.</h1><p>No login. No fixed order. Just pick an activity and start talking.</p><div className="qr-code"><QRCodeSVG value={url} size={256} bgColor="#ffffff" fgColor="#111827" level="H" marginSize={2} /></div><small>{url.replace(/^https?:\/\//, "")}</small></div></main>;
}
