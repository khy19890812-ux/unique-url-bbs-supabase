import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { slug, content } = await req.json();
  if (!slug || !content) return NextResponse.json({ error: "데이터가 부족합니다." }, { status: 400 });
  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post) return NextResponse.json({ error: "글을 찾을 수 없습니다." }, { status: 404 });
  const nick = cookies().get("nickname")?.value ?? "익명";
  const created = await prisma.comment.create({
    data: { content, author: nick, postId: post.id },
  });
  return NextResponse.json({ id: created.id });
}
