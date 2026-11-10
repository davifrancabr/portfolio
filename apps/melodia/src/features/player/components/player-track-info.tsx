'use client';

import { CoverArt } from '@/components/cover-art';
import type { PlayerTrack } from '../player-store';

const FALLBACK_GRADIENT = 'from-violet-600 via-fuchsia-600 to-indigo-900';

export function PlayerTrackInfo({ track }: { track: PlayerTrack }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      {track.coverUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- capas de domínios externos ainda sem remotePatterns
        <img
          src={track.coverUrl}
          alt=""
          className="size-11 shrink-0 rounded-lg object-cover sm:size-12"
        />
      ) : (
        <CoverArt
          gradient={track.gradient ?? FALLBACK_GRADIENT}
          className="size-11 shrink-0 rounded-lg sm:size-12"
        />
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">
          {track.title}
        </p>
        <p className="truncate text-xs text-muted-foreground">{track.artist}</p>
      </div>
    </div>
  );
}
