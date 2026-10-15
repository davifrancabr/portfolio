import { db } from '@/db';
import { cartItems } from '@/db/schema';
import { createCartItemsSchema } from '@/lib/schema';
import type z from 'zod';

export async function createCartItems(
  data: z.infer<typeof createCartItemsSchema>
) {
  const { success, error, data: value } = createCartItemsSchema.safeParse(data);

  if (success === false) return error.cause;

  await db.insert(cartItems).values(value).returning();
}
