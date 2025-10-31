import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { nickname } = await req.json();
  const nick = (nickname ?? "").toString().trim();
  if (!nick || nick.length < 2) return NextResponse.json({ error: "닉네임을 바르게 입력하세요." }, { status: 400 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set("nickname", nick, { httpOnly: true, path: "/", maxAge: 60*60*24*365 });
  return res;
}
