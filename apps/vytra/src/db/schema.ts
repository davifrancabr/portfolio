import { createId } from '@paralleldrive/cuid2';
import { defineRelations, sql } from 'drizzle-orm';
import {
  boolean,
  check,
  foreignKey,
  index,
  integer,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex
} from 'drizzle-orm/pg-core';

export const inventoryMovementType = pgEnum('inventory_movement_type', [
  'entrada',
  'saida',
  'ajuste'
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

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'),
  username: text('username').unique(),
  displayUsername: text('display_username'),
  role: text('role'),
  banned: boolean('banned').default(false),
  banReason: text('ban_reason'),
  banExpires: timestamp('ban_expires', { withTimezone: true }),
  ...timestamps
});

export const session = pgTable(
  'session',
  {
    id: text('id').primaryKey(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    token: text('token').notNull().unique(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    impersonatedBy: text('impersonated_by'),
    ...timestamps
  },
  table => [index('session_userId_idx').on(table.userId)]
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

export const products = pgTable(
  'products',
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => createId()),
    name: text('name').notNull(),
    description: text('description'),
    sku: text('sku').notNull(),
    costPrice: numeric('cost_price', { precision: 12, scale: 2 }).notNull(),
    salePrice: numeric('sale_price', { precision: 12, scale: 2 }).notNull(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
    ...timestamps
  },
  t => [
    uniqueIndex('products_sku_uidx').on(t.sku),
    index('products_deleted_at_idx').on(t.deletedAt)
  ]
);

export const storages = pgTable(
  'storages',
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => createId()),
    name: text('name').notNull(),
    address: text('address').notNull().unique(),
    ...timestamps
  },
  t => [uniqueIndex('storages_address_uidx').on(t.address)]
);

export const inventory = pgTable(
  'inventory',
  {
    storageId: text('storage_id')
      .notNull()
      .references(() => storages.id, {
        onDelete: 'cascade',
        onUpdate: 'no action'
      }),
    productId: text('product_id')
      .notNull()
      .references(() => products.id, {
        onDelete: 'restrict',
        onUpdate: 'no action'
      }),
    quantity: integer().notNull().default(0),
    minimumQuantity: integer('minimum_quantity').notNull().default(0),
    ...timestamps
  },
  t => [
    primaryKey({ columns: [t.storageId, t.productId] }),
    index('inventory_product_id_idx').on(t.productId),
    index('inventory_storage_id_idx').on(t.storageId),
    check('inventory_quantity_nonneg', sql`${t.quantity} >= 0`),
    check('inventory_minimum_quantity_nonneg', sql`${t.minimumQuantity} >= 0`)
  ]
);

export const favorites = pgTable(
  'favorites',
  {
    userId: text('user_id')
      .notNull()
      .references(() => user.id, {
        onDelete: 'cascade',
        onUpdate: 'no action'
      }),
    productId: text('product_id')
      .notNull()
      .references(() => products.id, {
        onDelete: 'cascade',
        onUpdate: 'no action'
      }),
    isPublic: boolean('is_public').notNull().default(true),
    favoritedAt: timestamp('favorited_at', { withTimezone: true })
      .notNull()
      .defaultNow()
  },
  t => [
    primaryKey({ columns: [t.userId, t.productId] }),
    index('favorites_user_id_idx').on(t.userId),
    index('favorites_product_id_idx').on(t.productId),
    index('favorites_product_favorited_at_idx').on(
      t.productId,
      t.favoritedAt.desc()
    )
  ]
);

export const inventoryMovement = pgTable(
  'inventory_movement',
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => createId()),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, {
        onDelete: 'restrict',
        onUpdate: 'no action'
      }),
    storageId: text('storage_id').notNull(),
    productId: text('product_id').notNull(),
    type: inventoryMovementType('type').notNull(),
    quantityBefore: integer('quantity_before').notNull(),
    quantity: integer('quantity').notNull(),
    quantityAfter: integer('quantity_after').notNull(),
    reason: text('reason'),
    occurredAt: timestamp('occurred_at', { withTimezone: true })
      .notNull()
      .defaultNow()
  },
  t => [
    foreignKey({
      columns: [t.storageId, t.productId],
      foreignColumns: [inventory.storageId, inventory.productId],
      name: 'inventory_movements_inventory_fk'
    }).onDelete('restrict'),
    index('inventory_movements_storage_product_occurred_idx').on(
      t.storageId,
      t.productId,
      t.occurredAt.desc()
    ),
    index('inventory_movements_user_occurred_idx').on(
      t.userId,
      t.occurredAt.desc()
    ),
    check(
      'inventory_movements_quantity_before_positive',
      sql`${t.quantityBefore} > 0`
    ),
    check('inventory_movements_quantity_positive', sql`${t.quantity} >= 0`),
    check(
      'inventory_movements_quantity_after_positive',
      sql`${t.quantityAfter} >= 0`
    )
  ]
);

export const relations = defineRelations(
  {
    user,
    session,
    account,
    verification,
    products,
    storages,
    favorites,
    inventory,
    inventoryMovement
  },
  r => ({
    user: {
      sessions: r.many.session(),
      accounts: r.many.account(),
      favorites: r.many.favorites(),
      inventoryMovements: r.many.inventoryMovement()
    },
    session: {
      user: r.one.user({
        from: r.session.userId,
        to: r.user.id
      })
    },
    account: {
      user: r.one.user({
        from: r.account.userId,
        to: r.user.id
      })
    },
    products: {
      favorites: r.many.favorites(),
      inventory: r.many.inventory()
    },
    favorites: {
      user: r.one.user({
        from: r.favorites.userId,
        to: r.user.id
      }),
      product: r.one.products({
        from: r.favorites.productId,
        to: r.products.id
      })
    },
    inventory: {
      product: r.one.products({
        from: r.inventory.productId,
        to: r.products.id
      }),
      storage: r.one.storages({
        from: r.inventory.storageId,
        to: r.storages.id
      }),
      movements: r.many.inventoryMovement()
    },
    inventoryMovement: {
      user: r.one.user({
        from: r.inventoryMovement.userId,
        to: r.user.id
      }),
      inventory: r.one.inventory({
        from: [r.inventoryMovement.storageId, r.inventoryMovement.productId],
        to: [r.inventory.storageId, r.inventory.productId]
      })
    },
    storages: {
      inventory: r.many.inventory()
    }
  })
);
