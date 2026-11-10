import 'server-only';
import { count, desc, eq, gt } from 'drizzle-orm';
import { db } from '@/db';
import {
  albums,
  artists,
  playHistory,
  playlists,
  tracks,
  user
} from '@/db/schemas';

export type AdminStats = {
  users: number;
  artists: number;
  albums: number;
  tracks: number;
  playlists: number;
  plays: number;
};

export type AdminRecentUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  banned: boolean;
  createdAt: Date;
};

export type AdminTopTrack = {
  id: string;
  title: string;
  artist: string | null;
  playCount: number;
};

export type AdminRecentPlay = {
  id: string;
  trackTitle: string;
  userName: string;
  playedAt: Date;
};

export type AdminOverview = {
  stats: AdminStats;
  recentUsers: AdminRecentUser[];
  topTracks: AdminTopTrack[];
  recentPlays: AdminRecentPlay[];
};

/**
 * Indicadores gerais do painel administrativo. Somente leitura e executado no
 * servidor; a autorização fica a cargo de `requireAdmin()` na página/ação.
 */
export async function getAdminOverview(): Promise<AdminOverview> {
  const [
    [{ value: users }],
    [{ value: artistsTotal }],
    [{ value: albumsTotal }],
    [{ value: tracksTotal }],
    [{ value: playlistsTotal }],
    [{ value: plays }],
    recentUsers,
    topTracks,
    recentPlays
  ] = await Promise.all([
    db.select({ value: count() }).from(user),
    db.select({ value: count() }).from(artists),
    db.select({ value: count() }).from(albums),
    db.select({ value: count() }).from(tracks),
    db.select({ value: count() }).from(playlists),
    db.select({ value: count() }).from(playHistory),
    db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        banned: user.banned,
        createdAt: user.createdAt
      })
      .from(user)
      .orderBy(desc(user.createdAt))
      .limit(5),
    db
      .select({
        id: tracks.id,
        title: tracks.title,
        artist: artists.name,
        playCount: tracks.playCount
      })
      .from(tracks)
      .leftJoin(albums, eq(tracks.albumId, albums.id))
      .leftJoin(artists, eq(albums.primaryArtistId, artists.id))
      .where(gt(tracks.playCount, 0))
      .orderBy(desc(tracks.playCount), desc(tracks.createdAt))
      .limit(5),
    db
      .select({
        id: playHistory.id,
        trackTitle: tracks.title,
        userName: user.name,
        playedAt: playHistory.playedAt
      })
      .from(playHistory)
      .innerJoin(tracks, eq(playHistory.trackId, tracks.id))
      .innerJoin(user, eq(playHistory.userId, user.id))
      .orderBy(desc(playHistory.playedAt))
      .limit(6)
  ]);

  return {
    stats: {
      users,
      artists: artistsTotal,
      albums: albumsTotal,
      tracks: tracksTotal,
      playlists: playlistsTotal,
      plays
    },
    recentUsers: recentUsers.map(recentUser => ({
      ...recentUser,
      role: recentUser.role ?? 'user',
      banned: recentUser.banned ?? false
    })),
    topTracks,
    recentPlays
  };
}
