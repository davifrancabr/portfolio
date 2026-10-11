import z from 'zod';

export const productStatusEnum = z.enum(['draft', 'active', 'archived']);

export const stockMovementTypeEnum = z.enum([
  'purchase',
  'sale',
  'return',
  'adjustment',
  'reservation',
  'release',
  'loss',
  'transfer'
]);

export const cartStatusEnum = z.enum([
  'active',
  'converted',
  'abandoned',
  'expired'
]);

export const discountTypeEnum = z.enum([
  'percentage',
  'fixed_amount',
  'free_shipping'
]);

export const orderStatusEnum = z.enum([
  'pending',
  'paid',
  'processing',
  'shipped',
  'delivered',
  'canceled',
  'refunded'
]);

export const fulfillmentStatusEnum = z.enum([
  'unfulfilled',
  'partially_fulfilled',
  'fulfilled',
  'returned'
]);

export const addressTypeEnum = z.enum(['shipping', 'billing', 'both']);

export const paymentStatusEnum = z.enum([
  'pending',
  'authorized',
  'paid',
  'failed',
  'canceled',
  'refunded',
  'partially_refunded',
  'chargeback'
]);

export const paymentMethodEnum = z.enum([
  'credit_card',
  'debit_card',
  'pix',
  'boleto',
  'wallet',
  'bank_transfer',
  'store_credit'
]);

export const shipmentStatusEnum = z.enum([
  'pending',
  'label_created',
  'in_transit',
  'out_for_delivery',
  'delivered',
  'failed',
  'returned'
]);

export const reviewStatusEnum = z.enum(['pending', 'approved', 'rejected']);

const timestamps = {
  createdAt: z.iso.datetime().nonempty(),
  updatedAt: z.iso.datetime().nonempty()
};

export const userSchema = z.object({
  id: z.cuid2().nonempty(),
  name: z.string().nonempty(),
  email: z.email(),
  image: z.url(),
  username: z.string(),
  ...timestamps
});

export const createUserSchema = userSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const brandsSchema = z.object({
  id: z.cuid2().nonempty(),
  name: z.string().nonempty(),
  slug: z.string().nonempty(),
  description: z.string().optional(),
  logoUrl: z.url().optional(),
  isActive: z.boolean().default(true),
  ...timestamps
});

export const createBrandsSchema = brandsSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const categoriesSchema = z.object({
  id: z.cuid2().nonempty(),
  name: z.string().nonempty(),
  slug: z.string().nonempty(),
  description: z.string(),
  imageUrl: z.url(),
  isActive: z.boolean(),
  ...timestamps
});

export const createCategorySchema = categoriesSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const productsSchema = z.object({
  id: z.cuid2().nonempty(),
  brandId: z.cuid2(),
  primaryCategoryId: z.cuid2(),
  name: z.string().nonempty(),
  slug: z.string().nonempty(),
  sku: z.string().nonempty(),
  description: z.string(),
  status: productStatusEnum.default('draft').nonoptional(),
  isDigital: z.boolean().default(false).nonoptional(),
  requiresShipping: z.boolean().default(true).nonoptional(),
  taxCode: z.string(), //Código fiscal
  taxRate: z.number(), // Aliquota
  tags: z.array(z.string().nonempty()).nonempty(),
  priceCents: z.number().int().nonnegative(),
  compareAtPriceCents: z.number().int(),
  costCents: z.number().int(),
  attributes: z.json(),
  ratingAverage: z.number().default(0).nonoptional(),
  ratingCount: z.number().int().default(0).nonoptional(),
  publishedAt: z.iso.datetime(),
  deletedAt: z.iso.datetime(),
  ...timestamps
});

export const createProductSchema = productsSchema.omit({
  id: true,
  deletedAt: true,
  createdAt: true,
  updatedAt: true
});

export const productImagesSchema = z.object({
  id: z.cuid2().nonempty(),
  productId: z.cuid2().nonempty(),
  url: z.url().nonempty(),
  alt: z.string(),
  width: z.number().int(),
  height: z.number().int(),
  /** Placeholder base64/blurhash para LQIP. */
  blurDataUrl: z.url(),
  position: z.number().int().default(0).nonoptional(),
  ...timestamps
});

export const productCategoriesSchema = z.object({
  productId: z.cuid2().nonempty(),
  categoryId: z.cuid2().nonempty()
});

export const cartsSchema = z.object({
  id: z.cuid2().nonempty(),
  userId: z.cuid2(),
  status: cartStatusEnum.default('active').nonoptional(),
  currency: z.currencyCode().default('BRL').nonoptional(),
  couponCode: z.string(),
  notes: z.string(),
  expiresAt: z.iso.datetime(),
  ...timestamps
});

export const createCartSchema = cartsSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const cartItemsSchema = z.object({
  id: z.cuid2().nonempty(),
  cartId: z.cuid2().nonempty(),
  productId: z.cuid2().nonempty(),
  quantity: z.number().int().nonoptional(),
  unitPriceCents: z.number().int().nonoptional(),
  compareAtPriceCents: z.number().int(),
  ...timestamps
});

export const couponsSchema = z.object({
  id: z.cuid2().nonempty(),
  code: z.string().nonempty(),
  description: z.string(),
  discountType: discountTypeEnum,
  discountValue: z.number().int(),
  maxDiscountCents: z.number().int(),
  minSubtotalCents: z.number().int().default(0),
  maxRedemptions: z.number().int(),
  maxRedemptionsPerUser: z.number().int().default(1),
  redemptionCount: z.number().int().default(0),
  appliesToProductIds: z.array(z.cuid2()).optional(),
  appliesToCategoryIds: z.array(z.cuid2()).optional(),
  firstOrderOnly: z.boolean(),
  isActive: z.boolean().default(true),
  startsAt: z.iso.datetime(),
  endsAt: z.iso.datetime(),
  ...timestamps
});

export const createCouponsSchema = couponsSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const couponRedemptionsSchema = z.object({
  id: z.cuid2().nonempty(),
  couponId: z.cuid2().nonempty(),
  userId: z.cuid2(),
  orderId: z.cuid2(),
  discountAppliedCents: z.number().int().nonoptional(),
  ...timestamps
});

export const addressesSchema = z.object({
  id: z.cuid2().nonempty(),
  userId: z.cuid2().nonempty(),
  type: addressTypeEnum.default('both').nonoptional(),
  label: z.string(),
  recipientName: z.string().nonempty(),
  phone: z.string(),
  taxId: z.cuid2(),
  postalCode: z.string().nonempty(),
  street: z.string().nonempty(),
  number: z.string().nonempty(),
  complement: z.string(),
  district: z.string().nonempty(),
  city: z.string().nonempty(),
  state: z.string().nonempty(),
  country: z.string().nonempty().default('BR'),
  reference: z.string(),
  isDefaultShipping: z.boolean().default(false).nonoptional(),
  isDefaultBilling: z.boolean().default(false).nonoptional(),
  ...timestamps
});

export const addressSnapshotSchema = z.object({
  recipientName: z.string(),
  phone: z.string().optional(),
  taxId: z.string().optional(),
  postalCode: z.string(),
  street: z.string(),
  number: z.string(),
  complement: z.string().optional(),
  district: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string()
});

export const wishlistsSchema = z.object({
  id: z.cuid2().nonempty(),
  userId: z.cuid2().nonempty(),
  name: z.string().default('Favoritos'),
  isPublic: z.boolean().default(false).nonoptional(),
  shareToken: z.string(),
  ...timestamps
});

export const createWishlistSchema = wishlistsSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const wishlistItemsSchema = z.object({
  id: z.cuid2().nonempty(),
  wishlistId: z.cuid2().nonempty(),
  productId: z.cuid2().nonempty(),
  note: z.string(),
  ...timestamps
});

export const reviewsSchema = z.object({
  id: z.cuid2().nonempty(),
  productId: z.cuid2().nonempty(),
  userId: z.cuid2().nonempty(),
  /** Referência ao item do pedido — prova de compra verificada. */
  orderItemId: z.cuid2(),
  rating: z.number().int().nonoptional(), // 1..5 (valide com CHECK)
  title: z.string(),
  body: z.string(),
  status: reviewStatusEnum.default('pending').nonoptional(),
  isVerifiedPurchase: z.boolean().default(false).nonoptional(),
  helpfulCount: z.number().int().default(0).nonoptional(),
  /** Resposta da loja. */
  reply: z.string(),
  repliedAt: z.iso.datetime,
  ...timestamps
});

export const createReviewSchema = reviewsSchema.omit({
  id: true,
  repliedAt: true,
  reply: true,
  createdAt: true,
  updatedAt: true
});

export const warehousesSchema = z.object({
  id: z.cuid2().nonempty(),
  name: z.string().nonempty(),
  code: z.string().nonempty(),
  postalCode: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string().default('BR').nonoptional(),
  isActive: z.boolean(),
  /** Prioridade de alocação: menor número é escolhido primeiro. */
  priority: z.number().int().default(0).nonoptional(),
  ...timestamps
});

export const createWarehouseSchema = warehousesSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const inventoryItemsSchema = z.object({
  id: z.cuid2().nonempty(),
  productId: z.cuid2().nonempty(),
  warehouseId: z.cuid2().nonempty(),

  /** Quantidade física no depósito. */
  quantity: z.number().int().default(0).nonoptional(),
  /** Reservado por carrinhos/pedidos ainda não faturados. */
  reservedQuantity: z.number().int().default(0).nonoptional(),
  /** Colchão que não deve ser vendido (buffer contra oversell). */
  safetyStock: z.number().int().default(0).nonoptional(),
  /** Dispara alerta de reposição. */
  reorderPoint: z.number().int().default(0).nonoptional(),
  binLocation: z.string(),
  ...timestamps
});

export const stockMovementsSchema = z.object({
  id: z.cuid2().nonempty(),
  inventoryItemId: z.cuid2().nonempty(),
  type: stockMovementTypeEnum.nonoptional(),
  /** Positivo = entrada, negativo = saída. */
  quantity: z.number().int().nonoptional(),
  /** Saldo resultante após o movimento — facilita auditoria. */
  balanceAfter: z.number().int(),

  /** Origem do movimento: "order", "return", "manual", "import"... */
  referenceType: z.string(),
  referenceId: z.cuid2(),
  note: z.string(),

  createdBy: z.cuid2(),
  ...timestamps
});

export const ordersSchema = z.object({
  id: z.cuid2().nonempty(),
  /** Número legível exibido ao cliente, ex.: "2026-000451". */
  orderNumber: z.string().nonempty(),

  userId: z.cuid2(),
  cartId: z.cuid2(),
  /** Sempre preenchido, inclusive em guest checkout. */
  email: z.email(),
  phone: z.string(),

  status: orderStatusEnum.default('pending').nonoptional(),
  paymentStatus: paymentStatusEnum.default('pending').nonoptional(),
  fulfillmentStatus: fulfillmentStatusEnum.default('unfulfilled').nonoptional(),

  currency: z.currencyCode().default('BRL').nonoptional(),
  /** Soma dos itens, sem frete/desconto/imposto. */
  subtotalCents: z.number().int().nonoptional(),
  discountCents: z.number().int().default(0).nonoptional(),
  shippingCents: z.number().int().default(0).nonoptional(),
  taxCents: z.number().int().default(0).nonoptional(),
  /** subtotal - desconto + frete + imposto. */
  totalCents: z.number().int().nonoptional(),
  refundedCents: z.number().int().default(0).nonoptional(),

  couponId: z.cuid2(),
  couponCode: z.string(),

  /** Snapshots congelados no momento da compra. */
  shippingAddress: addressSnapshotSchema.optional(),
  billingAddress: addressSnapshotSchema.optional(),

  customerNote: z.string(),
  internalNote: z.string(),
  cancelReason: z.string(),
  metadata: z.record(z.string(), z.unknown()).optional(),

  placedAt: z.iso.datetime().nonoptional(),
  paidAt: z.iso.datetime(),
  shippedAt: z.iso.datetime(),
  deliveredAt: z.iso.datetime(),
  canceledAt: z.iso.datetime(),
  ...timestamps
});

export const createOrderSchema = ordersSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const orderItemsSchema = z.object({
  id: z.cuid2().nonempty(),
  orderId: z.cuid2().nonempty(),
  // Referências "melhor esforço" — podem virar null se o catálogo mudar.
  productId: z.cuid2(),

  // --- snapshot ---
  productName: z.string().nonempty(),
  sku: z.string().nonempty(),
  imageUrl: z.url(),
  /** Opções escolhidas: { "Cor": "Azul", "Tamanho": "M" } */
  optionsSnapshot: z.json(),

  quantity: z.number().int().nonoptional(),
  unitPriceCents: z.number().int().nonoptional(),
  discountCents: z.number().int().default(0).nonoptional(),
  taxCents: z.number().int().default(0).nonoptional(),
  /** quantity * unitPrice - discount + tax. */
  totalCents: z.number().int().nonoptional(),

  fulfilledQuantity: z.number().int().default(0).nonoptional(),
  refundedQuantity: z.number().int().default(0).nonoptional(),

  ...timestamps
});

export const paymentsSchema = z.object({
  id: z.cuid2().nonempty(),
  orderId: z.cuid2().nonempty(),
  method: paymentMethodEnum.nonoptional(),
  status: paymentStatusEnum.default('pending').nonoptional(),
  amountCents: z.number().int().nonoptional(),
  currency: z.currencyCode().default('BRL').nonoptional(),

  /** "stripe" | "mercadopago" | "pagarme" | "asaas" ... */
  provider: z.string().nonempty(),
  /** ID da transação no gateway — use para idempotência com webhooks. */
  providerTransactionId: z.cuid2(),

  installments: z.number().int().nonoptional(),
  /** Cartão: bandeira e 4 últimos dígitos. NUNCA guarde o PAN completo. */
  cardBrand: z.string(),
  cardLast4: z.string(),
  /** Pix: copia-e-cola e QR. Boleto: linha digitável e URL do PDF. */
  pixQrCode: z.string(),
  boletoBarcode: z.string(),
  boletoUrl: z.url(),
  dueAt: z.iso.datetime(),

  failureCode: z.string(),
  failureMessage: z.string(),
  /** Payload bruto do webhook, para auditoria. */
  rawResponse: z.json(),

  authorizedAt: z.iso.datetime(),
  paidAt: z.iso.datetime(),
  ...timestamps
});

export const createPaymentSchema = paymentsSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const refundsSchema = z.object({
  id: z.cuid2().nonempty(),
  orderId: z.cuid2().nonempty(),
  paymentId: z.cuid2(),
  amountCents: z.number().int().nonoptional(),
  reason: z.string(),
  status: paymentStatusEnum.default('pending').nonoptional(),
  providerRefundId: z.cuid2(),
  createdBy: z.cuid2(),
  ...timestamps
});

export const createRefundSchema = refundsSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const shippingMethodsSchema = z.object({
  id: z.cuid2().nonempty(),
  name: z.string().nonempty(), // "PAC", "Sedex", "Retirada na loja"
  carrier: z.string(), // "correios", "jadlog", "loggi"
  code: z.string().nonempty(),
  basePriceCents: z.number().int().default(0).nonoptional(),
  /** Frete grátis acima deste subtotal. Null = nunca. */
  freeAboveCents: z.number().int(),
  minDays: z.number().int(),
  maxDays: z.number().int(),
  isActive: z.boolean().default(true).nonoptional(),
  ...timestamps
});

export const createShipmentMethodSchema = shippingMethodsSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const shipmentsSchema = z.object({
  id: z.cuid2().nonempty(),
  orderId: z.cuid2().nonempty(),
  shippingMethodId: z.cuid2(),
  status: shipmentStatusEnum.default('pending').nonoptional(),
  carrier: z.string(),
  trackingCode: z.string(),
  trackingUrl: z.url(),
  labelUrl: z.url(),
  costCents: z.number().int().default(0).nonoptional(),
  weightGrams: z.number().int(),
  estimatedDeliveryAt: z.iso.datetime(),
  shippedAt: z.iso.datetime(),
  deliveredAt: z.iso.datetime(),
  ...timestamps
});

export const createShipmentSchema = shipmentsSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

/** Quais itens (e quantas unidades) foram em cada remessa. */
export const shipmentItemsSchema = z.object({
  id: z.cuid2().nonempty(),
  shipmentId: z.cuid2().nonempty(),
  orderItemId: z.cuid2().nonempty(),
  quantity: z.number().int().nonoptional()
});

export const orderEventsSchema = z.object({
  id: z.cuid2().nonempty(),
  orderId: z.cuid2().nonempty(),
  /** "status_changed" | "payment_received" | "note_added" ... */
  type: z.string().nonempty(),
  fromStatus: z.string(),
  toStatus: z.string(),
  message: z.string(),
  payload: z.record(z.string(), z.unknown()).optional(),
  /** Null quando o evento veio de webhook/sistema. */
  actorId: z.cuid2(),
  ...timestamps
});

export const createOrderEventSchema = orderEventsSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
