import { createId } from '@paralleldrive/cuid2';
import { defineRelations, sql } from 'drizzle-orm';
import {
  boolean,
  foreignKey,
  index,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex
} from 'drizzle-orm/pg-core';

export const mediaTypeEnum = pgEnum('media_category_type', [
  'serie',
  'movie',
  'music',
  'video',
  'podcast',
  'book'
]);

export const mediaTypeStatusEnum = pgEnum('media_type_status', [
  'on_going',
  'completed',
  'scheduled',
  'dropped'
]);

export const watchlistStatusEnum = pgEnum('watchlist_status', [
  'watched',
  'dropped',
  'not_watched'
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
  ...timestamps
});

export const session = pgTable(
  'session',
  {
    id: text('id').primaryKey(),
    expiresAt: timestamp('expires_at').notNull(),
    token: text('token').notNull().unique(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
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
    expiresAt: timestamp('expires_at').notNull(),
    ...timestamps
  },
  table => [index('verification_identifier_idx').on(table.identifier)]
);

export const mediaCategories = pgTable(
  'media_categories',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    name: text('name').notNull(),
    type: mediaTypeEnum('type').default('movie').notNull(),
    ...timestamps
  },
  t => [
    uniqueIndex('media_categories_name_uidx').on(t.name),
    index('media_categories_type_idx').on(t.type)
  ]
);

export const mediaThemes = pgTable(
  'media_theme',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    name: text('name').notNull(),
    type: mediaTypeEnum('type').default('movie').notNull(),
    ...timestamps
  },
  t => [
    uniqueIndex('media_theme_name_uidx').on(t.name),
    index('media_theme_type_idx').on(t.type)
  ]
);

export const medias = pgTable(
  'medias',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    name: text('name').notNull(),
    description: text('description'),
    status: mediaTypeStatusEnum('status').default('on_going').notNull(),
    tags: text()
      .array()
      .default(sql`ARRAY[]::text[]`)
      .notNull(),
    ...timestamps
  },
  t => [
    index('medias_tags_idx').on(t.tags),
    index('medias_status_idx').on(t.status)
  ]
);

export const mediaToCategories = pgTable(
  'media_to_categories',
  {
    mediaId: text('media_id')
      .notNull()
      .references(() => medias.id, {
        onDelete: 'cascade'
      }),
    categoryId: text('category_id')
      .notNull()
      .references(() => mediaCategories.id, { onDelete: 'cascade' })
  },
  t => [primaryKey({ columns: [t.mediaId, t.categoryId] })]
);

export const mediaToThemes = pgTable(
  'media_to_themes',
  {
    mediaId: text('media_id')
      .notNull()
      .references(() => medias.id, {
        onDelete: 'cascade'
      }),
    themeId: text('theme_id')
      .notNull()
      .references(() => mediaThemes.id, {
        onDelete: 'cascade'
      })
  },
  t => [primaryKey({ columns: [t.mediaId, t.themeId] })]
);

export const mediaItems = pgTable(
  'media_items',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    mediaId: text('media_id')
      .notNull()
      .references(() => medias.id, {
        onDelete: 'cascade'
      }),
    name: text('name').notNull(),
    mediaUrl: text('media_url').notNull(),
    ...timestamps
  },
  t => [
    index('media_items_media_idx').on(t.mediaId),
    index('media_items_name_idx').on(t.name)
  ]
);

export const watchlists = pgTable(
  'watchlists',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    name: text('name').notNull().default('Favorites'),
    description: text('description'),
    isPublic: boolean('is_public').notNull().default(false),
    shareToken: text('share_token'),
    ...timestamps
  },
  t => [
    uniqueIndex('watchlists_share_token_uidx').on(t.shareToken),
    index('watchlists_user_idx').on(t.userId),
    index('watchlists_public_idx').on(t.userId, t.isPublic)
  ]
);

export const watchlistItems = pgTable(
  'watchlist_items',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    watchlistId: text('watchlist_id')
      .notNull()
      .references(() => watchlists.id, {
        onDelete: 'cascade'
      }),
    mediaId: text('media_id')
      .notNull()
      .references(() => medias.id, {
        onDelete: 'cascade'
      }),
    status: watchlistStatusEnum('status').default('not_watched').notNull(),
    ...timestamps
  },
  t => [
    uniqueIndex('watchlist_items_watchlist_media_idx').on(
      t.watchlistId,
      t.mediaId
    ),
    index('watchlist_items_media_idx').on(t.mediaId),
    index('watchlist_items_status_idx').on(t.status)
  ]
);

export const mediaLogs = pgTable(
  'media_logs',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId())
  },
  t => []
);

export const relations = defineRelations(
  {
    user,
    account,
    session,
    mediaToCategories,
    mediaToThemes,
    mediaCategories,
    mediaThemes,
    mediaItems,
    medias,
    watchlists,
    watchlistItems
  },
  r => ({
    user: {
      sessions: r.many.session(),
      accounts: r.many.account(),
      watchlists: r.many.watchlists()
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
    mediaCategories: {
      medias: r.many.medias()
    },
    mediaItems: {
      medias: r.one.medias({
        from: r.mediaItems.mediaId,
        to: r.medias.id
      })
    },
    medias: {
      mediaItems: r.many.mediaItems(),
      mediaThemes: r.many.mediaThemes({
        from: r.medias.id.through(r.mediaToThemes.mediaId),
        to: r.mediaThemes.id.through(r.mediaToThemes.themeId)
      }),
      mediaCategories: r.many.mediaCategories({
        from: r.medias.id.through(r.mediaToCategories.mediaId),
        to: r.mediaCategories.id.through(r.mediaToCategories.categoryId)
      })
    },
    mediaThemes: {
      medias: r.many.medias()
    },
    watchlistItems: {
      watchlist: r.one.watchlists({
        from: r.watchlistItems.watchlistId,
        to: r.watchlists.id
      }),
      media: r.one.medias({
        from: r.watchlistItems.mediaId,
        to: r.medias.id
      })
    },
    watchlists: {
      watchlistItems: r.many.watchlistItems(),
      user: r.one.user({
        from: r.watchlists.userId,
        to: r.user.id
      })
    }
  })
);

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
export type Account = typeof account.$inferSelect;
export type Session = typeof session.$inferSelect;
export type Media = typeof medias.$inferSelect;
export type NewMedia = typeof medias.$inferInsert;
export type MediaItem = typeof mediaItems.$inferSelect;
export type NewMediaItem = typeof mediaItems.$inferInsert;
export type MediaCategory = typeof mediaCategories.$inferSelect;
export type NewMediaCategory = typeof mediaCategories.$inferInsert;
export type Watchlist = typeof watchlists.$inferSelect;
export type NewWatchlist = typeof watchlists.$inferInsert;
export type WatchlistItem = typeof watchlistItems.$inferSelect;
export type NewWatchlistItem = typeof watchlistItems.$inferInsert;
