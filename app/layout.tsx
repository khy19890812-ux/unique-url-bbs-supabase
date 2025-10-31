import React from "react";
import Link from "next/link";
import "./globals.css";
import { cookies } from "next/headers";

export const metadata = {
  title: "게시판 (Supabase 배포용)",
  description: "고유 URL + 로그인 + 댓글 + 이미지 업로드 (Supabase/Postgres/Storage)",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const nick = cookies().get("nickname")?.value ?? null;
  return (
    <html lang="ko">
      <body>
        <header className="container">
          <Link href="/" className="brand">게시판 (배포용)</Link>
          <nav>
            <Link href="/">목록</Link>
            <Link href="/new" className="primary">새 글쓰기</Link>
            {nick ? <Link href="/logout">로그아웃</Link> : <Link href="/login">로그인</Link>}
          </nav>
          <div className="header-right">
            {nick ? <span className="badge">👤 {nick}</span> : <span className="muted">로그인 안 됨</span>}
          </div>
        </header>
        <main className="container">{children}</main>
        <footer className="container muted">
          <p>© {new Date().getFullYear()} Unique URL BBS • Supabase 배포용</p>
        </footer>
      </body>
    </html>
  );
}
