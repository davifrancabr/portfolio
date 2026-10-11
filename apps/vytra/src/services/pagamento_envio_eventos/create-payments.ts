import { db } from '@/db';
import { payments, type NewPayment } from '@/db/schema';
import { createPaymentSchema } from '@/lib/schema';
import type z from 'zod';

export async function createPayments(
  data: z.infer<typeof createPaymentSchema>
) {
  const { success, error, data: value } = createPaymentSchema.safeParse(data);

  if (success === false) return error.cause;

  const row: NewPayment = {
    ...value,
    authorizedAt: new Date(value.authorizedAt),
    dueAt: new Date(value.dueAt),
    paidAt: new Date(value.paidAt)
  };

  await db.insert(payments).values(row).returning();
}
