import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import {
  boolean,
  index,
  integer,
  pgTable,
  smallint,
  text,
  timestamp,
  uniqueIndex
} from 'drizzle-orm/pg-core';
import { user } from './auth';
import { products, productVariants } from './catalog';
import { addressTypeEnum, reviewStatusEnum } from './enum';

const timestamps = {
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .$onUpdate(() => new Date())
    .defaultNow()
};

export const addresses = pgTable(
  'addresses',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    type: addressTypeEnum('type').default('both').notNull(),
    label: text('label'),
    recipientName: text('recipient_name').notNull(),
    phone: text('phone'),
    taxId: text('tax_id'),
    postalCode: text('postal_code').notNull(),
    street: text('street').notNull(),
    number: text('number').notNull(),
    complement: text('complement'),
    district: text('district').notNull(),
    city: text('city').notNull(),
    state: text('state').notNull(),
    country: text('country').default('BR').notNull(),
    reference: text('reference'),
    isDefaultShipping: boolean('is_default_shipping').default(false).notNull(),
    isDefaultBilling: boolean('is_default_billing').default(false).notNull(),
    ...timestamps
  },
  t => [
    index('addresses_user_idx').on(t.userId),
    index('addresses_postal_code_idx').on(t.postalCode)
  ]
);

export const wishlists = pgTable(
  'wishlists',
  {
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
  },
  t => [
    index('wishlists_user_idx').on(t.userId),
    uniqueIndex('wishlists_share_token_unique').on(t.shareToken)
  ]
);

export const wishlistItems = pgTable(
  'wishlist_items',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    wishlistId: text('wishlist_id')
      .notNull()
      .references(() => wishlists.id, { onDelete: 'cascade' }),
    productId: text('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    variantId: text('variant_id').references(() => productVariants.id, {
      onDelete: 'cascade'
    }),
    note: text('note'),
    ...timestamps
  },
  t => [
    uniqueIndex('wishlist_items_unique').on(
      t.wishlistId,
      t.productId,
      t.variantId
    ),
    index('wishlist_items_product_idx').on(t.productId)
  ]
);

export const reviews = pgTable(
  'reviews',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    productId: text('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    /** Referência ao item do pedido — prova de compra verificada. */
    orderItemId: text('order_item_id'),
    rating: smallint('rating').notNull(), // 1..5 (valide com CHECK)
    title: text('title'),
    body: text('body'),
    status: reviewStatusEnum('status').default('pending').notNull(),
    isVerifiedPurchase: boolean('is_verified_purchase')
      .default(false)
      .notNull(),
    helpfulCount: integer('helpful_count').default(0).notNull(),
    /** Resposta da loja. */
    reply: text('reply'),
    repliedAt: timestamp('replied_at', { withTimezone: true }),
    ...timestamps
  },
  t => [
    uniqueIndex('reviews_user_product_unique').on(t.userId, t.productId),
    index('reviews_product_status_idx').on(t.productId, t.status)
  ]
);

export const addressesRelations = relations(addresses, ({ one }) => ({
  user: one(user, { fields: [addresses.userId], references: [user.id] })
}));

export const wishlistsRelations = relations(wishlists, ({ one, many }) => ({
  user: one(user, { fields: [wishlists.userId], references: [user.id] }),
  items: many(wishlistItems)
}));

export const wishlistItemsRelations = relations(wishlistItems, ({ one }) => ({
  wishlist: one(wishlists, {
    fields: [wishlistItems.wishlistId],
    references: [wishlists.id]
  }),
  product: one(products, {
    fields: [wishlistItems.productId],
    references: [products.id]
  }),
  variant: one(productVariants, {
    fields: [wishlistItems.variantId],
    references: [productVariants.id]
  })
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id]
  }),
  user: one(user, { fields: [reviews.userId], references: [user.id] })
}));

export type Address = typeof addresses.$inferSelect;
export type Review = typeof reviews.$inferSelect;
