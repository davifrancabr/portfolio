import { configDotenv } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

configDotenv({ path: ['.env'] });

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schemas.ts',
  out: './drizzle',
  dbCredentials: { url: process.env.DATABASE_URL! }
});
