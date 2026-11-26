'use client';

import { CoverArt } from '@/components/cover-art';
import { usePlayerStore } from '@/features/player/player-store';
import { formatTime } from '@/features/player/utils/format-time';
import { cn } from '@/lib/utils';
import { Pause, Play } from 'lucide-react';

export type ProfileTrackListItem = {
  id: string;
  title: string;
  artist: string | null;
  album: string | null;
  coverUrl: string | null;
  audioUrl: string;
  durationMs: number;
  /** Texto auxiliar exibido no desktop (ex.: "Curtida em ..."). */
  meta: string;
};

type ProfileTrackListProps = {
  items: readonly ProfileTrackListItem[];
  contextId: string;
};

const GRADIENTS = [
  'from-violet-600 via-fuchsia-600 to-indigo-900',
  'from-amber-400 via-orange-500 to-rose-600',
  'from-sky-500 via-cyan-500 to-emerald-600',
  'from-rose-500 via-pink-600 to-purple-800',
  'from-emerald-500 via-teal-500 to-cyan-800',
  'from-slate-600 via-slate-800 to-black'
];

export function ProfileTrackList({ items, contextId }: ProfileTrackListProps) {
  const playQueue = usePlayerStore(state => state.playQueue);
  const togglePlay = usePlayerStore(state => state.togglePlay);
  const currentTrackId = usePlayerStore(state =>
    state.currentIndex >= 0 ? state.queue[state.currentIndex]?.id : undefined
  );
  const isPlaying = usePlayerStore(state => state.isPlaying);

  function handlePlay(index: number) {
    const item = items[index];
    if (!item) return;

    if (item.id === currentTrackId) {
      togglePlay();
      return;
    }

    playQueue(
      items.map((track, trackIndex) => ({
        id: track.id,
        title: track.title,
        artist: track.artist ?? 'Artista desconhecido',
        audioUrl: track.audioUrl,
        durationMs: track.durationMs,
        coverUrl: track.coverUrl,
        gradient: GRADIENTS[trackIndex % GRADIENTS.length]
      })),
      index,
      contextId
    );
  }

  return (
    <ol className="flex flex-col divide-y divide-border/60">
      {items.map((item, index) => {
        const isCurrent = item.id === currentTrackId;
        const isCurrentPlaying = isCurrent && isPlaying;
        const subtitle =
          [item.artist, item.album].filter(Boolean).join(' · ') ||
          'Artista desconhecido';

        return (
          <li
            key={`${item.id}-${index}`}
            className="group flex items-center gap-3 py-2.5 first:pt-0 last:pb-0"
          >
            <button
              type="button"
              onClick={() => handlePlay(index)}
              aria-label={
                isCurrentPlaying
                  ? `Pausar ${item.title}`
                  : `Tocar ${item.title}`
              }
              className="group/play relative size-12 shrink-0 overflow-hidden rounded-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              {item.coverUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- capas de domínios externos ainda sem remotePatterns
                <img
                  src={item.coverUrl}
                  alt=""
                  className="size-12 rounded-lg object-cover"
                />
              ) : (
                <CoverArt
                  gradient={GRADIENTS[index % GRADIENTS.length]!}
                  className="size-12 rounded-lg"
                />
              )}
              <span
                className={cn(
                  'absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 transition-opacity group-hover/play:opacity-100 group-focus-visible/play:opacity-100',
                  isCurrent && 'opacity-100'
                )}
              >
                {isCurrentPlaying ? (
                  <Pause className="size-4 fill-current" aria-hidden="true" />
                ) : (
                  <Play className="size-4 fill-current" aria-hidden="true" />
                )}
              </span>
            </button>

            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  'truncate text-sm font-medium',
                  isCurrent ? 'text-gold' : 'text-foreground'
                )}
              >
                {item.title}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {subtitle}
              </p>
            </div>

            <span className="hidden shrink-0 text-xs text-muted-foreground sm:block">
              {item.meta}
            </span>

            <span className="w-10 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
              {formatTime(item.durationMs)}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
