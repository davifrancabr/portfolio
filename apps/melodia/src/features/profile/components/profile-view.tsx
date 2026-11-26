import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from '@/components/ui/empty';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { UserProfile } from '@/server/queries/profile';
import {
  Headphones,
  Heart,
  History,
  ListMusic,
  UserRoundCheck
} from 'lucide-react';
import { formatDate, formatDateTime } from '../utils/formatDate';
import { ProfileArtists } from './profile-artists';
import { ProfileHero } from './profile-hero';
import { ProfilePlaylists } from './profile-playlists';
import { ProfileStats, type ProfileStatItem } from './profile-stats';
import {
  ProfileTrackList,
  type ProfileTrackListItem
} from './profile-track-list';

type ProfileViewProps = {
  profile: UserProfile;
  isOwner: boolean;
};

export function ProfileView({ profile, isOwner }: Readonly<ProfileViewProps>) {
  const statItems: ProfileStatItem[] = [
    {
      label: isOwner ? 'Playlists' : 'Playlists públicas',
      value: profile.stats.playlists,
      icon: ListMusic
    },
    ...(isOwner
      ? [
          {
            label: 'Músicas curtidas',
            value: profile.stats.likedTracks,
            icon: Heart
          }
        ]
      : []),
    {
      label: 'Artistas seguidos',
      value: profile.stats.followedArtists,
      icon: UserRoundCheck
    },
    {
      label: 'Reproduções',
      value: profile.stats.plays,
      icon: Headphones
    }
  ];

  const likedItems: ProfileTrackListItem[] = profile.likedTracks.map(track => ({
    id: track.id,
    title: track.title,
    artist: track.artist,
    album: track.album,
    coverUrl: track.coverUrl,
    audioUrl: track.audioUrl,
    durationMs: track.durationMs,
    meta: `Curtida em ${formatDate(track.likedAt)}`
  }));

  const historyItems: ProfileTrackListItem[] = profile.history.map(entry => ({
    // Usa o id do registro para diferenciar reproduções repetidas da mesma faixa.
    id: entry.id,
    title: entry.title,
    artist: entry.artist,
    album: entry.album,
    coverUrl: entry.coverUrl,
    audioUrl: entry.audioUrl,
    durationMs: entry.durationMs,
    meta: `Tocada em ${formatDateTime(entry.playedAt)}`
  }));

  return (
    <main className="flex-1 bg-surface pb-16 text-foreground">
      <div className="mx-auto w-full max-w-6xl px-4 pt-8 sm:px-6 lg:px-8">
        <ProfileHero profileUser={profile.user} isOwner={isOwner} />
        <ProfileStats items={statItems} />

        <Tabs defaultValue="playlists" className="mt-8">
          <TabsList className="max-w-full justify-start overflow-x-auto">
            <TabsTrigger value="playlists">
              <ListMusic aria-hidden="true" />
              Playlists
              <span className="text-xs tabular-nums opacity-70">
                {profile.stats.playlists}
              </span>
            </TabsTrigger>

            {isOwner && (
              <TabsTrigger value="liked">
                <Heart aria-hidden="true" />
                Curtidas
                <span className="text-xs tabular-nums opacity-70">
                  {profile.stats.likedTracks}
                </span>
              </TabsTrigger>
            )}

            {isOwner && (
              <TabsTrigger value="history">
                <History aria-hidden="true" />
                Histórico
                <span className="text-xs tabular-nums opacity-70">
                  {profile.stats.plays}
                </span>
              </TabsTrigger>
            )}

            <TabsTrigger value="artists">
              <UserRoundCheck aria-hidden="true" />
              Artistas
              <span className="text-xs tabular-nums opacity-70">
                {profile.stats.followedArtists}
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="playlists" className="pt-5">
            <ProfilePlaylists playlists={profile.playlists} isOwner={isOwner} />
          </TabsContent>

          {isOwner && (
            <TabsContent value="liked" className="pt-5">
              {likedItems.length === 0 ? (
                <Empty className="border bg-surface-2/60">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <Heart aria-hidden="true" />
                    </EmptyMedia>
                    <EmptyTitle>Nenhuma música curtida</EmptyTitle>
                    <EmptyDescription>
                      Toque no coração de uma faixa para encontrá-la aqui.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              ) : (
                <ProfileTrackList
                  items={likedItems}
                  contextId={`profile-liked-${profile.user.id}`}
                />
              )}
            </TabsContent>
          )}

          {isOwner && (
            <TabsContent value="history" className="pt-5">
              {historyItems.length === 0 ? (
                <Empty className="border bg-surface-2/60">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <History aria-hidden="true" />
                    </EmptyMedia>
                    <EmptyTitle>Nada no histórico ainda</EmptyTitle>
                    <EmptyDescription>
                      As reproduções com pelo menos 30 segundos vão aparecer
                      aqui.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              ) : (
                <ProfileTrackList
                  items={historyItems}
                  contextId={`profile-history-${profile.user.id}`}
                />
              )}
            </TabsContent>
          )}

          <TabsContent value="artists" className="pt-5">
            <ProfileArtists
              artists={profile.followedArtists}
              isOwner={isOwner}
            />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
