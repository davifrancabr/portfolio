import { db } from '@/db';
import { inventoryItems } from '@/db/schema';
import { createInventoryItemSchema } from '@/lib/schema';
import type z from 'zod';

export async function createInventoryItems(
  data: z.infer<typeof createInventoryItemSchema>
) {
  const {
    success,
    error,
    data: value
  } = createInventoryItemSchema.safeParse(data);

  if (success === false) return error.cause;

  await db.insert(inventoryItems).values(value).returning();
}
