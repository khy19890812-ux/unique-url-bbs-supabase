"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  async function onLogout() {
    const res = await fetch("/api/auth/logout", { method: "POST" });
    if (!res.ok) return alert("오류");
    startTransition(() => router.push("/"));
  }

  return (
    <div className="card">
      <h1>로그아웃</h1>
      <p className="muted">현재 로그인된 닉네임을 지웁니다.</p>
      <button onClick={onLogout} disabled={pending}>{pending ? "처리 중..." : "로그아웃"}</button>
    </div>
  );
}
