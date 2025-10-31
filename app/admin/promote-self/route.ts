import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSupabaseRoute } from "@/lib/supabaseClient";

function isAdminByEnv(email?: string | null) {
  const admins = (process.env.ADMIN_EMAILS ?? "")
    .split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
  return email ? admins.includes(email.toLowerCase()) : false;
}

export async function GET() {
  const supabase = createSupabaseRoute();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok:false, error:"로그인이 필요합니다." }, { status: 401 });
  if (!isAdminByEnv(user.email)) {
    return NextResponse.json({ ok:false, error:"ADMIN_EMAILS에 없는 이메일" }, { status: 403 });
  }
  const email = user.email ?? "";
  const existing = await prisma.userProfile.findUnique({ where: { userId: user.id } });
  if (!existing) {
    await prisma.userProfile.create({ data: { userId: user.id, email, isAdmin:true, isApproved:true }});
  } else if (!existing.isAdmin || !existing.isApproved) {
    await prisma.userProfile.update({ where: { userId: user.id }, data: { isAdmin:true, isApproved:true } });
  }
  return NextResponse.json({ ok:true });
}
