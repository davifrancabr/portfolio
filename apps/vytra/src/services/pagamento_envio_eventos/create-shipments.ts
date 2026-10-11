import { db } from '@/db';
import { shipments, type NewShipment } from '@/db/schema';
import { createShipmentSchema } from '@/lib/schema';
import type z from 'zod';

export async function createShipments(
  data: z.infer<typeof createShipmentSchema>
) {
  const { success, error, data: value } = createShipmentSchema.safeParse(data);

  if (success === false) return error.cause;

  const row: NewShipment = {
    ...value,
    deliveredAt: new Date(value.deliveredAt),
    shippedAt: new Date(value.shippedAt),
    estimatedDeliveryAt: new Date(value.estimatedDeliveryAt)
  };

  await db.insert(shipments).values(row).returning();
}
