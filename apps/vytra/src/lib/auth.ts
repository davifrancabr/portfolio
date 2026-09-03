import { db } from '#/db';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin, username } from 'better-auth/plugins';
import { tanstackStartCookies } from 'better-auth/tanstack-start';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg'
  }),
  emailAndPassword: {
    enabled: true
  },
  plugins: [admin(), username(), tanstackStartCookies()]
});
