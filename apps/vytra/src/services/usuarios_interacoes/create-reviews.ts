import { db } from '@/db';
import { reviews } from '@/db/schema';
import { createReviewSchema } from '@/lib/schema';
import type z from 'zod';

export async function createReviews(data: z.infer<typeof createReviewSchema>) {
  const { success, error, data: value } = createReviewSchema.safeParse(data);

  if (success === false) return error.cause;

  await db.insert(reviews).values(value).returning();
}
