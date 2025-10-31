"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const { error } = await supabase.auth.signUp({ email, password: pw });
    if (error) return setMsg("회원가입 실패: " + error.message);
    // 가입 직후 프로필이 없으면 서버에서 만들어 주도록 부트스트랩 호출(선택)
    await fetch("/api/auth/bootstrap", { method: "POST" });
    setMsg("가입 신청 완료! 관리자 승인 전까지는 이용이 제한됩니다.");
    // 바로 로그인까지 안내하려면 아래 주석 해제
    // router.push("/login");
  }

  return (
    <div className="card">
      <h1>회원가입</h1>
      <p className="muted">이메일과 비밀번호로 가입합니다. 관리자가 승인해야 이용 가능해요.</p>
      <form onSubmit={onSubmit}>
        <label>이메일</label>
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <label>비밀번호</label>
        <input type="password" value={pw} onChange={e=>setPw(e.target.value)} required minLength={6} />
        <div className="actions" style={{marginTop:12}}>
          <button type="submit">가입 신청</button>
        </div>
      </form>
      {msg && <p className="muted" style={{marginTop:8}}>{msg}</p>}
    </div>
  );
}
