import { db } from '@/db';
import { shippingMethods } from '@/db/schema';
import { createShipmentMethodSchema } from '@/lib/schema';
import type z from 'zod';

export async function createShipmentMethods(
  data: z.infer<typeof createShipmentMethodSchema>
) {
  const {
    success,
    error,
    data: value
  } = createShipmentMethodSchema.safeParse(data);

  if (success === false) return error.cause;

  await db.insert(shippingMethods).values(value).returning();
}
