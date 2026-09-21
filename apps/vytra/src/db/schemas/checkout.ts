import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex
} from 'drizzle-orm/pg-core';
import { user } from './auth';
import { products, productVariants } from './catalog';
import { cartStatusEnum, discountTypeEnum } from './enum';

const timestamps = {
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .$onUpdate(() => new Date())
    .defaultNow()
};

export const carts = pgTable(
  'carts',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    userId: text('user_id').references(() => user.id, {
      onDelete: 'cascade'
    }),
    guestToken: text('guest_token'),
    status: cartStatusEnum('status').default('active').notNull(),
    currency: text('currency').default('BRL').notNull(),
    email: text('email'),
    couponCode: text('coupon_code'),
    notes: text('notes'),
    metadata: jsonb('metadata').$type<Record<string, string>>(),
    expiresAt: timestamp('expires_at', { withTimezone: true }),
    ...timestamps
  },
  t => [
    index('carts_user_idx').on(t.userId),
    uniqueIndex('carts_guest_token_uidx').on(t.guestToken),
    index('carts_status_idx').on(t.status, t.updatedAt)
  ]
);

export const cartItems = pgTable(
  'cart_items',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    cartId: text('cart_id')
      .notNull()
      .references(() => carts.id, {
        onDelete: 'cascade'
      }),
    variantId: text('variant_id')
      .notNull()
      .references(() => productVariants.id, {
        onDelete: 'cascade'
      }),
    productId: text('product_id')
      .notNull()
      .references(() => products.id, {
        onDelete: 'cascade'
      }),
    quantity: integer('quantity').notNull(),
    unitPriceCents: integer('unit_price_cents').notNull(),
    compareAtPriceCents: integer('compare_at_price_cents'),
    ...timestamps
  },
  t => [
    uniqueIndex('cart_items_cart_variant_uidx').on(t.cartId, t.variantId),
    index('cart_items_variant_idx').on(t.variantId)
  ]
);

export const coupons = pgTable(
  'coupons',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    code: text('code').notNull(),
    description: text('description'),
    discountType: discountTypeEnum('discount_type').notNull(),
    discountValue: integer('discount_value').notNull(),
    maxDiscountCents: integer('max_discount_cents'),
    minSubtotalCents: integer('min_subtotal_cents').default(0).notNull(),
    maxRedemptions: integer('max_redemptions'),
    maxRedemptionsPerUser: integer('max_redemptions_per_user').default(1),
    redemptionCount: integer('redemption_count').default(0).notNull(),
    appliesToProductIds: text('applies_to_product_ids').array(),
    appliesToCategoryIds: text('applies_to_category_ids').array(),
    firstOrderOnly: boolean('first_order_only').default(false).notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    startsAt: timestamp('starts_at', { withTimezone: true }),
    endsAt: timestamp('ends_at', { withTimezone: true }),
    ...timestamps
  },
  t => [
    uniqueIndex('coupons_code_unique').on(t.code),
    index('coupons_active_idx').on(t.isActive, t.endsAt)
  ]
);

export const couponRedemptions = pgTable(
  'coupon_redemptions',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    couponId: text('coupon_id')
      .notNull()
      .references(() => coupons.id, { onDelete: 'cascade' }),
    userId: text('user_id').references(() => user.id, { onDelete: 'set null' }),
    /** FK lógica para orders.id (definida em order.ts para evitar ciclo). */
    orderId: text('order_id'),
    discountAppliedCents: integer('discount_applied_cents').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull()
  },
  t => [
    index('coupon_redemptions_coupon_user_idx').on(t.couponId, t.userId),
    index('coupon_redemptions_order_idx').on(t.orderId)
  ]
);

export const cartsRelations = relations(carts, ({ one, many }) => ({
  user: one(user, { fields: [carts.userId], references: [user.id] }),
  items: many(cartItems)
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, { fields: [cartItems.cartId], references: [carts.id] }),
  variant: one(productVariants, {
    fields: [cartItems.variantId],
    references: [productVariants.id]
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id]
  })
}));

export const couponsRelations = relations(coupons, ({ many }) => ({
  redemptions: many(couponRedemptions)
}));

export const couponRedemptionsRelations = relations(
  couponRedemptions,
  ({ one }) => ({
    coupon: one(coupons, {
      fields: [couponRedemptions.couponId],
      references: [coupons.id]
    }),
    user: one(user, {
      fields: [couponRedemptions.userId],
      references: [user.id]
    })
  })
);

export type Cart = typeof carts.$inferSelect;
export type CartItem = typeof cartItems.$inferSelect;
export type Coupon = typeof coupons.$inferSelect;
