"use server";

import { setTokenInCookies } from "@/lib/jwtUtils";

import { clearAuthCookies } from "@/services/auth.services";

export async function persistAuthTokens(tokens: {
  accessToken?: string;
  refreshToken?: string;
  sessionToken?: string;
}) {
  if (tokens.accessToken) {
    await setTokenInCookies("accessToken", tokens.accessToken);
  }
  if (tokens.refreshToken) {
    await setTokenInCookies("refreshToken", tokens.refreshToken);
  }
  if (tokens.sessionToken) {
    await setTokenInCookies(
      "better-auth.session_token",
      tokens.sessionToken,
      7 * 24 * 60 * 60 // 7 days
    );
  }
}

import { revalidatePath } from "next/cache";
export async function logout() {
  await clearAuthCookies();
  revalidatePath("/", "layout");
  return { success: true };
}



