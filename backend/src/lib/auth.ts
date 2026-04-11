import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { bearer } from "better-auth/plugins";
import { Role, UserStatus } from "../generated/prisma/enums";
import envVars from "../config";
import { prisma } from "./prisma";

export const auth = betterAuth({
  baseURL: envVars.BETTER_AUTH_URL,
  secret: envVars.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  trustedOrigins: [
    "http://localhost:3000",
    "https://foodhub-frontend-sepia.vercel.app",
    ...(envVars.APP_URL ? [envVars.APP_URL] : []),
  ],

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: Role.CUSTOMER,
      },
      status: {
        type: "string",
        required: true,
        defaultValue: UserStatus.ACTIVE,
      },
      needPasswordChange: {
        type: "boolean",
        required: true,
        defaultValue: false,
      },
      isDeleted: {
        type: "boolean",
        required: true,
        defaultValue: false,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: false,
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const allowedRole =
            user.role === Role.PROVIDER ? Role.PROVIDER : Role.CUSTOMER;
          const [firstName = null, lastName = null] =
            user.name?.split(" ") ?? [];

          return {
            data: {
              ...user,
              role: allowedRole,
              firstName,
              lastName,
            },
          };
        },

        after: async (user) => {
          if (user.role !== Role.PROVIDER) return;
          await prisma.providerProfile.upsert({
            where: { userId: user.id },
            create: {
              userId: user.id,
              name: user.name ?? "",
            },
            update: {},
          });
        },
      },
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24,     // 1 day
    cookieCache: {
      enabled: false,
    },
  },

  plugins: [bearer()],

  advanced: {
    cookiePrefix: "better-auth",
    useSecureCookies: envVars.NODE_ENV === "production",
    crossSubDomainCookies: {
      enabled: false,
    },
    disableCSRFCheck: true,
    cookies: {
      state: {
        attributes: {
          sameSite: envVars.NODE_ENV === "production" ? "none" : "lax",
          secure: envVars.NODE_ENV === "production",
          httpOnly: true,
          path: "/",
        },
      },
      sessionToken: {
        attributes: {
          sameSite: envVars.NODE_ENV === "production" ? "none" : "lax",
          secure: envVars.NODE_ENV === "production",
          httpOnly: true,
          path: "/",
        },
      },
    },
  },
});
