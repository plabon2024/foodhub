import { Response } from "express";
import { JwtPayload, SignOptions } from "jsonwebtoken";
import envVars from "../config";
import { CookieUtils } from "./cookie";
import { jwtUtils } from "./jwt";

// Creating access token
const getAccessToken = (payload: JwtPayload) => {
  return jwtUtils.createToken(
    payload,
    envVars.ACCESS_TOKEN_SECRET,
    { expiresIn: envVars.ACCESS_TOKEN_EXPIRES_IN } as SignOptions
  );
};

// Creating refresh token
const getRefreshToken = (payload: JwtPayload) => {
  return jwtUtils.createToken(
    payload,
    envVars.REFRESH_TOKEN_SECRET,
    { expiresIn: envVars.REFRESH_TOKEN_EXPIRES_IN } as SignOptions
  );
};

const isProduction = envVars.NODE_ENV === "production";
const cookieBaseOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: (isProduction ? "none" : "lax") as "none" | "lax",
  path: "/",
};

const setAccessTokenCookie = (res: Response, token: string) => {
  CookieUtils.setCookie(res, "accessToken", token, {
    ...cookieBaseOptions,
    maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
  });
};

const setRefreshTokenCookie = (res: Response, token: string) => {
  CookieUtils.setCookie(res, "refreshToken", token, {
    ...cookieBaseOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

const setBetterAuthSessionCookie = (res: Response, token: string) => {
  CookieUtils.setCookie(res, "better-auth.session_token", token, {
    ...cookieBaseOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days (matching refreshToken)
  });
};

const clearAuthCookies = (res: Response) => {
  CookieUtils.clearCookie(res, "accessToken", cookieBaseOptions);
  CookieUtils.clearCookie(res, "refreshToken", cookieBaseOptions);
  CookieUtils.clearCookie(res, "better-auth.session_token", cookieBaseOptions);
};

export const tokenUtils = {
  getAccessToken,
  getRefreshToken,
  setAccessTokenCookie,
  setRefreshTokenCookie,
  setBetterAuthSessionCookie,
  clearAuthCookies,
};
