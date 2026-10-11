import { db } from '@/db';
import { coupons, type NewCoupon } from '@/db/schema';
import { createCouponsSchema } from '@/lib/schema';
import type z from 'zod';

export async function createCoupons(data: z.infer<typeof createCouponsSchema>) {
  const { success, error, data: value } = createCouponsSchema.safeParse(data);

  if (success === false) return error.cause;

  const row: NewCoupon = {
    ...value,
    startsAt: new Date(value.startsAt),
    endsAt: new Date(value.endsAt)
  };

  await db.insert(coupons).values(row).returning();
}
