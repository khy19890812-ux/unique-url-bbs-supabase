import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { slugify } from "@/utils/slugify";
import { createSupabaseRoute } from "@/lib/supabaseClient";
import { getSupabaseAdmin } from "@/lib/supabase";   // ✅ 반드시 이 줄이 있어야 함

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const posts = await prisma.post.findMany({ orderBy: { createdAt: "desc" }, take: 50 });
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  let authorEmail: string | null = null;
  let authorId: string | null = null;
  try { const sb = createSupabaseRoute(); const { data:{ user } } = await sb.auth.getUser(); authorEmail = user?.email ?? null; authorId = user?.id ?? null; } catch {}

  const form = await req.formData();
  const title = (form.get("title") ?? "").toString().trim();
  const content = (form.get("content") ?? "").toString().trim();
  const category = (form.get("category") ?? "").toString().trim() || null;
  if (!title || !content) return NextResponse.json({ error: "제목과 내용을 입력하세요." }, { status: 400 });

  const base = slugify(title) || slugify("post"); let slug = base; let n = 1;
  while (await prisma.post.findUnique({ where: { slug } })) { n += 1; slug = `${base}-${n}`; }

 // --- 업로드 시작 ---
let imageUrl: string | null = null;
const bucket = process.env.SUPABASE_BUCKET ?? "uploads";
const file = form.get("image");
if (file && typeof file !== "string") {
  const f = file as File;
  if (f.size > 0) {
    const buffer = Buffer.from(await f.arrayBuffer());
    const contentType = f.type || "application/octet-stream";
    const filename = `${Date.now()}-${slug}-${(f.name || "image").replace(/[^a-zA-Z0-9._-]/g,"")}`;

    // ✅ 함수 호출로 클라이언트 얻어서 사용
    const sbAdmin = getSupabaseAdmin();
    const { data, error } = await sbAdmin
      .storage.from(bucket)
      .upload(filename, buffer, { contentType, upsert: false });

    if (error) {
      return NextResponse.json({ error: "이미지 업로드 실패" }, { status: 500 });
    }
    const pub = sbAdmin.storage.from(bucket).getPublicUrl(data.path);
    imageUrl = pub.data.publicUrl;
  }
}
// --- 업로드 끝 ---


  const created = await prisma.post.create({ data: { title, content, slug, category, imageUrl, authorEmail: authorEmail ?? "익명", authorId } });
  return NextResponse.json({ id: created.id, slug: created.slug });
}
