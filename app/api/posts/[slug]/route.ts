import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseRoute } from "@/lib/supabaseClient";
export const dynamic = "force-dynamic"; export const runtime = "nodejs";

function isAdminEmail(email: string | null | undefined) {
  const admins = (process.env.ADMIN_EMAILS ?? "")
    .split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
  return email ? admins.includes(email.toLowerCase()) : false;
}

export async function GET(_: Request, { params }:{ params:{ slug:string } }){
  const post = await prisma.post.findUnique({ where: { slug: params.slug } }); if(!post) return new NextResponse("Not found", { status:404 });
  return NextResponse.json(post);
}

export async function POST(req: NextRequest, { params }:{ params:{ slug:string } }){
  const form = await req.formData(); const method = (form.get("_method") ?? "").toString().toUpperCase();
  if(method === "DELETE") return DELETE(req,{ params }); return NextResponse.json({ error:"Unsupported method" }, { status:400 });
}

export async function DELETE(_: NextRequest, { params }:{ params:{ slug:string } }){
  const sb = createSupabaseRoute(); const { data:{ user } } = await sb.auth.getUser();
  const post = await prisma.post.findUnique({ where: { slug: params.slug } }); if(!post) return NextResponse.json({ error:"존재하지 않는 글입니다." }, { status:404 });
  const isAdmin = isAdminEmail(user?.email) || (user?.id ? (await prisma.userProfile.findUnique({ where:{ userId: user.id }}))?.isAdmin === true : false);
  const isAuthor = user?.id && post.authorId === user.id;
  if(!isAdmin && !isAuthor) return NextResponse.json({ error:"삭제 권한이 없습니다." }, { status:403 });
  await prisma.post.delete({ where: { id: post.id } }); return NextResponse.json({ ok:true });
}
