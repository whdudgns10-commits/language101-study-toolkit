"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAccess } from "@/components/access/2026-07-17-access-provider";

export function AccessGuard({ children }: { children: React.ReactNode }) {
  const { state } = useAccess();
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    if (state === "denied") router.replace(`/membership-access?next=${encodeURIComponent(pathname)}`);
  }, [pathname, router, state]);
  if (state !== "granted") return <main className="access-loading" role="status"><span/><p>Checking membership access…</p></main>;
  return <>{children}</>;
}
