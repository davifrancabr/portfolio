import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import {
  index,
  integer,
  jsonb,
  pgTable,
  smallint,
  text,
  timestamp,
  uniqueIndex
} from 'drizzle-orm/pg-core';
import { user } from './auth';
import { products, productVariants } from './catalog';
import { carts, coupons } from './checkout';
import {
  fulfillmentStatusEnum,
  orderStatusEnum,
  paymentMethodEnum,
  paymentStatusEnum,
  shipmentStatusEnum
} from './enum';

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

const timestamps = {
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .$onUpdate(() => new Date())
    .defaultNow()
};

export const orders = pgTable(
  'orders',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    /** Número legível exibido ao cliente, ex.: "2026-000451". */
    orderNumber: text('order_number').notNull(),

    userId: text('user_id').references(() => user.id, { onDelete: 'set null' }),
    cartId: text('cart_id').references(() => carts.id, {
      onDelete: 'set null'
    }),
    /** Sempre preenchido, inclusive em guest checkout. */
    email: text('email').notNull(),
    phone: text('phone'),

    status: orderStatusEnum('status').default('pending').notNull(),
    paymentStatus: paymentStatusEnum('payment_status')
      .default('pending')
      .notNull(),
    fulfillmentStatus: fulfillmentStatusEnum('fulfillment_status')
      .default('unfulfilled')
      .notNull(),

    currency: text('currency').default('BRL').notNull(),
    /** Soma dos itens, sem frete/desconto/imposto. */
    subtotalCents: integer('subtotal_cents').notNull(),
    discountCents: integer('discount_cents').default(0).notNull(),
    shippingCents: integer('shipping_cents').default(0).notNull(),
    taxCents: integer('tax_cents').default(0).notNull(),
    /** subtotal - desconto + frete + imposto. */
    totalCents: integer('total_cents').notNull(),
    refundedCents: integer('refunded_cents').default(0).notNull(),

    couponId: text('coupon_id').references(() => coupons.id, {
      onDelete: 'set null'
    }),
    couponCode: text('coupon_code'),

    /** Snapshots congelados no momento da compra. */
    shippingAddress: jsonb('shipping_address').$type<AddressSnapshot>(),
    billingAddress: jsonb('billing_address').$type<AddressSnapshot>(),

    customerNote: text('customer_note'),
    internalNote: text('internal_note'),
    cancelReason: text('cancel_reason'),
    metadata: jsonb('metadata').$type<Record<string, unknown>>(),

    placedAt: timestamp('placed_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    paidAt: timestamp('paid_at', { withTimezone: true }),
    shippedAt: timestamp('shipped_at', { withTimezone: true }),
    deliveredAt: timestamp('delivered_at', { withTimezone: true }),
    canceledAt: timestamp('canceled_at', { withTimezone: true }),
    ...timestamps
  },
  t => [
    uniqueIndex('orders_number_unique').on(t.orderNumber),
    index('orders_user_idx').on(t.userId, t.createdAt),
    index('orders_status_idx').on(t.status),
    index('orders_email_idx').on(t.email),
    index('orders_created_at_idx').on(t.createdAt)
  ]
);

export const orderItems = pgTable(
  'order_items',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    orderId: text('order_id')
      .notNull()
      .references(() => orders.id, { onDelete: 'cascade' }),

    // Referências "melhor esforço" — podem virar null se o catálogo mudar.
    productId: text('product_id').references(() => products.id, {
      onDelete: 'set null'
    }),
    variantId: text('variant_id').references(() => productVariants.id, {
      onDelete: 'set null'
    }),

    // --- snapshot ---
    productName: text('product_name').notNull(),
    variantName: text('variant_name'),
    sku: text('sku').notNull(),
    imageUrl: text('image_url'),
    /** Opções escolhidas: { "Cor": "Azul", "Tamanho": "M" } */
    optionsSnapshot: jsonb('options_snapshot').$type<Record<string, string>>(),

    quantity: integer('quantity').notNull(),
    unitPriceCents: integer('unit_price_cents').notNull(),
    discountCents: integer('discount_cents').default(0).notNull(),
    taxCents: integer('tax_cents').default(0).notNull(),
    /** quantity * unitPrice - discount + tax. */
    totalCents: integer('total_cents').notNull(),

    fulfilledQuantity: integer('fulfilled_quantity').default(0).notNull(),
    refundedQuantity: integer('refunded_quantity').default(0).notNull(),

    ...timestamps
  },
  t => [
    index('order_items_order_idx').on(t.orderId),
    index('order_items_variant_idx').on(t.variantId)
  ]
);

export const payments = pgTable(
  'payments',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    orderId: text('order_id')
      .notNull()
      .references(() => orders.id, { onDelete: 'cascade' }),

    method: paymentMethodEnum('method').notNull(),
    status: paymentStatusEnum('status').default('pending').notNull(),
    amountCents: integer('amount_cents').notNull(),
    currency: text('currency').default('BRL').notNull(),

    /** "stripe" | "mercadopago" | "pagarme" | "asaas" ... */
    provider: text('provider').notNull(),
    /** ID da transação no gateway — use para idempotência com webhooks. */
    providerTransactionId: text('provider_transaction_id'),

    installments: smallint('installments').default(1).notNull(),
    /** Cartão: bandeira e 4 últimos dígitos. NUNCA guarde o PAN completo. */
    cardBrand: text('card_brand'),
    cardLast4: text('card_last4'),
    /** Pix: copia-e-cola e QR. Boleto: linha digitável e URL do PDF. */
    pixQrCode: text('pix_qr_code'),
    boletoBarcode: text('boleto_barcode'),
    boletoUrl: text('boleto_url'),
    dueAt: timestamp('due_at', { withTimezone: true }),

    failureCode: text('failure_code'),
    failureMessage: text('failure_message'),
    /** Payload bruto do webhook, para auditoria. */
    rawResponse: jsonb('raw_response'),

    authorizedAt: timestamp('authorized_at', { withTimezone: true }),
    paidAt: timestamp('paid_at', { withTimezone: true }),
    ...timestamps
  },
  t => [
    index('payments_order_idx').on(t.orderId),
    uniqueIndex('payments_provider_transaction_unique').on(
      t.provider,
      t.providerTransactionId
    ),
    index('payments_status_idx').on(t.status)
  ]
);

export const refunds = pgTable(
  'refunds',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    orderId: text('order_id')
      .notNull()
      .references(() => orders.id, { onDelete: 'cascade' }),
    paymentId: text('payment_id').references(() => payments.id, {
      onDelete: 'set null'
    }),
    amountCents: integer('amount_cents').notNull(),
    reason: text('reason'),
    status: paymentStatusEnum('status').default('pending').notNull(),
    providerRefundId: text('provider_refund_id'),
    createdBy: text('created_by').references(() => user.id, {
      onDelete: 'set null'
    }),
    ...timestamps
  },
  t => [index('refunds_order_idx').on(t.orderId)]
);

export const shippingMethods = pgTable(
  'shipping_methods',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    name: text('name').notNull(), // "PAC", "Sedex", "Retirada na loja"
    carrier: text('carrier'), // "correios", "jadlog", "loggi"
    code: text('code').notNull(),
    basePriceCents: integer('base_price_cents').default(0).notNull(),
    /** Frete grátis acima deste subtotal. Null = nunca. */
    freeAboveCents: integer('free_above_cents'),
    minDays: smallint('min_days'),
    maxDays: smallint('max_days'),
    isActive: integer('is_active').default(1).notNull()
  },
  t => [uniqueIndex('shipping_methods_code_unique').on(t.code)]
);

export const shipments = pgTable(
  'shipments',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    orderId: text('order_id')
      .notNull()
      .references(() => orders.id, { onDelete: 'cascade' }),
    shippingMethodId: text('shipping_method_id').references(
      () => shippingMethods.id,
      { onDelete: 'set null' }
    ),

    status: shipmentStatusEnum('status').default('pending').notNull(),
    carrier: text('carrier'),
    trackingCode: text('tracking_code'),
    trackingUrl: text('tracking_url'),
    labelUrl: text('label_url'),
    costCents: integer('cost_cents').default(0).notNull(),
    weightGrams: integer('weight_grams'),
    estimatedDeliveryAt: timestamp('estimated_delivery_at', {
      withTimezone: true
    }),
    shippedAt: timestamp('shipped_at', { withTimezone: true }),
    deliveredAt: timestamp('delivered_at', { withTimezone: true }),
    ...timestamps
  },
  t => [
    index('shipments_order_idx').on(t.orderId),
    index('shipments_tracking_idx').on(t.trackingCode)
  ]
);

/** Quais itens (e quantas unidades) foram em cada remessa. */
export const shipmentItems = pgTable(
  'shipment_items',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    shipmentId: text('shipment_id')
      .notNull()
      .references(() => shipments.id, { onDelete: 'cascade' }),
    orderItemId: text('order_item_id')
      .notNull()
      .references(() => orderItems.id, { onDelete: 'cascade' }),
    quantity: integer('quantity').notNull()
  },
  t => [uniqueIndex('shipment_items_unique').on(t.shipmentId, t.orderItemId)]
);

export const orderEvents = pgTable(
  'order_events',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    orderId: text('order_id')
      .notNull()
      .references(() => orders.id, { onDelete: 'cascade' }),
    /** "status_changed" | "payment_received" | "note_added" ... */
    type: text('type').notNull(),
    fromStatus: text('from_status'),
    toStatus: text('to_status'),
    message: text('message'),
    payload: jsonb('payload').$type<Record<string, unknown>>(),
    /** Null quando o evento veio de webhook/sistema. */
    actorId: text('actor_id').references(() => user.id, {
      onDelete: 'set null'
    }),
    ...timestamps
  },
  t => [index('order_events_order_idx').on(t.orderId, t.createdAt)]
);

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(user, { fields: [orders.userId], references: [user.id] }),
  cart: one(carts, { fields: [orders.cartId], references: [carts.id] }),
  coupon: one(coupons, { fields: [orders.couponId], references: [coupons.id] }),
  items: many(orderItems),
  payments: many(payments),
  refunds: many(refunds),
  shipments: many(shipments),
  events: many(orderEvents)
}));

export const orderItemsRelations = relations(orderItems, ({ one, many }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id]
  }),
  variant: one(productVariants, {
    fields: [orderItems.variantId],
    references: [productVariants.id]
  }),
  shipmentItems: many(shipmentItems)
}));

export const paymentsRelations = relations(payments, ({ one, many }) => ({
  order: one(orders, { fields: [payments.orderId], references: [orders.id] }),
  refunds: many(refunds)
}));

export const refundsRelations = relations(refunds, ({ one }) => ({
  order: one(orders, { fields: [refunds.orderId], references: [orders.id] }),
  payment: one(payments, {
    fields: [refunds.paymentId],
    references: [payments.id]
  })
}));

export const shipmentsRelations = relations(shipments, ({ one, many }) => ({
  order: one(orders, { fields: [shipments.orderId], references: [orders.id] }),
  method: one(shippingMethods, {
    fields: [shipments.shippingMethodId],
    references: [shippingMethods.id]
  }),
  items: many(shipmentItems)
}));

export const shipmentItemsRelations = relations(shipmentItems, ({ one }) => ({
  shipment: one(shipments, {
    fields: [shipmentItems.shipmentId],
    references: [shipments.id]
  }),
  orderItem: one(orderItems, {
    fields: [shipmentItems.orderItemId],
    references: [orderItems.id]
  })
}));

export const orderEventsRelations = relations(orderEvents, ({ one }) => ({
  order: one(orders, {
    fields: [orderEvents.orderId],
    references: [orders.id]
  }),
  actor: one(user, { fields: [orderEvents.actorId], references: [user.id] })
}));

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;
export type Payment = typeof payments.$inferSelect;
export type Shipment = typeof shipments.$inferSelect;
