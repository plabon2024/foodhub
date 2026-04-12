import status from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { UserStatus } from '../../generated/prisma/enums';
import envVars from '../../config';
import AppError from '../../utils/AppError';
import { auth } from '../../lib/auth';
import { prisma } from '../../lib/prisma';
import { jwtUtils } from '../../utils/jwt';
import { tokenUtils } from '../../utils/token';
import { IChangePasswordPayload, ILoginUserPayload, IRegisterUserPayload, IUpdateProfilePayload } from './auth.interface';

/* ── helpers ────────────────────────────────────────────────── */
type TokenPayload = {
  userId: string;
  role: string;
  name: string;
  email: string;
  status?: string;
  isDeleted?: boolean;
  emailVerified?: boolean;
};

const buildTokens = (p: TokenPayload) => ({
  accessToken: tokenUtils.getAccessToken(p as JwtPayload),
  refreshToken: tokenUtils.getRefreshToken(p as JwtPayload),
});

/* ── POST /api/v1/auth/register ─────────────────────────────── */
const registerUser = async (payload: IRegisterUserPayload) => {
  const { name, email, password, role } = payload;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new AppError(status.BAD_REQUEST, 'User already exists');
  }

  // better-auth signUpEmail
  const data = await auth.api.signUpEmail({ body: { name, email, password, role } });

  if (!data.user) {
    throw new AppError(status.BAD_REQUEST, 'Registration failed');
  }

  const { accessToken, refreshToken } = buildTokens({
    userId: data.user.id,
    role: data.user.role,
    name: data.user.name,
    email: data.user.email,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified,
  });

  return { user: data.user, token: data.token, accessToken, refreshToken };
};

/* ── POST /api/v1/auth/login ────────────────────────────────── */
const loginUser = async (payload: ILoginUserPayload) => {
  const { email, password } = payload;

  const data = await auth.api.signInEmail({ body: { email, password } });

  if (!data?.user) {
    throw new AppError(status.UNAUTHORIZED, 'Invalid credentials');
  }

  if (data.user.status === UserStatus.SUSPENDED) {
    throw new AppError(status.FORBIDDEN, 'Account is suspended');
  }

  if (data.user.isDeleted) {
    throw new AppError(status.NOT_FOUND, 'Account not found');
  }

  const { accessToken, refreshToken } = buildTokens({
    userId: data.user.id,
    role: data.user.role,
    name: data.user.name,
    email: data.user.email,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified,
  });

  return { user: data.user, token: data.token, accessToken, refreshToken };
};

/* ── GET /api/v1/auth/me ────────────────────────────────────── */
const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      emailVerified: true,
      image: true,
      isDeleted: true,
      createdAt: true,
      providerProfile: true,
      providerApplication: true,
    },
  });

  if (!user) throw new AppError(status.NOT_FOUND, 'User not found');
  return user;
};

/* ── POST /api/v1/auth/refresh-token ────────────────────────── */
const getNewToken = async (refreshToken: string, sessionToken: string) => {
  const sessionExists = await prisma.session.findUnique({
    where: { token: sessionToken },
    include: { user: true },
  });

  if (!sessionExists) throw new AppError(status.UNAUTHORIZED, 'Invalid session token');

  const verified = jwtUtils.verifyToken(refreshToken, envVars.REFRESH_TOKEN_SECRET);
  if (!verified.success) throw new AppError(status.UNAUTHORIZED, 'Invalid refresh token');

  const data = verified.data as JwtPayload;

  const newTokens = buildTokens({
    userId: data.userId,
    role: data.role,
    name: data.name,
    email: data.email,
    status: data.status,
    isDeleted: data.isDeleted,
    emailVerified: data.emailVerified,
  });

  // Extend session lifetime
  await prisma.session.update({
    where: { token: sessionToken },
    data: { expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
  });

  return { ...newTokens, token: sessionToken };
};

/* ── POST /api/v1/auth/change-password ──────────────────────── */
const changePassword = async (payload: IChangePasswordPayload, sessionToken: string) => {
  const session = await auth.api.getSession({
    headers: new Headers({ Authorization: `Bearer ${sessionToken}` }),
  });

  if (!session) throw new AppError(status.UNAUTHORIZED, 'Invalid session');

  const { currentPassword, newPassword } = payload;

  const result = await auth.api.changePassword({
    body: { currentPassword, newPassword, revokeOtherSessions: true },
    headers: new Headers({ Authorization: `Bearer ${sessionToken}` }),
  });

  if (session.user.needPasswordChange) {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { needPasswordChange: false },
    });
  }

  const tokens = buildTokens({
    userId: session.user.id,
    role: session.user.role,
    name: session.user.name,
    email: session.user.email,
    status: session.user.status,
    isDeleted: session.user.isDeleted,
    emailVerified: session.user.emailVerified,
  });

  return { ...result, ...tokens };
};

/* ── PATCH /api/v1/auth/profile ─────────────────────────────── */
const updateProfile = async (userId: string, payload: IUpdateProfilePayload) => {
  const { name, image, description, address, phone } = payload;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { providerProfile: true },
  });

  if (!user) throw new AppError(status.NOT_FOUND, "User not found");

  // Update user basic info
  // Building user update data conditionally
  const userUpdateData: any = {};
  if (name !== undefined) userUpdateData.name = name;
  if (image !== undefined) userUpdateData.image = image;

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: userUpdateData,
  });

  // Update provider profile if exists and user is provider
  if (user.role === "PROVIDER" && user.providerProfile) {
    const profileUpdateData: any = {};
    if (description !== undefined) profileUpdateData.description = description;
    if (address !== undefined) profileUpdateData.address = address;
    if (phone !== undefined) {
      if (phone !== "" && !/^\d{11}$/.test(phone)) {
        throw new AppError(status.BAD_REQUEST, "Invalid phone number. Must be 11 digits.");
      }
      profileUpdateData.phone = phone;
    }

    if (Object.keys(profileUpdateData).length > 0) {
      await prisma.providerProfile.update({
        where: { userId },
        data: profileUpdateData,
      });
    }
  }

  return updatedUser;
};

/* ── POST /api/v1/auth/logout ───────────────────────────────── */
const logoutUser = async (sessionToken: string) => {
  // Explicitly destroy session in DB
  await prisma.session.deleteMany({
    where: { token: sessionToken }
  });

  return auth.api.signOut({
    headers: new Headers({ Authorization: `Bearer ${sessionToken}` }),
  });
};

export const AuthService = {
  registerUser,
  loginUser,
  getMe,
  getNewToken,
  changePassword,
  updateProfile,
  logoutUser,
};