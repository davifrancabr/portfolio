import 'server-only';
import { and, count, desc, eq, or } from 'drizzle-orm';
import { cache } from 'react';
import { db } from '@/db';
import {
  albums,
  artistFollows,
  artists,
  likedTracks,
  playHistory,
  playlistTracks,
  playlists,
  tracks,
  user
} from '@/db/schemas';

export type ProfileUser = {
  id: string;
  name: string;
  bio: string | null;
  email: string;
  image: string | null;
  role: string | null;
  createdAt: Date;
};

export type ProfileStats = {
  playlists: number;
  likedTracks: number;
  followedArtists: number;
  plays: number;
};

export type ProfilePlaylist = {
  id: string;
  name: string;
  description: string | null;
  coverUrl: string | null;
  isPublic: boolean;
  trackCount: number;
  updatedAt: Date;
};

export type ProfileLikedTrack = {
  id: string;
  title: string;
  artist: string | null;
  album: string | null;
  coverUrl: string | null;
  durationMs: number;
  audioUrl: string;
  likedAt: Date;
};

export type ProfileHistoryEntry = {
  id: string;
  trackId: string;
  title: string;
  artist: string | null;
  album: string | null;
  coverUrl: string | null;
  durationMs: number;
  audioUrl: string;
  playedAt: Date;
  msPlayed: number;
};

export type ProfileFollowedArtist = {
  id: string;
  name: string;
  imageUrl: string | null;
  verified: boolean;
  followedAt: Date;
};

export type UserProfile = {
  user: ProfileUser;
  stats: ProfileStats;
  playlists: ProfilePlaylist[];
  likedTracks: ProfileLikedTrack[];
  history: ProfileHistoryEntry[];
  followedArtists: ProfileFollowedArtist[];
};

/**
 * Carrega o perfil completo de um usuário. `includePrivate` controla dados que
 * só o próprio dono pode ver (curtidas, histórico e playlists privadas).
 * Executado apenas no servidor; a autorização fica a cargo da página.
 */
async function loadProfile(
  userId: string,
  includePrivate: boolean
): Promise<UserProfile | null> {
  const [profileUser] = await db
    .select({
      id: user.id,
      name: user.name,
      bio: user.bio,
      email: user.email,
      image: user.image,
      role: user.role,
      createdAt: user.createdAt
    })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);

  if (!profileUser) return null;

  const playlistFilter = includePrivate
    ? eq(playlists.ownerId, userId)
    : and(eq(playlists.ownerId, userId), eq(playlists.isPublic, true));

  const [
    playlistRows,
    followedArtistRows,
    playlistCountRows,
    followsCountRows,
    playsCountRows
  ] = await Promise.all([
    db
      .select({
        id: playlists.id,
        name: playlists.name,
        description: playlists.description,
        coverUrl: playlists.coverUrl,
        isPublic: playlists.isPublic,
        updatedAt: playlists.updatedAt,
        trackCount: count(playlistTracks.trackId)
      })
      .from(playlists)
      .leftJoin(playlistTracks, eq(playlistTracks.playlistId, playlists.id))
      .where(playlistFilter)
      .groupBy(playlists.id)
      .orderBy(desc(playlists.updatedAt)),
    db
      .select({
        id: artists.id,
        name: artists.name,
        imageUrl: artists.imageUrl,
        verified: artists.verified,
        followedAt: artistFollows.followedAt
      })
      .from(artistFollows)
      .innerJoin(artists, eq(artistFollows.artistId, artists.id))
      .where(eq(artistFollows.userId, userId))
      .orderBy(desc(artistFollows.followedAt))
      .limit(12),
    db.select({ value: count() }).from(playlists).where(playlistFilter),
    db
      .select({ value: count() })
      .from(artistFollows)
      .where(eq(artistFollows.userId, userId)),
    db
      .select({ value: count() })
      .from(playHistory)
      .where(eq(playHistory.userId, userId))
  ]);

  let likedTrackRows: ProfileLikedTrack[] = [];
  let historyRows: ProfileHistoryEntry[] = [];
  let likedTracksTotal = 0;

  if (includePrivate) {
    const [likedRows, historyResult, likedCountRows] = await Promise.all([
      db
        .select({
          id: tracks.id,
          title: tracks.title,
          artist: artists.name,
          album: albums.title,
          coverUrl: tracks.coverUrl,
          durationMs: tracks.durationMs,
          audioUrl: tracks.audioUrl,
          likedAt: likedTracks.likedAt
        })
        .from(likedTracks)
        .innerJoin(tracks, eq(likedTracks.trackId, tracks.id))
        .leftJoin(albums, eq(tracks.albumId, albums.id))
        .leftJoin(artists, eq(albums.primaryArtistId, artists.id))
        .where(eq(likedTracks.userId, userId))
        .orderBy(desc(likedTracks.likedAt))
        .limit(30),
      db
        .select({
          id: playHistory.id,
          trackId: tracks.id,
          title: tracks.title,
          artist: artists.name,
          album: albums.title,
          coverUrl: tracks.coverUrl,
          durationMs: tracks.durationMs,
          audioUrl: tracks.audioUrl,
          playedAt: playHistory.playedAt,
          msPlayed: playHistory.msPlayed
        })
        .from(playHistory)
        .innerJoin(tracks, eq(playHistory.trackId, tracks.id))
        .leftJoin(albums, eq(tracks.albumId, albums.id))
        .leftJoin(artists, eq(albums.primaryArtistId, artists.id))
        .where(eq(playHistory.userId, userId))
        .orderBy(desc(playHistory.playedAt))
        .limit(30),
      db
        .select({ value: count() })
        .from(likedTracks)
        .where(eq(likedTracks.userId, userId))
    ]);

    likedTrackRows = likedRows;
    historyRows = historyResult;
    likedTracksTotal = likedCountRows[0]?.value ?? 0;
  }

  return {
    user: profileUser,
    stats: {
      playlists: playlistCountRows[0]?.value ?? 0,
      likedTracks: likedTracksTotal,
      followedArtists: followsCountRows[0]?.value ?? 0,
      plays: playsCountRows[0]?.value ?? 0
    },
    playlists: playlistRows,
    likedTracks: likedTrackRows,
    history: historyRows,
    followedArtists: followedArtistRows
  };
}

/** Perfil privado do usuário autenticado (inclui curtidas, histórico e playlists privadas). */
export async function getUserProfile(userId: string) {
  return loadProfile(userId, true);
}

function decodeSlug(slug: string) {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

/**
 * Perfil público: aceita o id do usuário ou o nome (URL-encoded) como slug.
 * Nunca retorna dados privados. `cache` evita consultas duplicadas entre
 * `generateMetadata` e a página.
 */
export const getPublicProfileBySlug = cache(async (slug: string) => {
  const decoded = decodeSlug(slug);

  const [profileUser] = await db
    .select({ id: user.id })
    .from(user)
    .where(or(eq(user.id, slug), eq(user.name, decoded)))
    .orderBy(desc(user.createdAt))
    .limit(1);

  if (!profileUser) return null;

  return loadProfile(profileUser.id, false);
});
