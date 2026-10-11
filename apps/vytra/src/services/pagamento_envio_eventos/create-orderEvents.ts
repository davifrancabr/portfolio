import { db } from '@/db';
import { orderEvents, type NewOrderEvent } from '@/db/schema';
import { createOrderEventSchema } from '@/lib/schema';
import type z from 'zod';

export async function createOrderEvents(
  data: z.infer<typeof createOrderEventSchema>
) {
  const {
    success,
    error,
    data: value
  } = createOrderEventSchema.safeParse(data);

  if (success === false) return error.cause;

  await db.insert(orderEvents).values(value).returning();
}
