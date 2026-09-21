import { createId } from '@paralleldrive/cuid2';
import { relations, sql } from 'drizzle-orm';
import {
  type AnyPgColumn,
  boolean,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex
} from 'drizzle-orm/pg-core';
import { productStatusEnum } from './enum';

const timestamps = {
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .$onUpdate(() => new Date())
    .defaultNow()
};

export const brands = pgTable(
  'brands',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    description: text('description'),
    logoUrl: text('logo_url'),
    isActive: boolean('is_active').default(true).notNull(),
    ...timestamps
  },
  t => [uniqueIndex('brands_slug_uidx').on(t.slug)]
);

export const categories = pgTable(
  'categories',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    parentId: text('parent_id').references((): AnyPgColumn => categories.id, {
      onDelete: 'set null'
    }),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    description: text('description'),
    imageUrl: text('image_url'),
    path: text('path').notNull(),
    depth: integer('depth').default(0).notNull(),
    position: integer('position').default(0).notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    metaTitle: text('meta_title'),
    metaDescription: text('meta_description'),
    ...timestamps
  },
  t => [
    uniqueIndex('categories_slug_uidx').on(t.slug),
    index('categories_parent_idx').on(t.parentId),
    index('categories_path_idx').on(t.path)
  ]
);

export const products = pgTable(
  'products',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    brandId: text('brand_id').references(() => brands.id, {
      onDelete: 'set null'
    }),
    primaryCategoryId: text('primary_category_id').references(
      () => categories.id,
      {
        onDelete: 'set null'
      }
    ),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    shortDescription: text('short_description'),
    description: text('description'),
    status: productStatusEnum('status').default('draft').notNull(),
    isDigital: boolean('is_digital').default(false).notNull(),
    requiresShipping: boolean('requires_shipping').default(true).notNull(),
    taxCode: text('tax_code'),
    taxRate: numeric('tax_rate', { precision: 5, scale: 4 }),
    tags: text('tags')
      .array()
      .default(sql`ARRAY[]::text[]`)
      .notNull(),
    attributes: jsonb('attributes').$type<Record<string, string>>(),
    metaTitle: text('meta_title'),
    metaDescription: text('meta_description'),
    ratingAverage: numeric('rating_average', { precision: 3, scale: 2 })
      .default('0')
      .notNull(),
    ratingCount: integer('rating_count').default(0).notNull(),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
    ...timestamps
  },
  t => [
    uniqueIndex('products_slug_unique').on(t.slug),
    index('products_status_idx').on(t.status),
    index('products_brand_idx').on(t.brandId),
    index('products_primary_category_idx').on(t.primaryCategoryId),
    index('products_created_at_idx').on(t.createdAt)
  ]
);

export const productCategories = pgTable(
  'product_categories',
  {
    productId: text('product_id')
      .notNull()
      .references(() => products.id, {
        onDelete: 'cascade'
      }),
    categoryId: text('category_id')
      .notNull()
      .references(() => categories.id, {
        onDelete: 'cascade'
      })
  },
  t => [
    primaryKey({ columns: [t.productId, t.categoryId] }),
    index('product_categories_category_idx').on(t.categoryId)
  ]
);

export const productOptions = pgTable(
  'product_options',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    productId: text('product_id')
      .notNull()
      .references(() => products.id, {
        onDelete: 'cascade'
      }),
    name: text('name').notNull(),
    position: integer('position').default(0).notNull()
  },
  t => [uniqueIndex('product_options_uidx').on(t.productId, t.name)]
);

export const productOptionValues = pgTable(
  'product_option_values',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    optionId: text('option_id')
      .notNull()
      .references(() => productOptions.id, {
        onDelete: 'cascade'
      }),
    value: text('value').notNull(),
    metadata: jsonb('metadata').$type<Record<string, string>>(),
    position: integer('position').default(0).notNull()
  },
  t => [
    uniqueIndex('product_option_values_uidx').on(t.optionId, t.value),
    index('product_option_values_option_idx').on(t.optionId)
  ]
);

export const productVariants = pgTable(
  'product_variants',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    productId: text('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),

    sku: text('sku').notNull(),
    barcode: text('barcode'), // EAN/GTIN
    /** Rótulo pronto, ex.: "Azul / M". */
    name: text('name'),

    priceCents: integer('price_cents').notNull(),
    /** Preço "de" riscado. Null = sem promoção. */
    compareAtPriceCents: integer('compare_at_price_cents'),
    /** Custo, para margem. Nunca exponha na API pública. */
    costCents: integer('cost_cents'),
    weightGrams: integer('weight_grams'),
    lengthMm: integer('length_mm'),
    widthMm: integer('width_mm'),
    heightMm: integer('height_mm'),
    allowBackorder: boolean('allow_backorder').default(false).notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    isDefault: boolean('is_default').default(false).notNull(),
    position: integer('position').default(0).notNull(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
    ...timestamps
  },
  t => [
    uniqueIndex('product_variants_sku_unique').on(t.sku),
    index('product_variants_product_idx').on(t.productId),
    index('product_variants_barcode_idx').on(t.barcode),
    index('product_variants_price_idx').on(t.priceCents)
  ]
);

export const variantOptionValues = pgTable(
  'variant_option_values',
  {
    variantId: text('variant_id')
      .notNull()
      .references(() => productVariants.id, { onDelete: 'cascade' }),
    optionValueId: text('option_value_id')
      .notNull()
      .references(() => productOptionValues.id, { onDelete: 'cascade' })
  },
  t => [
    primaryKey({ columns: [t.variantId, t.optionValueId] }),
    index('variant_option_values_value_idx').on(t.optionValueId)
  ]
);

export const productImages = pgTable(
  'product_images',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    productId: text('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    /** Se preenchido, a imagem é específica daquela variante. */
    variantId: text('variant_id').references(() => productVariants.id, {
      onDelete: 'cascade'
    }),
    url: text('url').notNull(),
    alt: text('alt'),
    width: integer('width'),
    height: integer('height'),
    /** Placeholder base64/blurhash para LQIP. */
    blurDataUrl: text('blur_data_url'),
    position: integer('position').default(0).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull()
  },
  t => [
    index('product_images_product_idx').on(t.productId, t.position),
    index('product_images_variant_idx').on(t.variantId)
  ]
);

export const brandsRelations = relations(brands, ({ many }) => ({
  products: many(products)
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
    relationName: 'category_parent'
  }),
  children: many(categories, { relationName: 'category_parent' }),
  productCategories: many(productCategories)
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  brand: one(brands, { fields: [products.brandId], references: [brands.id] }),
  primaryCategory: one(categories, {
    fields: [products.primaryCategoryId],
    references: [categories.id]
  }),
  variants: many(productVariants),
  images: many(productImages),
  options: many(productOptions),
  productCategories: many(productCategories)
}));

export const productCategoriesRelations = relations(
  productCategories,
  ({ one }) => ({
    product: one(products, {
      fields: [productCategories.productId],
      references: [products.id]
    }),
    category: one(categories, {
      fields: [productCategories.categoryId],
      references: [categories.id]
    })
  })
);

export const productOptionsRelations = relations(
  productOptions,
  ({ one, many }) => ({
    product: one(products, {
      fields: [productOptions.productId],
      references: [products.id]
    }),
    values: many(productOptionValues)
  })
);

export const productOptionValuesRelations = relations(
  productOptionValues,
  ({ one, many }) => ({
    option: one(productOptions, {
      fields: [productOptionValues.optionId],
      references: [productOptions.id]
    }),
    variantOptionValues: many(variantOptionValues)
  })
);

export const productVariantsRelations = relations(
  productVariants,
  ({ one, many }) => ({
    product: one(products, {
      fields: [productVariants.productId],
      references: [products.id]
    }),
    optionValues: many(variantOptionValues),
    images: many(productImages)
  })
);

export const variantOptionValuesRelations = relations(
  variantOptionValues,
  ({ one }) => ({
    variant: one(productVariants, {
      fields: [variantOptionValues.variantId],
      references: [productVariants.id]
    }),
    optionValue: one(productOptionValues, {
      fields: [variantOptionValues.optionValueId],
      references: [productOptionValues.id]
    })
  })
);

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id]
  }),
  variant: one(productVariants, {
    fields: [productImages.variantId],
    references: [productVariants.id]
  })
}));

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type ProductVariant = typeof productVariants.$inferSelect;
export type Category = typeof categories.$inferSelect;
