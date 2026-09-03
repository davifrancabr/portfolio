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

const timestamps = {
  criadoEm: timestamp({ withTimezone: true }).notNull().defaultNow(),
  atualizadoEm: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date())
};

export const inventoryMovementType = pgEnum('inventory_movement_type', [
  'entrada',
  'saida',
  'ajuste'
]);

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'),
  role: text('role'),
  banned: boolean('banned').default(false),
  banReason: text('ban_reason'),
  banExpires: timestamp('ban_expires', {
    withTimezone: true
  }),
  username: text().unique().notNull(),
  displayUsername: text(),
  ...timestamps
});

export const favorites = pgTable(
  'favorites',
  {
    userId: text()
      .notNull()
      .references(() => user.id, {
        onDelete: 'cascade'
      }),
    productId: text()
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    isPublic: boolean().notNull().default(true),
    favoritedAt: timestamp({ withTimezone: true }).notNull().defaultNow()
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

export const session = pgTable(
  'session',
  {
    id: text('id').primaryKey(),
    expiresAt: timestamp('expires_at', {
      withTimezone: true
    }).notNull(),
    token: text('token').notNull().unique(),
    ...timestamps,
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    impersonatedBy: text('impersonated_by')
  },
  table => [index('session_userId_idx').on(table.userId)]
);

export const account = pgTable(
  'account',
  {
    id: text('id').primaryKey(),
    issuer: text('issuer').notNull(),
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
  table => [
    uniqueIndex('account_issuer_accountId_uidx').on(
      table.issuer,
      table.accountId
    ),
    index('account_userId_idx').on(table.userId)
  ]
);

export const verification = pgTable(
  'verification',
  {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at', {
      withTimezone: true
    }).notNull(),
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
    name: text().notNull(),
    description: text(),
    sku: text().notNull(),
    costPrice: numeric({ precision: 12, scale: 2 }).notNull(),
    salePrice: numeric({ precision: 12, scale: 2 }).notNull(),
    deletedAt: timestamp({ withTimezone: true }),
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
    name: text().notNull(),
    address: text().notNull().unique(),
    ...timestamps
  },
  t => [uniqueIndex('storages_address_uidx').on(t.address)]
);

export const inventory = pgTable(
  'inventory',
  {
    storageId: text()
      .notNull()
      .references(() => storages.id, {
        onDelete: 'cascade'
      }),
    productId: text()
      .notNull()
      .references(() => products.id, { onDelete: 'restrict' }),
    quantity: integer().notNull().default(0),
    minimumQuantity: integer().notNull().default(0),
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

export const inventoryMovements = pgTable(
  'inventory_movements',
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => createId()),
    userId: text()
      .notNull()
      .references(() => user.id, {
        onDelete: 'restrict'
      }),
    storageId: text().notNull(),
    productId: text().notNull(),
    type: inventoryMovementType().notNull(),
    quantityBefore: integer().notNull(),
    quantity: integer().notNull(),
    quantityAfter: integer().notNull(),
    reason: text(),
    occurredAt: timestamp({ withTimezone: true }).notNull().defaultNow()
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
    check('inventory_movements_quantity_positive', sql`${t.quantity} > 0`),
    check(
      'inventory_movements_quantity_before_nonneg',
      sql`${t.quantityBefore} >= 0`
    ),
    check(
      'inventory_movements_quantity_after_nonneg',
      sql`${t.quantityAfter} >= 0`
    )
  ]
);

export const relations = defineRelations(
  {
    user,
    account,
    session,
    verification,
    products,
    favorites,
    storages,
    inventory,
    inventoryMovements
  },
  r => ({
    user: {
      sessions: r.many.session(),
      accounts: r.many.account(),
      favorites: r.many.favorites(),
      inventoryMovements: r.many.inventoryMovements()
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
    products: {
      favorites: r.many.favorites(),
      inventory: r.many.inventory()
    },
    storages: {
      inventory: r.many.inventory()
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
      movements: r.many.inventoryMovements()
    },
    inventoryMovements: {
      user: r.one.user({
        from: r.inventoryMovements.userId,
        to: r.user.id
      }),
      inventory: r.one.inventory({
        from: [r.inventoryMovements.storageId, r.inventoryMovements.productId],
        to: [r.inventory.storageId, r.inventory.productId]
      })
    }
  })
);
