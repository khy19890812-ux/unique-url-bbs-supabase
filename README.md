# 배포용 게시판 (Next.js + Prisma + Supabase)

고유 URL(슬러그) + 로그인(닉네임) + 댓글 + 이미지 업로드.
**실제 인터넷에 배포해서 친구들이 접속**할 수 있게 만든 버전입니다.

## 0) 준비물
- Node.js LTS 설치
- (선택) VS Code
- 계정 2개: **Supabase**, **Vercel**

## 1) Supabase에서 프로젝트 만들기
1. supabase.com 가입 → 새 프로젝트 만들기
2. `Project Settings > API`에서 **Project URL**과 **Service Role Key** 확인
3. `Project Settings > Database > Connection string`에서 **Postgres 연결 문자열** 복사
4. `Storage`에 들어가서 **새 Bucket** 만들기
   - 이름: `uploads`
   - Public(공개) 체크 ON

## 2) 환경변수 파일 만들기 (.env)
프로젝트 루트에 `.env`를 만들고 다음을 채워 넣으세요:

```
SUPABASE_URL=...     # Project URL
SUPABASE_SERVICE_ROLE_KEY=...  # Service Role Key (절대 클라이언트에 노출 금지)
SUPABASE_BUCKET=uploads

DATABASE_URL=...     # Postgres 연결 문자열
```

## 3) 로컬에서 DB 준비 (마이그레이션 적용)
```
npm install
npx prisma generate
npx prisma migrate deploy   # 동봉된 초기 마이그레이션 실행
npm run dev                 # 테스트 (http://localhost:3000)
```

## 4) Vercel에 배포
1. github.com에 새 저장소 만들고 이 프로젝트 코드를 푸시
2. vercel.com에서 "Add New..." → "Import Git Repository"
3. 배포 설정에서 **Environment Variables** 추가
   - `DATABASE_URL` : (위에서 복사한 Postgres)
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_BUCKET` = `uploads`
4. Deploy 버튼 누르면 완료!

> 처음 한번은 **로컬**에서 `npx prisma migrate deploy`로 DB 테이블을 만들어 두는 걸 추천합니다.

## 5) 사용
- 로그인(닉네임) → 새 글쓰기(이미지 선택 가능) → 목록/상세/댓글
- 이미지: Supabase Storage `uploads` 버킷에 저장되며 공개 URL로 보여집니다.

---

생성 시각: 2025-10-31T06:17:52.910891
