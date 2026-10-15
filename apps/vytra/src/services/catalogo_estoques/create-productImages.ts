import { db } from '@/db';
import { createProductImageSchema } from '@/lib/schema';
import type z from 'zod';

export async function createProductImages(
  data: z.infer<typeof createProductImageSchema>
) {
  const {
    success,
    error,
    data: value
  } = createProductImageSchema.safeParse(data);

  if (success === false) return error.cause;
}
