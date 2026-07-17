"use client";

import { Check, ExternalLink, LockKeyhole } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { useAccess } from "@/components/access/2026-07-17-access-provider";

const PRACTICE_PATH = /^\/activities\/[a-z0-9-]+\/practice$/;

export function MembershipAccessCard() {
  const { state, authenticate } = useAccess();
  const router = useRouter();
  const searchParams = useSearchParams();
  const requested = searchParams.get("next") || "/activities";
  const destination = PRACTICE_PATH.test(requested) ? requested : "/activities";
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => { if (state === "granted") router.replace(destination); }, [destination, router, state]);
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true); setError("");
    const result = await authenticate(code);
    if (!result.codeValid) setError(result.error === "service-error" ? "Access service is temporarily unavailable" : "Invalid Access Code");
    else if (!result.active) setError("Membership Expired");
    setSubmitting(false);
  }
  return <main className="membership-access-page"><section className="membership-access-card" aria-labelledby="membership-title"><div className="access-lock"><LockKeyhole/></div><span className="access-eyebrow">Members Only</span><h1 id="membership-title">Language101 Members Access</h1><div className="access-description"><p>이 콘텐츠는<br/>Language101 멤버십 이용자만 사용할 수 있습니다.</p><p>언어교환101 멤버십 이용권이<br/>활성화되어 있어야 이용 가능합니다.</p><p>이용권이 종료된 경우<br/>재등록 후 다시 이용할 수 있습니다.</p></div><form onSubmit={submit}><label htmlFor="membership-code">Access Code</label><input id="membership-code" type="password" inputMode="numeric" autoComplete="one-time-code" placeholder="Enter Access Code" value={code} onChange={event=>setCode(event.target.value)} required/><button type="submit" disabled={submitting}>{submitting ? "Checking…" : "Enter Practice"}</button>{error&&<p className="access-alert" role="alert">{error}</p>}</form><ul><li><Check/>현재 Language101 멤버만 이용 가능합니다.</li><li><Check/>이용권이 종료되면 접근 권한이 자동으로 종료됩니다.</li><li><Check/>재등록 후 다시 이용 가능합니다.</li></ul><footer><span>Language101 Website</span><a href="https://101language.base44.app/" target="_blank" rel="noreferrer">Visit Language101<ExternalLink/></a></footer></section></main>;
}
