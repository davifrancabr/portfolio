import { db } from '@/db';
import { orderItems, type NewOrderItem } from '@/db/schema';
import { createOrderItemSchema } from '@/lib/schema';
import type z from 'zod';

export async function createOrderItems(
  data: z.infer<typeof createOrderItemSchema>
) {
  const { success, error, data: value } = createOrderItemSchema.safeParse(data);

  if (success === false) return error.cause;

  await db.insert(orderItems).values(value).returning();
}
