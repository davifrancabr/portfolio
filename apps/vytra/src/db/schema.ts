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
    primaryCategoryId: text('primary_category_id').references(
      () => categories.id,
      {
        onDelete: 'set null'
      }
    ),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    sku: text('sku').notNull(),
    description: text('description'),
    status: productStatusEnum('status').default('draft').notNull(),
    isDigital: boolean('is_digital').default(false).notNull(),
    requiresShipping: boolean('requires_shipping').default(true).notNull(),
    taxCode: text('tax_code'), //Código fiscal
    taxRate: numeric('tax_rate', { precision: 5, scale: 4 }), // Aliquota
    tags: text('tags')
      .array()
      .default(sql`ARRAY[]::text[]`)
      .notNull(),
    priceCents: integer('price_cents').notNull(),
    compareAtPriceCents: integer('compare_at_price_cents'),
    costCents: integer('cost_cents'),
    attributes: jsonb('attributes').$type<Record<string, string>>(),
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
    index('products_primary_category_idx').on(t.primaryCategoryId),
    index('products_created_at_idx').on(t.createdAt)
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
    url: text('url').notNull(),
    alt: text('alt'),
    width: integer('width'),
    height: integer('height'),
    /** Placeholder base64/blurhash para LQIP. */
    blurDataUrl: text('blur_data_url'),
    position: integer('position').default(0).notNull(),
    ...timestamps
  },
  t => [index('product_images_product_idx').on(t.productId, t.position)]
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

export const carts = pgTable(
  'carts',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    userId: text('user_id').references(() => user.id, {
      onDelete: 'cascade'
    }),
    status: cartStatusEnum('status').default('active').notNull(),
    currency: text('currency').default('BRL').notNull(),
    couponCode: text('coupon_code'),
    notes: text('notes'),
    expiresAt: timestamp('expires_at', { withTimezone: true }),
    ...timestamps
  },
  t => [
    index('carts_user_idx').on(t.userId),
    index('carts_status_idx').on(t.status)
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
    productId: text('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    quantity: integer('quantity').notNull(),
    unitPriceCents: integer('unit_price_cents').notNull(),
    compareAtPriceCents: integer('compare_at_price_cents'),
    ...timestamps
  },
  t => [
    uniqueIndex('cart_items_cart_product_idx').on(t.cartId, t.productId),
    index('cart_items_product_idx').on(t.productId)
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
    firstOrderOnly: boolean('first_order_only').default(true).notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    startsAt: timestamp('starts_at', { withTimezone: true }),
    endsAt: timestamp('ends_at', { withTimezone: true }),
    ...timestamps
  },
  t => [
    uniqueIndex('coupons_code_uidx').on(t.code),
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
    orderId: text('order_id').references(() => orders.id, {
      onDelete: 'set null'
    }),
    discountAppliedCents: integer('discount_applied_cents').notNull(),
    ...timestamps
  },
  t => [
    index('coupon_redemptions_coupon_user_idx').on(t.couponId, t.userId),
    index('coupon_redemptions_order_idx').on(t.orderId)
  ]
);

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
    note: text('note'),
    ...timestamps
  },
  t => [
    uniqueIndex('wishlist_items_uidx').on(t.wishlistId, t.productId),
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
    orderItemId: text('order_item_id').references(() => orderItems.id, {
      onDelete: 'set null'
    }),
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
    index('reviews_product_status_idx').on(t.productId, t.status),
    index('reviews_order_item_idx').on(t.orderItemId)
  ]
);

export const warehouses = pgTable(
  'warehouses',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    name: text('name').notNull(),
    code: text('code').notNull(),
    postalCode: text('postal_code'),
    city: text('city'),
    state: text('state'),
    country: text('country').default('BR').notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    /** Prioridade de alocação: menor número é escolhido primeiro. */
    priority: integer('priority').default(0).notNull(),
    ...timestamps
  },
  t => [uniqueIndex('warehouses_code_unique').on(t.code)]
);

export const inventoryItems = pgTable(
  'inventory_items',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    productId: text('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    warehouseId: text('warehouse_id')
      .notNull()
      .references(() => warehouses.id, { onDelete: 'cascade' }),

    /** Quantidade física no depósito. */
    quantity: integer('quantity').default(0).notNull(),
    /** Reservado por carrinhos/pedidos ainda não faturados. */
    reservedQuantity: integer('reserved_quantity').default(0).notNull(),
    /** Colchão que não deve ser vendido (buffer contra oversell). */
    safetyStock: integer('safety_stock').default(0).notNull(),
    /** Dispara alerta de reposição. */
    reorderPoint: integer('reorder_point').default(0).notNull(),
    binLocation: text('bin_location'),
    ...timestamps
  },
  t => [
    uniqueIndex('inventory_items_product_warehouse_unique').on(
      t.productId,
      t.warehouseId
    ),
    index('inventory_items_warehouse_idx').on(t.warehouseId)
  ]
);

export const stockMovements = pgTable(
  'stock_movements',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    inventoryItemId: text('inventory_item_id')
      .notNull()
      .references(() => inventoryItems.id, { onDelete: 'cascade' }),
    type: stockMovementTypeEnum('type').notNull(),
    /** Positivo = entrada, negativo = saída. */
    quantity: integer('quantity').notNull(),
    /** Saldo resultante após o movimento — facilita auditoria. */
    balanceAfter: integer('balance_after'),

    /** Origem do movimento: "order", "return", "manual", "import"... */
    referenceType: text('reference_type'),
    referenceId: text('reference_id'),
    note: text('note'),

    createdBy: text('created_by').references(() => user.id, {
      onDelete: 'set null'
    }),
    ...timestamps
  },
  t => [
    index('stock_movements_item_idx').on(t.inventoryItemId, t.createdAt),
    index('stock_movements_reference_idx').on(t.referenceType, t.referenceId)
  ]
);

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

    // --- snapshot ---
    productName: text('product_name').notNull(),
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
    index('order_items_product_idx').on(t.productId)
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
    isActive: boolean('is_active').default(true).notNull(),
    ...timestamps
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

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  addresses: many(addresses),
  carts: many(carts),
  orders: many(orders),
  wishlists: many(wishlists),
  reviews: many(reviews)
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, { fields: [session.userId], references: [user.id] })
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, { fields: [account.userId], references: [user.id] })
}));

export const brandsRelations = relations(brands, ({ many }) => ({
  products: many(products)
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
  productCategories: many(productCategories)
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  brand: one(brands, { fields: [products.brandId], references: [brands.id] }),
  primaryCategory: one(categories, {
    fields: [products.primaryCategoryId],
    references: [categories.id]
  }),
  images: many(productImages),
  productCategories: many(productCategories),
  reviews: many(reviews),
  inventoryItems: many(inventoryItems)
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

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id]
  })
}));

export const cartsRelations = relations(carts, ({ one, many }) => ({
  user: one(user, { fields: [carts.userId], references: [user.id] }),
  items: many(cartItems)
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, { fields: [cartItems.cartId], references: [carts.id] }),
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
    }),
    order: one(orders, {
      fields: [couponRedemptions.orderId],
      references: [orders.id]
    })
  })
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
  })
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id]
  }),
  user: one(user, { fields: [reviews.userId], references: [user.id] }),
  orderItem: one(orderItems, {
    fields: [reviews.orderItemId],
    references: [orderItems.id]
  })
}));

export const warehousesRelations = relations(warehouses, ({ many }) => ({
  inventoryItems: many(inventoryItems)
}));

export const inventoryItemsRelations = relations(
  inventoryItems,
  ({ one, many }) => ({
    product: one(products, {
      fields: [inventoryItems.productId],
      references: [products.id]
    }),
    warehouse: one(warehouses, {
      fields: [inventoryItems.warehouseId],
      references: [warehouses.id]
    }),
    movements: many(stockMovements)
  })
);

export const stockMovementsRelations = relations(stockMovements, ({ one }) => ({
  inventoryItem: one(inventoryItems, {
    fields: [stockMovements.inventoryItemId],
    references: [inventoryItems.id]
  }),
  createdByUser: one(user, {
    fields: [stockMovements.createdBy],
    references: [user.id]
  })
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(user, { fields: [orders.userId], references: [user.id] }),
  cart: one(carts, { fields: [orders.cartId], references: [carts.id] }),
  coupon: one(coupons, { fields: [orders.couponId], references: [coupons.id] }),
  items: many(orderItems),
  payments: many(payments),
  refunds: many(refunds),
  shipments: many(shipments),
  events: many(orderEvents),
  couponRedemptions: many(couponRedemptions)
}));

export const orderItemsRelations = relations(orderItems, ({ one, many }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id]
  }),
  shipmentItems: many(shipmentItems),
  reviews: many(reviews)
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

export const shippingMethodsRelations = relations(
  shippingMethods,
  ({ many }) => ({
    shipments: many(shipments)
  })
);

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

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
export type Session = typeof session.$inferSelect;
export type Account = typeof account.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type OrderEvent = typeof orderEvents.$inferSelect;
export type NewOrderEvent = typeof orderEvents.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;
export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
export type Shipment = typeof shipments.$inferSelect;
export type NewShipment = typeof shipments.$inferInsert;
export type InventoryItem = typeof inventoryItems.$inferSelect;
export type StockMovement = typeof stockMovements.$inferSelect;
export type Address = typeof addresses.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type Cart = typeof carts.$inferSelect;
export type NewCart = typeof carts.$inferInsert;
export type CartItem = typeof cartItems.$inferSelect;
export type Coupon = typeof coupons.$inferSelect;
export type NewCoupon = typeof coupons.$inferInsert;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type Brand = typeof brands.$inferSelect;
export type NewBrand = typeof brands.$inferInsert;
