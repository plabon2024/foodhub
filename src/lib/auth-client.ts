import { createAuthClient } from "better-auth/client";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { nextCookies } from "better-auth/next-js";

const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5000",
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