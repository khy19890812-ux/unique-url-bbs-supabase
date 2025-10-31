// app/admin/promote-self/route.ts
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  // 개발 중 임시 라우트: 현재 비활성화
  return new Response("This route is disabled.", { status: 410 });
}
