import { db } from '@/db';
import { wishlists } from '@/db/schema';
import { createWishlistSchema } from '@/lib/schema';
import type z from 'zod';

export async function createWishlists(
  data: z.infer<typeof createWishlistSchema>
) {
  const { success, error, data: value } = createWishlistSchema.safeParse(data);

  if (success === false) return error.cause;

  await db.insert(wishlists).values(value).returning();
}
