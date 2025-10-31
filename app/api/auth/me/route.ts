import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSupabaseRoute } from "@/lib/supabaseClient";
export const dynamic = "force-dynamic"; export const runtime = "nodejs";
function isAdminByEnv(email?: string | null){
  const admins=(process.env.ADMIN_EMAILS??"").split(",").map(s=>s.trim().toLowerCase()).filter(Boolean); return email?admins.includes(email.toLowerCase()):false;
}
export async function GET(){
  const sb = createSupabaseRoute(); const { data:{ user } } = await sb.auth.getUser(); if(!user) return NextResponse.json({ user:null });
  const email=user.email??""; const wantAdmin=isAdminByEnv(email);
  let profile = await prisma.userProfile.findUnique({ where:{ userId: user.id }});
  if(!profile){ profile = await prisma.userProfile.create({ data:{ userId:user.id, email, isApproved: wantAdmin, isAdmin: wantAdmin }}); }
  else if(wantAdmin && (!profile.isAdmin || !profile.isApproved)){
    profile = await prisma.userProfile.update({ where:{ userId:user.id }, data:{ isAdmin:true, isApproved:true }});
  }
  return NextResponse.json({ user:{ id:user.id, email }, isApproved: profile.isApproved, isAdmin: profile.isAdmin });
}
