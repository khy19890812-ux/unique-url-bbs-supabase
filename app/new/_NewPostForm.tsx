"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function NewPostForm(){
  const [title,setTitle]=useState(""); const [content,setContent]=useState(""); const [category,setCategory]=useState(""); const [image,setImage]=useState<File|null>(null);
  const [error,setError]=useState<string|null>(null); const [loading,setLoading]=useState(false); const router=useRouter();
  async function onSubmit(e:React.FormEvent){ e.preventDefault(); setError(null); setLoading(true); const form=new FormData();
    form.append("title",title); form.append("content",content); form.append("category",category); if(image) form.append("image", image);
    const res=await fetch("/api/posts",{ method:"POST", body: form }); setLoading(false);
    if(!res.ok){ const data=await res.json().catch(()=>({})); setError(data?.error ?? "작성 중 오류가 발생했습니다."); return; }
    const data=await res.json(); router.push(`/p/${data.slug}`); }
  return (<div className="card"><h1>새 글쓰기</h1><form onSubmit={onSubmit}>
    <label>제목</label><input value={title} onChange={e=>setTitle(e.target.value)} required minLength={2} maxLength={120}/>
    <label>카테고리(선택)</label><input value={category} onChange={e=>setCategory(e.target.value)}/>
    <label>내용</label><textarea value={content} onChange={e=>setContent(e.target.value)} required rows={10}/>
    <label>대표 이미지(선택)</label><input type="file" accept="image/*" onChange={e=>setImage(e.target.files?.[0] ?? null)}/>
    {error && <p className="muted">⚠ {error}</p>}<div className="actions" style={{marginTop:12}}><button type="submit" disabled={loading}>{loading?"작성 중...":"등록"}</button></div>
  </form></div>); }
