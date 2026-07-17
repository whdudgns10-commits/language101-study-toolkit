export const STUDY_TOOLKIT_ACCESS_KEY = "studyToolkitAccess";
export const ACCESS_DURATION_MS = 24 * 60 * 60 * 1000;

export type MembershipResult = {
  active: boolean;
  memberName: string;
  expiresAt: string;
};

export type AccessValidationResult = MembershipResult & {
  codeValid: boolean;
  error?: "invalid-code" | "membership-expired" | "service-error";
};

export type StoredAccessToken = {
  version: 1;
  active: true;
  issuedAt: number;
  expiresAt: number;
};

export async function validateAccessCode(code: string): Promise<AccessValidationResult> {
  try {
    const response = await fetch("/api/membership/validate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ code: code.trim() }),
    });
    const result = await response.json() as AccessValidationResult;
    return response.ok ? result : { ...result, active: false };
  } catch {
    return { codeValid: false, active: false, memberName: "", expiresAt: "", error: "service-error" };
  }
}

export function createAccessToken(now = Date.now()): StoredAccessToken {
  return { version: 1, active: true, issuedAt: now, expiresAt: now + ACCESS_DURATION_MS };
}

export function isAccessTokenValid(value: string | null, now = Date.now()): boolean {
  if (!value) return false;
  try {
    const token = JSON.parse(value) as Partial<StoredAccessToken>;
    return token.version === 1 && token.active === true && typeof token.issuedAt === "number" && typeof token.expiresAt === "number" && token.issuedAt <= now && token.expiresAt > now;
  } catch {
    return false;
  }
}
