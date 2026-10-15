import { db } from '@/db';
import { stockMovements } from '@/db/schema';
import { createStockMovementSchema } from '@/lib/schema';
import type z from 'zod';

export async function createStockMovements(
  data: z.infer<typeof createStockMovementSchema>
) {
  const {
    success,
    error,
    data: value
  } = createStockMovementSchema.safeParse(data);

  if (success === false) return error.cause;

  await db.insert(stockMovements).values(value).returning();
}
