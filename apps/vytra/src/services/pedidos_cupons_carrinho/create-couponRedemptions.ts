import { db } from '@/db';
import { couponRedemptions } from '@/db/schema';
import { createCuponRedemptionSchema } from '@/lib/schema';
import type z from 'zod';

export async function createCuponRedemptions(
  data: z.infer<typeof createCuponRedemptionSchema>
) {
  const {
    success,
    error,
    data: value
  } = createCuponRedemptionSchema.safeParse(data);

  if (success === false) return error.cause;

  await db.insert(couponRedemptions).values(value).returning();
}
