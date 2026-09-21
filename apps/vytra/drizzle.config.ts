import { configDotenv } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

configDotenv({ path: ['.env', '.env.local'] });

export default defineConfig({
  out: './drizzle',
  dialect: 'postgresql',
  schema: './src/db/schemas/index.ts',
  dbCredentials: {
    url: process.env.DATABASE_URL!
  }
});
