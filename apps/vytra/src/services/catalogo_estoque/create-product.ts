import { db } from '@/db';
import { products } from '@/db/schema';
import { createProductSchema } from '@/lib/schema';
import type z from 'zod';

export async function createProduct(data: z.infer<typeof createProductSchema>) {
  const { success, error, data: value } = createProductSchema.safeParse(data);

  if (success === false) return error.cause;

  await db
    .insert(products)
    .values({
      name: value.name,
      brandId: value.brandId,
      primaryCategoryId: value.primaryCategoryId,
      slug: value.slug,
      sku: value.sku,
      status: value.status,
      priceCents: value.priceCents
    })
    .returning()
    .onConflictDoNothing();
}
