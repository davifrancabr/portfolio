import { db } from '@/db';
import { carts, type NewCart } from '@/db/schema';
import { createCartSchema } from '@/lib/schema';
import type z from 'zod';

export async function createCarts(data: z.infer<typeof createCartSchema>) {
  const { success, error, data: value } = createCartSchema.safeParse(data);

  if (success === false) return error.cause;

  const row: NewCart = {
    ...value,
    expiresAt: new Date(value.expiresAt)
  };

  await db.insert(carts).values(row).returning();
}
