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

export const registerSchema = z
  .object({
    name: z.string().min(2),
    email: z.email().nonempty(),
    username: z.string().min(6),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
    image: z.literal('').or(z.url()),
    phone: z.e164(),
    taxId: z.string(),
    paymentCustomerId: z.string(),
    acceptsMarketing: z.boolean().default(false).nonoptional(),
    locate: z.string().default('pt-BR')
  })
  .refine(a => a.password === a.confirmPassword, {
    path: ['confirmPassword']
  });
export type Register = z.infer<typeof registerSchema>;

export const brandsSchema = z.object({
  name: z.string().nonempty(),
  slug: z.string().nonempty(),
  description: z.string(),
  logoUrl: z.url(),
  isActive: z.boolean().nonoptional().default(true)
});
export type Brands = z.infer<typeof brandsSchema>;

export const categoriesSchema = z.object({
  parentId: z.cuid2(),
  name: z.string().nonempty(),
  slug: z.string().nonempty(),
  description: z.string(),
  imageUrl: z.url(),
  path: z.string().nonempty(),
  depth: z.int().positive().default(0),
  position: z.int().positive().default(0),
  isActive: z.boolean().nonoptional().default(true),
  metaTile: z.string(),
  metaDescription: z.string()
});
export type Categories = z.infer<typeof categoriesSchema>;

export const productsSchema = z.object({
  brandId: z.cuid2(),
  primaryCategoryId: z.cuid2(),
  name: z.string().nonempty(),
  slug: z.string().nonempty(),
  shortDescription: z.string(),
  description: z.string(),
  status: productStatusEnum.nonoptional().default('draft'),
  isDigital: z.boolean().nonoptional().default(false),
  requiresShipping: z.boolean().nonoptional().default(true),
  taxCode: z.string(),
  taxRate: z.number(),
  tags: z.array(z.string()).nonempty(),
  attributes: z.json(),
  metaTitle: z.string(),
  metaDescription: z.string(),
  ratingAverange: z.number().positive().default(0),
  ratingCount: z.int().positive().default(0),
  publishedAt: z.iso.datetime(),
  deletedAt: z.iso.datetime()
});
export type Products = z.infer<typeof productsSchema>;

export const productCategoriesSchema = z.object({
  productId: z.cuid2().nonempty(),
  categoryId: z.cuid2().nonempty()
});
export type ProductCategories = z.infer<typeof productCategoriesSchema>;

export const productOptions = z.object({
  productId: z.cuid2().nonempty(),
  name: z.string().nonempty(),
  position: z.int().positive().default(0)
});
export type ProductOptions = z.infer<typeof productOptions>;

export const productOptionValuesSchema = z.object({
  optionId: z.cuid2().nonempty(),
  values: z.string().nonempty(),
  metadata: z.json(),
  position: z.int().positive().default(0)
});
export type ProductOptionsValues = z.infer<typeof productOptionValuesSchema>;

export const productVariantsSchema = z.object({
  productId: z.cuid2().nonempty(),
  sku: z.string().nonempty(),
  barcode: z.string(),
  name: z.string(),
  priceCents: z.int().positive(),
  compareAtPriceCents: z.int(),
  costCents: z.int(),
  weightGrams: z.int(),
  lengthMm: z.int(),
  widthMn: z.int(),
  heightMn: z.int(),
  allowBackorder: z.boolean().nonoptional().default(false),
  isActive: z.boolean().nonoptional().default(true),
  isDefault: z.boolean().nonoptional().default(false),
  position: z.int().positive().default(0),
  deletedAT: z.iso.datetime()
});
export type ProductVariants = z.infer<typeof productVariantsSchema>;

export const variantOptionValuesSchema = z.object({
  variantId: z.cuid2().nonempty(),
  optionValueId: z.cuid2().nonempty()
});
export type VariantOptionValues = z.infer<typeof variantOptionValuesSchema>;

export const productImagesSchema = z.object({
  productId: z.cuid2().nonempty(),
  variantId: z.cuid2(),
  url: z.url().nonempty(),
  alt: z.string(),
  widht: z.int(),
  height: z.int(),
  blurDataUrl: z.string(),
  position: z.int().positive().default(0)
});
export type ProductImages = z.infer<typeof productImagesSchema>;

export const cartsSchema = z.object({
  userId: z.cuid2(),
  guestToken: z.string(),
  status: cartStatusEnum.nonoptional().default('active'),
  currency: z.currencyCode().nonempty().default('BRL'),
  email: z.email(),
  couponCode: z.string(),
  notes: z.string(),
  metadata: z.json(),
  expiresAt: z.iso.datetime()
});
export type Carts = z.infer<typeof cartsSchema>;

export const cartItemsSchema = z.object({
  cartId: z.cuid2().nonempty(),
  variantId: z.cuid2().nonempty(),
  productId: z.cuid2().nonempty(),
  quantity: z.int().positive(),
  unitPriceCents: z.int().positive(),
  compareAtPriceCents: z.int()
});
export type CartItems = z.infer<typeof cartItemsSchema>;

export const couponsSchema = z.object({
  code: z.string().nonempty(),
  description: z.string(),
  discountType: discountTypeEnum.nonoptional(),
  discountValue: z.int().positive(),
  maxDicountCents: z.int(),
  minSubtotalCents: z.int().positive().default(0),
  maxRedemptions: z.int(),
  maxRedemptionsPerUser: z.int().positive().default(1),
  redemptionCount: z.int().positive().default(0),
  appliesToProductIds: z.array(z.cuid2()),
  appliesToCategoryIds: z.array(z.cuid2()),
  firstOrderOnly: z.boolean().nonoptional().default(false),
  isActive: z.boolean().nonoptional().default(true),
  startsAt: z.iso.datetime(),
  endsAt: z.iso.datetime()
});
export type Coupons = z.infer<typeof couponsSchema>;

export const couponRedemptionsSchema = z.object({
  couponId: z.cuid2().nonempty(),
  userId: z.cuid2(),
  orderID: z.cuid2(),
  discountAppliedCents: z.int().positive()
});
export type CouponRedemptions = z.infer<typeof couponRedemptionsSchema>;

export const addressSchema = z.object({
  userId: z.cuid2().nonempty(),
  type: addressTypeEnum.default('both').nonoptional(),
  label: z.string(),
  recipientName: z.string().nonempty(),
  phone: z.e164(),
  taxId: z.string(),
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
  isDefaultBilling: z.boolean().default(false).nonoptional()
});
export type Address = z.infer<typeof addressSchema>;

export const wishlistSchema = z.object({
  userId: z.cuid2().nonempty(),
  name: z.string().nonempty().default('Favoritos'),
  isPublic: z.boolean().default(false).nonoptional(),
  shareToken: z.string()
});
export type Wishlist = z.infer<typeof wishlistSchema>;

export const wishlistItemsSchema = z.object({
  wishlistId: z.cuid2().nonempty(),
  productId: z.cuid2().nonempty(),
  variantId: z.cuid2(),
  note: z.string()
});
export type WishlistItems = z.infer<typeof wishlistItemsSchema>;

export const reviewsSchema = z.object({
  productId: z.cuid2().nonempty(),
  userId: z.cuid2().nonempty(),
  orderItem: z.cuid2(),
  rating: z.int().min(1).max(5),
  title: z.string(),
  body: z.string(),
  status: reviewStatusEnum.nonoptional().default('pending'),
  isVerifiedPurchase: z.boolean().nonoptional().default(false),
  helpfulCount: z.int().default(0),
  reply: z.string(),
  repliedAt: z.iso.datetime()
});
export type Reviews = z.infer<typeof reviewsSchema>;

export const warehousesSchema = z.object({
  name: z.string().nonempty(),
  code: z.string().nonempty(),
  postalCode: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string().nonempty().default('BR'),
  isActive: z.boolean().default(true),
  priority: z.int().default(0)
});
export type Warehouses = z.infer<typeof warehousesSchema>;

export const inventoryItemsSchema = z.object({
  variantId: z.cuid2().nonempty(),
  warehouseId: z.cuid2().nonempty(),
  quantity: z.int().nonnegative().default(0),
  reservedQuantity: z.int().nonnegative().default(0),
  safetyStock: z.int().nonnegative().default(0),
  reorderPoint: z.int().nonnegative().default(0),
  binLocation: z.string()
});
export type InventoryItem = z.infer<typeof inventoryItemsSchema>;

export const stockMovementsSchema = z.object({
  inventoryItemId: z.cuid2().nonempty(),
  type: stockMovementTypeEnum.nonoptional(),
  quantity: z.int().nonoptional(),
  balanceAfter: z.int(),
  referenceType: z.string(),
  referenceId: z.string(),
  note: z.string(),
  createdBy: z.cuid2()
});
export type StockMovements = z.infer<typeof stockMovementsSchema>;

export const ordersSchema = z.object({
  orderNumber: z.string().nonempty(),
  userId: z.cuid2(),
  cartId: z.cuid2(),
  email: z.email().nonempty(),
  phone: z.e164(),
  status: orderStatusEnum.nonoptional().default('pending'),
  paymentStatus: paymentStatusEnum.nonoptional().default('pending'),
  fulfillmentStatus: fulfillmentStatusEnum.nonoptional().default('unfulfilled'),
  currency: z.string().nonempty().default('BRL'),
  subtotalCents: z.int().nonoptional(),
  discountCents: z.int().nonoptional().default(0),
  shippingCents: z.int().nonoptional().default(0),
  taxCents: z.int().nonoptional().default(0),
  totalCents: z.int().nonoptional(),
  refundedCents: z.int().nonoptional().default(0),
  couponId: z.cuid2(),
  couponCode: z.string(),
  shippingAddress: z.json(),
  billingAddress: z.json(),
  customerNote: z.string(),
  internalNote: z.string(),
  cancelReason: z.string(),
  metadata: z.json(),
  placedAt: z.iso.datetime().nonoptional(),
  paidAt: z.iso.datetime(),
  shippedAt: z.iso.datetime(),
  deliveredAt: z.iso.datetime(),
  canceledAt: z.iso.datetime()
});
export type Orders = z.infer<typeof ordersSchema>;

export const orderItemsSchema = z.object({
  orderId: z.cuid2().nonempty(),
  productId: z.cuid2(),
  variantId: z.cuid2(),
  productName: z.string().nonempty(),
  variantName: z.string(),
  sku: z.string().nonempty(),
  imageUrl: z.url(),
  optionsSnapshot: z.json(),
  quantity: z.int().positive(),
  unitPriceCents: z.int().positive(),
  discountCents: z.int().positive().default(0),
  taxCents: z.int().positive().default(0),
  totalCents: z.int().positive(),
  fulfilledQuantity: z.int().positive().default(0),
  refundedQuantity: z.int().positive().default(0)
});
export type OrderItem = z.infer<typeof orderItemsSchema>;

export const paymentsSchema = z.object({
  orderId: z.cuid2().nonempty(),
  method: paymentMethodEnum.nonoptional(),
  status: paymentStatusEnum.nonoptional().default('pending'),
  amountCents: z.int().positive(),
  currency: z.currencyCode().nonempty().default('BRL'),
  provider: z.string().nonempty(),
  providerTransactionId: z.string(),
  installments: z.int().positive().default(1),
  cardBrand: z.string(),
  cardLast4: z.string(),
  pixQrCode: z.string(),
  boletoBarcode: z.string(),
  boletoUrl: z.string(),
  dueAt: z.iso.datetime(),
  failureCode: z.string(),
  failureMessage: z.string(),
  rawResponse: z.json(),
  authorizedAt: z.iso.datetime(),
  paidAt: z.iso.datetime()
});
export type Payments = z.infer<typeof paymentsSchema>;

export const refundsSchema = z.object({
  orderId: z.cuid2().nonempty(),
  paymentId: z.cuid2(),
  amountCents: z.int().positive(),
  reason: z.string(),
  status: paymentStatusEnum.nonoptional().default('pending'),
  providerRefundId: z.string(),
  createdBy: z.cuid2()
});
export type Refunds = z.infer<typeof refundsSchema>;

export const shippingMethodsSchema = z.object({
  name: z.string().nonempty(),
  carrier: z.string(),
  code: z.string().nonempty(),
  basePriceCents: z.int().positive().default(0),
  freeAboveCents: z.int(),
  minDays: z.int(),
  maxDays: z.int(),
  isActive: z.int().positive().default(1)
});
export type ShippingMethods = z.infer<typeof shippingMethodsSchema>;

export const shipmentsSchema = z.object({
  orderId: z.cuid2().nonempty(),
  shippingMethodId: z.cuid2(),
  status: shipmentStatusEnum.nonoptional().default('pending'),
  carrier: z.string(),
  trackingCode: z.string(),
  trackingUrl: z.url(),
  labelUrl: z.url(),
  constCents: z.int().positive().default(0),
  weightGrams: z.int(),
  estimatedDeliveryAt: z.iso.datetime(),
  shippedAt: z.iso.datetime(),
  deliveredAt: z.iso.datetime()
});
export type Shipments = z.infer<typeof shipmentsSchema>;

export const shipmentItemsSchema = z.object({
  shipmentId: z.cuid2().nonempty(),
  orderItemId: z.cuid2().nonempty(),
  quantity: z.int().positive()
});
export type ShipmentItems = z.infer<typeof shipmentItemsSchema>;

export const orderEventsSchema = z.object({
  orderId: z.cuid2().nonempty(),
  type: z.string().nonempty(),
  fromStatus: z.string(),
  toStatus: z.string(),
  message: z.string(),
  payload: z.json(),
  actorId: z.cuid2()
});
export type OrderEvents = z.infer<typeof orderEventsSchema>;

export const loginSchema = z.object({
  email: z.email().nonempty(),
  password: z.string().nonempty()
});
export type Login = z.infer<typeof loginSchema>;
