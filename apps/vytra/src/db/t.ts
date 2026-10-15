import { createId } from '@paralleldrive/cuid2';
import { relations, sql } from 'drizzle-orm';
import {
  boolean,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  smallint,
  text,
  timestamp,
  uniqueIndex
} from 'drizzle-orm/pg-core';

type AddressSnapshot = {
  recipientName: string;
  phone?: string;
  taxId?: string;
  postalCode: string;
  street: string;
  number: string;
  complement?: string;
  district: string;
  city: string;
  state: string;
  country: string;
};

export const productStatusEnum = pgEnum('product_status', [
  'draft',
  'active',
  'archived'
]);

export const stockMovementTypeEnum = pgEnum('stock_movement_type', [
  'purchase',
  'sale',
  'return',
  'adjustment',
  'reservation',
  'release',
  'loss',
  'transfer'
]);

export const cartStatusEnum = pgEnum('cart_status', [
  'active',
  'converted',
  'abandoned',
  'expired'
]);

export const discountTypeEnum = pgEnum('discount_type', [
  'percentage',
  'fixed_amount',
  'free_shipping'
]);

export const orderStatusEnum = pgEnum('order_status', [
  'pending',
  'paid',
  'processing',
  'shipped',
  'delivered',
  'canceled',
  'refunded'
]);

export const fulfillmentStatusEnum = pgEnum('fulfillment_status', [
  'unfulfilled',
  'partially_fulfilled',
  'fulfilled',
  'returned'
]);

export const addressTypeEnum = pgEnum('address_type', [
  'shipping',
  'billing',
  'both'
]);

export const paymentStatusEnum = pgEnum('payment_status', [
  'pending',
  'authorized',
  'paid',
  'failed',
  'canceled',
  'refunded',
  'partially_refunded',
  'chargeback'
]);

export const paymentMethodEnum = pgEnum('payment_method', [
  'credit_card',
  'debit_card',
  'pix',
  'boleto',
  'wallet',
  'bank_transfer',
  'store_credit'
]);

export const shipmentStatusEnum = pgEnum('shipment_status', [
  'pending',
  'label_created',
  'in_transit',
  'out_for_delivery',
  'delivered',
  'failed',
  'returned'
]);

export const reviewStatusEnum = pgEnum('review_status', [
  'pending',
  'approved',
  'rejected'
]);

const timestamps = {
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .$onUpdate(() => new Date())
    .defaultNow()
};

export const user = pgTable(
  'user',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    emailVerified: boolean('email_verified').default(false).notNull(),
    image: text('image'),
    username: text('username').unique(),
    displayUsername: text('display_username'),
    role: text('role'),
    banned: boolean('banned').default(false),
    banReason: text('ban_reason'),
    banExpires: timestamp('ban_expires', { withTimezone: true }),
    ...timestamps
  },
  t => [
    uniqueIndex('user_email_uidx').on(t.email),
    index('user_role_idx').on(t.role)
  ]
);

export const session = pgTable(
  'session',
  {
    id: text('id').primaryKey(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    token: text('token').notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    impersonatedBy: text('impersonated_by'),
    ...timestamps
  },
  table => [
    uniqueIndex('session_token_uidx').on(table.token),
    index('session_userId_idx').on(table.userId),
    index('session_expires_at_idx').on(table.expiresAt.desc())
  ]
);

export const account = pgTable(
  'account',
  {
    id: text('id').primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
    scope: text('scope'),
    password: text('password'),
    ...timestamps
  },
  table => [index('account_userId_idx').on(table.userId)]
);

export const verification = pgTable(
  'verification',
  {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    ...timestamps
  },
  table => [index('verification_identifier_idx').on(table.identifier)]
);

export const addresses = pgTable('addresses', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, {
      onDelete: 'cascade'
    }),
  type: addressTypeEnum('type').default('both').notNull(),
  label: text('label'),
  recipientName: text('recipient_name').notNull(),
  phone: text('phone'),
  taxId: text('tax_id'),
  postalCode: text('postal_code').notNull(),
  street: text('street').notNull(),
  number: text('text').notNull(),
  complement: text('complement'),
  district: text('district').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  country: text('country').default('BR').notNull(),
  reference: text('reference'),
  isDefaultShipping: boolean('is_default_shipping').default(false).notNull(),
  isDefaultBilling: boolean('is_default_billing').default(false).notNull(),
  ...timestamps
});

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
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    description: text('description'),
    imageUrl: text('image_url'),
    isActive: boolean('is_active').default(true).notNull(),
    ...timestamps
  },
  t => [uniqueIndex('categories_slug_uidx').on(t.slug)]
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
    categoryId: text('category_id').references(() => categories.id, {
      onDelete: 'set null'
    }),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    sku: text('sku').notNull(),
    description: text('description'),
    status: productStatusEnum('status').default('draft').notNull(),
    tags: text('tags')
      .array()
      .default(sql`ARRAY[]::text[]`)
      .notNull(),
    priceCents: integer('price_cents').notNull(),
    compareAtPriceCents: integer('compare_at_price_cents'),
    costCents: integer('cost_cents'),
    ratingAverage: numeric('rating_average', { precision: 3, scale: 2 })
      .default('0')
      .notNull(),
    ratingCount: integer('rating_count').default(0).notNull(),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
    ...timestamps
  },
  t => [
    uniqueIndex('products_slug_uidx').on(t.slug),
    index('products_status_idx').on(t.status),
    index('products_brand_idx').on(t.brandId),
    index('products_category_idx').on(t.categoryId),
    index('products_created_at_idx').on(t.createdAt)
  ]
);

export const productImage = pgTable(
  'product_images',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    productId: text('product_id')
      .notNull()
      .references(() => products.id, {
        onDelete: 'cascade'
      }),
    url: text('url').notNull(),
    alt: text('alt'),
    width: integer('width'),
    height: integer('height'),
    blurDataUrl: text('blur_data_url'),
    position: integer('position').default(0).notNull(),
    ...timestamps
  },
  t => [index('product_images_product_idx').on(t.productId, t.position)]
);

export const productToImages = pgTable(
  'product_to_images',
  {
    productId: text('product_id')
      .notNull()
      .references(() => products.id, {
        onDelete: 'cascade'
      }),
    imageId: text('image_id')
      .notNull()
      .references(() => productImage.id, { onDelete: 'cascade' })
  },
  t => [
    primaryKey({ columns: [t.productId, t.imageId] }),
    index('product_to_images_image_idx').on(t.imageId)
  ]
);

export const wishlists = pgTable('wishlists', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  name: text('name').default('Favoritos').notNull(),
  isPublic: boolean('is_public').default(false).notNull(),
  shareToken: text('share_token'),
  ...timestamps
});

export const wishlistItems = pgTable('wishlist_items', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  wishlistId: text('wishlist_id')
    .notNull()
    .references(() => wishlists.id, { onDelete: 'cascade' }),
  productId: text('product_id')
    .notNull()
    .references(() => products.id, { onDelete: 'cascade' }),
  note: text('note'),
  ...timestamps
});

export const reviews = pgTable('reviews', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, {
      onDelete: 'cascade'
    })
});

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account)
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, { fields: [session.userId], references: [user.id] })
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, { fields: [account.userId], references: [user.id] })
}));

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
export type Session = typeof session.$inferSelect;
export type Account = typeof account.$inferSelect;
