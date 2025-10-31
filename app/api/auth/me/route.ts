import { NextResponse } from "next/server";
import { createSupabaseRoute } from "@/lib/supabaseClient";
import { prisma } from "@/lib/prisma";

function isAdminByEnv(email?: string | null) {
  const admins = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);
  return email ? admins.includes(email.toLowerCase()) : false;
}

export async function GET() {
  const supabase = createSupabaseRoute();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ user: null });

  const email = user.email ?? "";
  const wantAdmin = isAdminByEnv(email);

  let profile = await prisma.userProfile.findUnique({ where: { userId: user.id } });

  if (!profile) {
    // 최초 생성 시: 관리자라면 자동 승인/관리자 부여
    profile = await prisma.userProfile.create({
      data: { userId: user.id, email, isApproved: wantAdmin, isAdmin: wantAdmin },
    });
  } else if (wantAdmin && (!profile.isAdmin || !profile.isApproved)) {
    // 이미 존재해도 .env 변경에 따라 자동 승격/승인
    profile = await prisma.userProfile.update({
      where: { userId: user.id },
      data: { isAdmin: true, isApproved: true },
    });
  }

  return NextResponse.json({
    user: { id: user.id, email },
    isApproved: profile.isApproved,
    isAdmin: profile.isAdmin,
  });
}
