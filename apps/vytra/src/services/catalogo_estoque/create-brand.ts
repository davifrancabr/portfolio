import { db } from '@/db';
import { brands } from '@/db/schema';
import { createBrandsSchema } from '@/lib/schema';
import type z from 'zod';

export async function createBrand(data: z.infer<typeof createBrandsSchema>) {
  const { success, error, data: value } = createBrandsSchema.safeParse(data);

  if (success === false) return error.cause;

  await db.insert(brands).values(value).returning().onConflictDoNothing();
}
