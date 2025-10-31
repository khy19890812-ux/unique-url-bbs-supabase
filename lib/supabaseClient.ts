import { createClientComponentClient, createServerComponentClient, createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
export const createSupabaseClient = () => createClientComponentClient();
export const createSupabaseServer = () => createServerComponentClient({ cookies });
export const createSupabaseRoute = () => createRouteHandlerClient({ cookies });
