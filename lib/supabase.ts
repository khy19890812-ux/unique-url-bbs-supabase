// lib/supabase.ts
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let adminClient: SupabaseClient | null = null;

/** 서버에서만 사용. 호출 시점에 env를 읽어 생성(지연 생성) */
function getSupabaseAdmin(): SupabaseClient {
  if (adminClient) return adminClient;

  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  adminClient = createClient(url, serviceKey, { auth: { persistSession: false } });
  return adminClient;
}

// ✅ 둘 다 export: 기본(default) + 이름(named)
//  - import getSupabaseAdmin from "@/lib/supabase"
//  - import { getSupabaseAdmin } from "@/lib/supabase"
export default getSupabaseAdmin;
export { getSupabaseAdmin };
