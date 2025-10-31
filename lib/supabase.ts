import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL as string;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

if (!url || !serviceKey) {
  console.warn("[supabase] env(SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY) not set");
}

export const supabaseAdmin = createClient(url ?? "", serviceKey ?? "", {
  auth: { persistSession: false },
});
