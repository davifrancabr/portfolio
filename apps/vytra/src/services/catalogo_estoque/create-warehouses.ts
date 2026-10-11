import { db } from '@/db';
import { warehouses } from '@/db/schema';
import { createWarehouseSchema } from '@/lib/schema';
import type z from 'zod';

export async function createWarehouse(
  data: z.infer<typeof createWarehouseSchema>
) {
  const { success, error, data: value } = createWarehouseSchema.safeParse(data);

  if (success === false) return error.cause;

  await db.insert(warehouses).values(value).returning().onConflictDoNothing();
}
