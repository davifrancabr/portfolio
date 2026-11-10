'use client';

import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { usePlayerStore } from '../player-store';
import { formatTime } from '../utils/format-time';
import { toSingleSliderValue } from '../utils/slider-value';

export function PlayerSeekbar() {
  const positionMs = usePlayerStore(s => s.positionMs);
  const durationMs = usePlayerStore(s => s.durationMs);
  const seek = usePlayerStore(s => s.seek);
  const [scrubMs, setScrubMs] = useState<number | null>(null);

  // Enquanto arrasta, exibimos a posição do polegar em vez da real.
  const displayedMs = scrubMs ?? positionMs;
  const maxSeconds = Math.max(durationMs / 1000, 1);

  return (
    <div className="hidden w-full items-center gap-2.5 sm:flex">
      <span className="w-10 text-right text-xs tabular-nums text-muted-foreground">
        {formatTime(displayedMs)}
      </span>
      <Slider
        className="flex-1"
        aria-label="Posição da faixa"
        value={[Math.min(displayedMs / 1000, maxSeconds)]}
        max={maxSeconds}
        step={1}
        onValueChange={value => setScrubMs(toSingleSliderValue(value) * 1000)}
        onValueCommitted={value => {
          seek(toSingleSliderValue(value) * 1000);
          setScrubMs(null);
        }}
      />
      <span className="w-10 text-xs tabular-nums text-muted-foreground">
        {formatTime(durationMs)}
      </span>
    </div>
  );
}
