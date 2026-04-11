import { NextFunction, Request, Response } from 'express';
import status from 'http-status';
import AppError from '../../utils/AppError';
import { tokenUtils } from '../../utils/token';
import { AuthService } from './auth.service';

/* ── POST /api/v1/auth/register ─────────────────────────────── */
const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AuthService.registerUser(req.body);

    tokenUtils.setAccessTokenCookie(res, result.accessToken);
    tokenUtils.setRefreshTokenCookie(res, result.refreshToken);
    tokenUtils.setBetterAuthSessionCookie(res, result.token as string);

    res.status(status.CREATED).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
    });
  } catch (error) { next(error); }
};

/* ── POST /api/v1/auth/login ────────────────────────────────── */
const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AuthService.loginUser(req.body);

    tokenUtils.setAccessTokenCookie(res, result.accessToken);
    tokenUtils.setRefreshTokenCookie(res, result.refreshToken);
    tokenUtils.setBetterAuthSessionCookie(res, result.token as string);

    res.status(status.OK).json({
      success: true,
      message: 'Logged in successfully',
      data: {
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
    });
  } catch (error) { next(error); }
};

/* ── GET /api/v1/auth/me ────────────────────────────────────── */
const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) throw new AppError(status.UNAUTHORIZED, 'Unauthorized');

    const user = await AuthService.getMe(userId);
    res.status(status.OK).json({ success: true, data: user });
  } catch (error) { next(error); }
};

/* ── POST /api/v1/auth/refresh-token ────────────────────────── */
const getNewToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.refreshToken as string | undefined;
    const sessionToken = req.cookies['better-auth.session_token'] as string | undefined;

    if (!refreshToken) throw new AppError(status.UNAUTHORIZED, 'Refresh token missing');
    if (!sessionToken) throw new AppError(status.UNAUTHORIZED, 'Session token missing');

    const result = await AuthService.getNewToken(refreshToken, sessionToken);

    tokenUtils.setAccessTokenCookie(res, result.accessToken);
    tokenUtils.setRefreshTokenCookie(res, result.refreshToken);
    tokenUtils.setBetterAuthSessionCookie(res, result.token as string);

    res.status(status.OK).json({
      success: true,
      message: 'Tokens refreshed',
      data: {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
    });
  } catch (error) { next(error); }
};

/* ── POST /api/v1/auth/change-password ──────────────────────── */
const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionToken = req.cookies['better-auth.session_token'] as string | undefined;
    if (!sessionToken) throw new AppError(status.UNAUTHORIZED, 'Session token missing');

    const result = await AuthService.changePassword(
      req.body,
      sessionToken,
    );

    tokenUtils.setAccessTokenCookie(res, result.accessToken);
    tokenUtils.setRefreshTokenCookie(res, result.refreshToken);
    tokenUtils.setBetterAuthSessionCookie(res, result.token as string);

    res.status(status.OK).json({ success: true, message: 'Password changed successfully' });
  } catch (error) { next(error); }
};

/* ── PATCH /api/v1/auth/profile ─────────────────────────────── */
const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) throw new AppError(status.UNAUTHORIZED, 'Unauthorized');

    const result = await AuthService.updateProfile(userId, req.body);
    res.status(status.OK).json({
      success: true,
      message: 'Profile updated successfully',
      data: result,
    });
  } catch (error) { next(error); }
};

/* ── POST /api/v1/auth/logout ───────────────────────────────── */
const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionToken = req.cookies['better-auth.session_token'] as string | undefined;
    if (sessionToken) await AuthService.logoutUser(sessionToken);

    tokenUtils.clearAuthCookies(res);

    res.status(status.OK).json({ success: true, message: 'Logged out successfully' });
  } catch (error) { next(error); }
};

export const AuthController = {
  registerUser,
  loginUser,
  getMe,
  getNewToken,
  changePassword,
  updateProfile,
  logoutUser,
};
