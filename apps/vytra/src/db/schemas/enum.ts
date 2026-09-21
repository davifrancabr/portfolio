import { pgEnum } from 'drizzle-orm/pg-core';

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
