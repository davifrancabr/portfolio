'use client';

import {
  Pause,
  Play,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePlayerStore, type RepeatMode } from '../player-store';
import { ControlButton } from './control-button';
import { PlayerSeekbar } from './player-seekbar';

const REPEAT_LABEL: Record<RepeatMode, string> = {
  off: 'Repetição desativada',
  all: 'Repetir fila',
  one: 'Repetir faixa atual'
};

export function PlayerControls() {
  const isPlaying = usePlayerStore(s => s.isPlaying);
  const shuffle = usePlayerStore(s => s.shuffle);
  const repeat = usePlayerStore(s => s.repeat);
  const togglePlay = usePlayerStore(s => s.togglePlay);
  const next = usePlayerStore(s => s.next);
  const previous = usePlayerStore(s => s.previous);
  const toggleShuffle = usePlayerStore(s => s.toggleShuffle);
  const cycleRepeat = usePlayerStore(s => s.cycleRepeat);

  const RepeatIcon = repeat === 'one' ? Repeat1 : Repeat;

  return (
    <div className="flex min-w-0 flex-col items-center gap-1 sm:w-full">
      <div className="flex items-center gap-0.5 sm:gap-1.5">
        <ControlButton
          icon={Shuffle}
          label="Aleatório"
          onClick={toggleShuffle}
          active={shuffle}
          className="hidden sm:inline-flex"
        />
        <ControlButton
          icon={SkipBack}
          label="Faixa anterior"
          onClick={previous}
        />
        <Button
          size="icon"
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pausar' : 'Reproduzir'}
          className="rounded-full bg-foreground text-background hover:bg-foreground/85"
        >
          {isPlaying ? (
            <Pause className="size-4 fill-current" aria-hidden="true" />
          ) : (
            <Play
              className="size-4 translate-x-px fill-current"
              aria-hidden="true"
            />
          )}
        </Button>
        <ControlButton
          icon={SkipForward}
          label="Próxima faixa"
          onClick={next}
        />
        <ControlButton
          icon={RepeatIcon}
          label={REPEAT_LABEL[repeat]}
          onClick={cycleRepeat}
          active={repeat !== 'off'}
          className="hidden sm:inline-flex"
        />
      </div>
      <PlayerSeekbar />
    </div>
  );
}
