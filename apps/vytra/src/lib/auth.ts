import { db } from '@/db';
import * as schema from '@/db/schemas';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import { admin, username } from 'better-auth/plugins';

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
      userRelations: schema.userRelations,
      sessionRelations: schema.sessionRelations,
      accountRelations: schema.accountRelations
    }
  }),
  advanced: {
    database: {
      joins: true
    }
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 8
  },
  plugins: [
    username(),
    admin({ defaultRole: 'user', adminRoles: ['admin'] }),
    nextCookies()
  ],
  user: {
    additionalFields: {
      phone: {
        type: 'string',
        required: false
      },
      taxId: {
        type: 'string',
        required: false,
        input: true
      },
      paymentCustomerId: { type: 'string', required: false, input: false },
      acceptsMarketing: {
        type: 'boolean',
        required: false,
        defaultValue: false
      },
      locate: { type: 'string', required: false, defaultValue: 'pt-BR' }
    }
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60
    }
  }
});

export type Auth = typeof auth;
export type SessionUser = typeof auth.$Infer.Session.user;
