import { defineRelations } from 'drizzle-orm';
import {
  boolean,
  date,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid
} from 'drizzle-orm/pg-core';

export const albumType = pgEnum('album_type', [
  'album',
  'single',
  'ep',
  'compilation'
]);
export const artistRole = pgEnum('artist_role', ['main', 'featured']);

const timestamps = {
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull()
};

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'),
  role: text('role'),
  banned: boolean('banned').default(false),
  banReason: text('ban_reason'),
  banExpires: timestamp('ban_expires'),
  username: text('username').unique(),
  displayUsername: text('display_username'),
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
    impersonatedBy: text('impersonated_by'),
    ...timestamps
  },
  t => [index('session_userId_idx').on(t.userId)]
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
  t => [index('account_userId_idx').on(t.userId)]
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
  t => [index('verification_identifier_idx').on(t.identifier)]
);

export const artists = pgTable(
  'artists',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    bio: text('bio'),
    imageUrl: text('image_url'),
    verified: boolean('verified').notNull().default(false),
    ...timestamps
  },
  t => [uniqueIndex('artists_slug_idx').on(t.slug)]
);

export const albums = pgTable(
  'albums',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    title: text('title').notNull(),
    type: albumType('type').notNull().default('album'),
    coverUrl: text('cover_url'),
    releaseDate: date('release_date'),
    primaryArtistId: uuid('primary_artist_id')
      .notNull()
      .references(() => artists.id, { onDelete: 'cascade' }),
    ...timestamps
  },
  t => [index('albums_artist_idx').on(t.primaryArtistId)]
);

export const genres = pgTable('genres', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique()
});

export const tracks = pgTable(
  'tracks',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    title: text('title').notNull(),
    albumId: uuid('album_id').references(() => albums.id, {
      onDelete: 'set null'
    }),
    trackNumber: integer('track_number'),
    discNumber: integer('disc_number').notNull().default(1),
    durationMs: integer('duration_ms').notNull(),
    explicit: boolean('explicit').notNull().default(false),
    audioUrl: text('audio_url').notNull(),
    coverUrl: text('cover_url'),
    playCount: integer('play_count').notNull().default(0),
    ...timestamps
  },
  t => [
    index('tracks_album_idx').on(t.albumId),
    index('tracks_title_idx').on(t.title)
  ]
);

export const trackArtists = pgTable(
  'track_artists',
  {
    trackId: uuid('track_id')
      .notNull()
      .references(() => tracks.id, { onDelete: 'cascade' }),
    artistId: uuid('artist_id')
      .notNull()
      .references(() => artists.id, { onDelete: 'cascade' }),
    role: artistRole('role').notNull().default('main')
  },
  t => [primaryKey({ columns: [t.trackId, t.artistId] })]
);

export const trackGenres = pgTable(
  'track_genres',
  {
    trackId: uuid('track_id')
      .notNull()
      .references(() => tracks.id, { onDelete: 'cascade' }),
    genreId: uuid('genre_id')
      .notNull()
      .references(() => genres.id, { onDelete: 'cascade' })
  },
  t => [primaryKey({ columns: [t.trackId, t.genreId] })]
);

export const playlists = pgTable(
  'playlists',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    ownerId: text('owner_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    description: text('description'),
    coverUrl: text('cover_url'),
    isPublic: boolean('is_public').notNull().default(false),
    ...timestamps
  },
  t => [index('playlist_owner_idx').on(t.ownerId)]
);

export const playlistTracks = pgTable(
  'playlist_tracks',
  {
    playlistId: uuid('playlist_id')
      .notNull()
      .references(() => playlists.id, { onDelete: 'cascade' }),
    trackId: uuid('track_id')
      .notNull()
      .references(() => tracks.id, { onDelete: 'cascade' }),
    position: integer('position').notNull(),
    addedAt: timestamp('added_at', { withTimezone: true })
      .notNull()
      .defaultNow()
  },
  t => [
    primaryKey({ columns: [t.playlistId, t.trackId] }),
    index('playlist_track_position_idx').on(t.playlistId, t.position)
  ]
);

export const likedTracks = pgTable(
  'liked_tracks',
  {
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    trackId: uuid('track_id')
      .notNull()
      .references(() => tracks.id, { onDelete: 'cascade' }),
    likedAt: timestamp('liked_at', { withTimezone: true })
      .notNull()
      .defaultNow()
  },
  t => [primaryKey({ columns: [t.userId, t.trackId] })]
);

export const artistFollows = pgTable(
  'artist_follows',
  {
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    artistId: uuid('artist_id')
      .notNull()
      .references(() => artists.id, { onDelete: 'cascade' }),
    followedAt: timestamp('followed_at', { withTimezone: true })
      .notNull()
      .defaultNow()
  },
  t => [primaryKey({ columns: [t.userId, t.artistId] })]
);

export const playHistory = pgTable(
  'play_history',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    trackId: uuid('track_id')
      .notNull()
      .references(() => tracks.id, { onDelete: 'cascade' }),
    playedAt: timestamp('played_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    msPlayed: integer('ms_played').notNull().default(0)
  },
  t => [index('play_history_user_idx').on(t.userId, t.playedAt)]
);

export const relations = defineRelations(
  {
    user,
    session,
    account,
    albums,
    artistFollows,
    artists,
    likedTracks,
    playHistory,
    playlistTracks,
    playlists,
    trackArtists,
    tracks
  },
  r => ({
    user: {
      sessions: r.many.session(),
      accounts: r.many.account(),
      playlists: r.many.playlists(),
      likedTracks: r.many.likedTracks(),
      follows: r.many.artistFollows(),
      history: r.many.playHistory()
    },
    account: {
      user: r.one.user({
        from: r.account.userId,
        to: r.user.id
      })
    },
    session: {
      user: r.one.user({
        from: r.session.userId,
        to: r.user.id
      })
    },
    artists: {
      albums: r.many.albums(),
      tracks: r.many.trackArtists(),
      followers: r.many.artistFollows()
    },
    albums: {
      artist: r.one.artists({
        from: r.albums.primaryArtistId,
        to: r.artists.id
      }),
      tracks: r.many.tracks()
    },
    artistFollows: {
      user: r.one.user({
        from: r.artistFollows.userId,
        to: r.user.id
      }),
      artist: r.one.artists({
        from: r.artistFollows.artistId,
        to: r.artists.id
      })
    },
    likedTracks: {
      user: r.one.user({
        from: r.likedTracks.userId,
        to: r.user.id
      }),
      track: r.one.tracks({
        from: r.likedTracks.trackId,
        to: r.tracks.id
      })
    },
    playHistory: {
      user: r.one.user({
        from: r.playHistory.userId,
        to: r.user.id
      }),
      track: r.one.tracks({
        from: r.playHistory.trackId,
        to: r.tracks.id
      })
    },
    playlists: {
      owner: r.one.user({
        from: r.playlists.ownerId,
        to: r.user.id
      }),
      tracks: r.many.playlistTracks()
    },
    playlistTracks: {
      playlist: r.one.playlists({
        from: r.playlistTracks.playlistId,
        to: r.playlists.id
      }),
      track: r.one.tracks({
        from: r.playlistTracks.trackId,
        to: r.tracks.id
      })
    },
    trackArtists: {
      track: r.one.tracks({
        from: r.trackArtists.trackId,
        to: r.tracks.id
      }),
      artist: r.one.artists({
        from: r.trackArtists.artistId,
        to: r.artists.id
      })
    },
    tracks: {
      album: r.one.albums({
        from: r.tracks.albumId,
        to: r.albums.id
      }),
      artists: r.many.trackArtists()
    }
  })
);

export type Track = typeof tracks.$inferSelect;
export type NewTrack = typeof tracks.$inferInsert;
export type Playlist = typeof playlists.$inferSelect;
