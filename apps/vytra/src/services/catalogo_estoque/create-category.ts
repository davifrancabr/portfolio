import { db } from '@/db';
import { categories } from '@/db/schema';
import { createCategorySchema } from '@/lib/schema';
import type z from 'zod';

export async function createCategory(
  data: z.infer<typeof createCategorySchema>
) {
  const { success, error, data: value } = createCategorySchema.safeParse(data);

  if (success === false) return error.cause;

  await db.insert(categories).values(value).returning();
}
