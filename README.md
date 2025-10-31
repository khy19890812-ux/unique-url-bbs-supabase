# Unique URL BBS — Fixed (Supabase/Vercel)

- Lazy Supabase admin client
- Dynamic server flags for cookie routes
- Open posting (/new without login)
- Admin approvals & delete
- Prisma schema: Post/Comment/UserProfile

## Dev
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev

## Env (.env or Vercel)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_BUCKET=uploads
DATABASE_URL=postgresql://postgres:ENCODED@db.host:5432/postgres?sslmode=require
ADMIN_EMAILS=you@example.com

Built: 2025-10-31T09:13:05.482248
