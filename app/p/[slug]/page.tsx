import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import Comments from "@/components/Comments";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await prisma.post.findUnique({ where: { slug: params.slug } });
  if (!post) return notFound();
  const comments = await prisma.comment.findMany({ where: { postId: post.id }, orderBy: { createdAt: "asc" } });
  const nick = cookies().get("nickname")?.value ?? null;
  const own = nick && nick === post.author;

  return (
    <article className="card">
      <h1>{post.title}</h1>
      <p className="muted">
        {new Date(post.createdAt).toLocaleString("ko-KR")} • /p/{post.slug}
        {post.category ? <> • <span className="badge">#{post.category}</span></> : null}
        {post.author ? <> • 작성자: {post.author}</> : null}
      </p>
      {post.imageUrl ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={post.imageUrl} alt="" className="thumb" /> : null}
      <div style={{whiteSpace:"pre-wrap", lineHeight:1.6, marginTop:12}}>{post.content}</div>
      {own ? <DeleteButton slug={post.slug} /> : null}
      <Comments slug={params.slug} initial={comments.map(c=>({id:c.id, content:c.content, author:c.author, createdAt:c.createdAt.toISOString()}))} />
    </article>
  );
}

function DeleteButton({ slug }: { slug: string }) {
  return (
    <form action={`/api/posts/${slug}`} method="POST" style={{marginTop:12}}>
      <input type="hidden" name="_method" value="DELETE" />
      <button>🗑️ 글 삭제 (작성자만)</button>
    </form>
  );
}
