'use server';

import { cookies } from 'next/headers';

/**
 * Sets a token in the browser cookies.
 * @param name Name of the cookie
 * @param value Value of the cookie
 * @param maxAge Expire time in seconds (default 1 hour for access, 7 days for refresh/session handled elsewhere or passed)
 */
export async function setTokenInCookies(name: string, value: string, maxAge?: number) {
  const cookieStore = await cookies();
  
  let finalMaxAge = maxAge;
  if (!finalMaxAge) {
    if (name === 'accessToken') finalMaxAge = 60 * 60; // 1 hour
    else if (name === 'refreshToken') finalMaxAge = 7 * 24 * 60 * 60; // 7 days
    else if (name === 'better-auth.session_token') finalMaxAge = 60 * 60 * 24; // 1 day
  }

  const isProduction = process.env.NODE_ENV === 'production';

  cookieStore.set(name, value, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
    maxAge: finalMaxAge,
  });
}

/**
 * Gets a token from the cookies.
 */
export async function getTokenFromCookies(name: string) {
  const cookieStore = await cookies();
  return cookieStore.get(name)?.value;
}
