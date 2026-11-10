'use client';

import { usePlayerStore } from '../player-store';
import { PlayerControls } from './player-controls';
import { PlayerTrackInfo } from './player-track-info';
import { PlayerVolume } from './player-volume';

export function PlayerBar() {
  const track = usePlayerStore(s =>
    s.currentIndex >= 0 ? s.queue[s.currentIndex] : null
  );
  const positionMs = usePlayerStore(s => s.positionMs);
  const durationMs = usePlayerStore(s => s.durationMs);

  if (!track) return null;

  const progress =
    durationMs > 0 ? Math.min((positionMs / durationMs) * 100, 100) : 0;

  return (
    <footer className="sticky bottom-0 z-40 border-t border-border bg-surface-3/95 pb-[env(safe-area-inset-bottom)] text-foreground shadow-[0_-8px_24px_-16px_rgba(0,0,0,0.4)] backdrop-blur">
      {/* Progresso compacto em telas pequenas */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-0.5 overflow-hidden bg-border sm:hidden"
      >
        <div className="h-full bg-gold" style={{ width: `${progress}%` }} />
      </div>

      <div className="relative mx-auto grid h-16 w-full max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-4 sm:h-20 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,1fr)] sm:gap-4 sm:px-6">
        <PlayerTrackInfo track={track} />
        <PlayerControls />
        <PlayerVolume />
      </div>
    </footer>
  );
}
