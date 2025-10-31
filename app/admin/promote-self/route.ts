export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  // 개발용 임시 라우트: 현재는 사용하지 않으므로 410(Gone) 응답
  return new Response("This route is disabled.", { status: 410 });
}
