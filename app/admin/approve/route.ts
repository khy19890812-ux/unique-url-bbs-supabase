import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSupabaseRoute } from "@/lib/supabaseClient";

function isAdminEmail(email: string | null | undefined) {
  const admins = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);
  return email ? admins.includes(email.toLowerCase()) : false;
}

export async function POST(req: NextRequest) {
  const supabase = createSupabaseRoute();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });

  const me = await prisma.userProfile.findUnique({ where: { userId: user.id } });
  const admin = isAdminEmail(user.email) || me?.isAdmin;
  if (!admin) return NextResponse.json({ error: "권한 없음" }, { status: 403 });

  const form = await req.formData();
  const targetUserId = (form.get("userId") ?? "").toString();
  if (!targetUserId) return NextResponse.json({ error: "userId 필요" }, { status: 400 });

  await prisma.userProfile.update({
    where: { userId: targetUserId },
    data: { isApproved: true },
  });

  return NextResponse.redirect(new URL("/admin/users", process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"));
}
