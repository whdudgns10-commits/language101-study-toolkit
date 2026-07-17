"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { createAccessToken, isAccessTokenValid, STUDY_TOOLKIT_ACCESS_KEY, validateAccessCode, type AccessValidationResult } from "@/lib/2026-07-17-access-service";

type AccessState = "loading" | "granted" | "denied";
type AccessContextValue = { state: AccessState; authenticate: (code: string) => Promise<AccessValidationResult>; clearAccess: () => void };
const AccessContext = createContext<AccessContextValue | null>(null);

export function AccessProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AccessState>("loading");
  useEffect(() => {
    const sync = () => {
      const valid = isAccessTokenValid(localStorage.getItem(STUDY_TOOLKIT_ACCESS_KEY));
      if (!valid) localStorage.removeItem(STUDY_TOOLKIT_ACCESS_KEY);
      setState(valid ? "granted" : "denied");
    };
    sync();
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  const authenticate = useCallback(async (code: string) => {
    const result = await validateAccessCode(code);
    if (result.codeValid && result.active) {
      localStorage.setItem(STUDY_TOOLKIT_ACCESS_KEY, JSON.stringify(createAccessToken()));
      setState("granted");
      window.dispatchEvent(new CustomEvent("language101-access-change"));
    }
    return result;
  }, []);
  const clearAccess = useCallback(() => { localStorage.removeItem(STUDY_TOOLKIT_ACCESS_KEY); setState("denied"); }, []);
  const value = useMemo(() => ({ state, authenticate, clearAccess }), [state, authenticate, clearAccess]);
  return <AccessContext.Provider value={value}>{children}</AccessContext.Provider>;
}

export function useAccess() {
  const value = useContext(AccessContext);
  if (!value) throw new Error("useAccess must be used inside AccessProvider");
  return value;
}
