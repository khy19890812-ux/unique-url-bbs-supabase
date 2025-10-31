"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
type Comment = { id:number; content:string; author:string|null; createdAt:string };
export default function Comments({ slug, initial }: { slug:string; initial: Comment[] }){
  const [comments] = useState<Comment[]>(initial);
  const [content,setContent]=useState(""); const [pending,startTransition]=useTransition(); const router=useRouter();
  async function onSubmit(e:React.FormEvent){ e.preventDefault(); if(!content.trim())return;
    const res=await fetch("/api/comments",{ method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({slug,content})});
    if(!res.ok) return alert("댓글 작성 실패"); setContent(""); startTransition(()=>router.refresh()); }
  return (<div className="card" style={{marginTop:16}}><h2>댓글</h2>
    {comments.length===0 && <p className="muted">아직 댓글이 없습니다.</p>}
    <ul className="list">{comments.map(c=>(<li key={c.id}><div style={{display:"flex",justifyContent:"space-between"}}>
      <strong>{c.author ?? "익명"}</strong><time className="muted">{new Date(c.createdAt).toLocaleString("ko-KR")}</time></div>
      <div style={{whiteSpace:"pre-wrap"}}>{c.content}</div></li>))}</ul>
    <form onSubmit={onSubmit} style={{marginTop:12}}><label htmlFor="c">댓글 쓰기</label>
      <textarea id="c" rows={3} value={content} onChange={e=>setContent(e.target.value)} placeholder="댓글 내용을 입력하세요"/>
      <div className="actions" style={{marginTop:8}}><button type="submit" disabled={pending}>{pending?"등록 중...":"댓글 등록"}</button></div>
    </form></div>);
}
