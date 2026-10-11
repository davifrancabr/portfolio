import { db } from '@/db';
import { orders, type NewOrder } from '@/db/schema';
import { createOrderSchema } from '@/lib/schema';
import type z from 'zod';

export async function createOrders(data: z.infer<typeof createOrderSchema>) {
  const { success, error, data: value } = createOrderSchema.safeParse(data);

  if (success === false) return error.cause;

  const row: NewOrder = {
    ...value,
    canceledAt: value.canceledAt ? new Date(value.canceledAt) : null,
    shippedAt: value.shippedAt ? new Date(value.shippedAt) : undefined,
    deliveredAt: value.deliveredAt ? new Date(value.deliveredAt) : undefined,
    paidAt: value.paidAt ? new Date(value.paidAt) : undefined,
    placedAt: new Date(value.placedAt)
  };

  await db.insert(orders).values(row).returning();
}
