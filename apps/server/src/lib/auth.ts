import { betterAuth } from 'better-auth';
import { admin } from 'better-auth/plugins';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import db from '../utils/db.js';
import { origins } from '../utils/origins.js';
import * as authSchema from '../db/auth-schema.js';

const isProduction = process.env.NODE_ENV === 'production';

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  url: process.env.BETTER_AUTH_URL,
  baseURL: {
    allowedHosts: origins,
  },
  trustedOrigins: origins,
  advanced: {
    useSecureCookies: isProduction,
    crossSubDomainCookies: {
      enabled: isProduction,
      domain: `.elitedev.space`,
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60, // 1 hour
    },
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: false,
        defaultValue: 'member',
        input: false,
      },
    },
  },
  plugins: [
    admin({
      defaultRole: 'member',
    }),
  ],
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  onError: (error: any) => {
    console.error('Better Auth Error:', error.message);
    return {
      status: 'error',
      message: error.message,
      redirect: process.env.FRONTEND_URL,
    };
  },
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: authSchema.user,
      session: authSchema.session,
      account: authSchema.account,
      verification: authSchema.verification,
    },
  }),
});
