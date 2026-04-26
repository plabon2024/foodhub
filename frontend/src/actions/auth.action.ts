"use server";

import { setTokenInCookies } from "@/lib/jwtUtils";

/**
 * Called after a successful login/register API response.
 * Stores accessToken, refreshToken, and better-auth session token
 * as cookies on the FRONTEND domain so the Next.js server can read them.
 */
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
