import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

export default async function HomePage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return (
    <div>
      <h1>최근 글</h1>
      <ul className="list">
        {posts.length === 0 && <li className="muted">아직 글이 없습니다. 첫 글을 작성해 보세요.</li>}
        {posts.map((p) => (
          <li key={p.id}>
            <Link className="card" href={`/p/${p.slug}`}>
              <div style={{display:"flex", justifyContent:"space-between", alignItems:"baseline"}}>
                <strong>{p.title}</strong>
                <time dateTime={p.createdAt.toISOString()}>
                  {new Date(p.createdAt).toLocaleString("ko-KR")}
                </time>
              </div>
              <p className="muted">
                {p.category ? <span className="badge">#{p.category}</span> : null}
                <> • 작성자: {p.authorEmail ?? "익명"}</>
              </p>

              {p.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.imageUrl} alt="" className="thumb" />
              ) : (
                <p className="muted">{p.content.slice(0, 120)}{p.content.length > 120 ? "…" : ""}</p>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
