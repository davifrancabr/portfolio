import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex
} from 'drizzle-orm/pg-core';
import { user } from './auth';
import { productVariants } from './catalog';
import { stockMovementTypeEnum } from './enum';

const timestamps = {
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .$onUpdate(() => new Date())
    .defaultNow()
};

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
    variantId: text('variant_id')
      .notNull()
      .references(() => productVariants.id, { onDelete: 'cascade' }),
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
    uniqueIndex('inventory_items_variant_warehouse_unique').on(
      t.variantId,
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
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull()
  },
  t => [
    index('stock_movements_item_idx').on(t.inventoryItemId, t.createdAt),
    index('stock_movements_reference_idx').on(t.referenceType, t.referenceId)
  ]
);

export const warehousesRelations = relations(warehouses, ({ many }) => ({
  inventoryItems: many(inventoryItems)
}));

export const inventoryItemsRelations = relations(
  inventoryItems,
  ({ one, many }) => ({
    variant: one(productVariants, {
      fields: [inventoryItems.variantId],
      references: [productVariants.id]
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

export type InventoryItem = typeof inventoryItems.$inferSelect;
export type StockMovement = typeof stockMovements.$inferSelect;
