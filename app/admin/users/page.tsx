import { prisma } from "@/lib/prisma";
import { createSupabaseServer } from "@/lib/supabaseClient";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

function isAdminEmail(email: string | null | undefined) {
  const admins = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);
  return email ? admins.includes(email.toLowerCase()) : false;
}

export default async function AdminUsersPage() {
  const supabase = createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return <div className="card"><h1>로그인 필요</h1></div>;

  const me = await prisma.userProfile.findUnique({ where: { userId: user.id } });
  const admin = isAdminEmail(user.email) || me?.isAdmin;
  if (!admin) return <div className="card"><h1>권한 없음</h1></div>;

  const users = await prisma.userProfile.findMany({ orderBy: { createdAt: "desc" }, take: 100 });

  return (
    <div className="card">
      <h1>사용자 승인</h1>
      <table style={{width:"100%", borderCollapse:"collapse"}}>
        <thead>
          <tr><th align="left">Email</th><th>승인</th><th>관리자</th><th>액션</th></tr>
        </thead>
        <tbody>
        {users.map(u => (
          <tr key={u.id}>
            <td>{u.email}</td>
            <td align="center">{u.isApproved ? "✅" : "⏳"}</td>
            <td align="center">{u.isAdmin ? "👑" : ""}</td>
            <td align="center">
              <form action="/api/admin/confirm" method="POST" style={{display:"inline", marginLeft:8}}>
              <input type="hidden" name="userId" value={u.userId} />
              <button type="submit">이메일 확인 처리</button>
            </form>

              {!u.isApproved && (
                <form action="/api/admin/approve" method="POST" style={{display:"inline"}}>
                  <input type="hidden" name="userId" value={u.userId} />
                  <button>승인</button>
                </form>
              )}
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
}
