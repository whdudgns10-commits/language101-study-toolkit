import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({})) as { code?: string };
  const configuredCode = process.env.STUDY_TOOLKIT_ACCESS_CODE || "0509";
  const codeValid = typeof body.code === "string" && body.code === configuredCode;
  if (!codeValid) return NextResponse.json({ codeValid: false, active: false, memberName: "", expiresAt: "", error: "invalid-code" }, { status: 401 });
  // Mock membership lookup. Replace this object with a Base44 or Supabase lookup later.
  const membership = { active: true, memberName: "", expiresAt: "" };
  if (!membership.active) return NextResponse.json({ codeValid: true, ...membership, error: "membership-expired" }, { status: 403 });
  return NextResponse.json({ codeValid: true, ...membership });
}
