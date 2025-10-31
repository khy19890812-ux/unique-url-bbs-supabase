"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pw });
    if (error) return setMsg("로그인 실패: " + error.message);

    // 서버에서 프로필 확인 → 승인여부 검사
    const res = await fetch("/api/auth/me");
    const me = await res.json();
    if (!me?.isApproved) {
      setMsg("승인 대기중입니다. 관리자가 승인하면 이용할 수 있어요.");
      return;
    }
    router.push("/");
  }

  return (
    <div className="card">
      <h1>로그인</h1>
      <form onSubmit={onSubmit}>
        <label>이메일</label>
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <label>비밀번호</label>
        <input type="password" value={pw} onChange={e=>setPw(e.target.value)} required />
        <div className="actions" style={{marginTop:12}}>
          <button type="submit">로그인</button>
        </div>
      </form>
      {msg && <p className="muted" style={{marginTop:8}}>{msg}</p>}
      <p className="muted" style={{marginTop:8}}>
        아직 계정이 없다면 <a href="/signup">회원가입</a>
      </p>
    </div>
  );
}
