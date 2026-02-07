import { createAuthClient } from "better-auth/client";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { nextCookies } from "better-auth/next-js";

const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_AUTH_URL,
  plugins: [inferAdditionalFields(), nextCookies()],
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,

  sendVerificationEmail,

  resetPassword,
  updateUser,
} = authClient;