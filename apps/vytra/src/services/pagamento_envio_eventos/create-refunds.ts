import { db } from '@/db';
import { refunds } from '@/db/schema';
import { createRefundSchema } from '@/lib/schema';
import type z from 'zod';

export async function createRefunds(data: z.infer<typeof createRefundSchema>) {
  const { success, error, data: value } = createRefundSchema.safeParse(data);

  if (success === false) return error.cause;

  await db.insert(refunds).values(value).returning();
}
