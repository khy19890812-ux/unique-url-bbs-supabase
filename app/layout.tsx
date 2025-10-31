import React from "react";
import Link from "next/link";
import "./globals.css";

export const metadata = { title: "게시판", description: "Supabase BBS" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <header className="container">
          <Link href="/" className="brand">게시판</Link>
          <nav>
            <Link href="/">목록</Link>
            <Link href="/new" className="primary">새 글쓰기</Link>
            <Link href="/login">로그인</Link>
          </nav>
        </header>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
