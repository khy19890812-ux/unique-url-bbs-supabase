import { cookies } from "next/headers";

export function getNickname(): string | null {
  return cookies().get("nickname")?.value ?? null;
}
