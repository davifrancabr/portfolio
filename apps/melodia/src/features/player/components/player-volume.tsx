'use client';

import { Volume1, Volume2, VolumeX } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { usePlayerStore } from '../player-store';
import { toSingleSliderValue } from '../utils/slider-value';
import { ControlButton } from './control-button';

export function PlayerVolume() {
  const volume = usePlayerStore(s => s.volume);
  const isMuted = usePlayerStore(s => s.isMuted);
  const setVolume = usePlayerStore(s => s.setVolume);
  const toggleMute = usePlayerStore(s => s.toggleMute);

  const effectiveVolume = isMuted ? 0 : volume;
  const VolumeIcon =
    effectiveVolume === 0 ? VolumeX : effectiveVolume < 0.5 ? Volume1 : Volume2;
  const isSilenced = isMuted || volume === 0;

  return (
    <div className="hidden items-center justify-end gap-1.5 sm:flex">
      <ControlButton
        icon={VolumeIcon}
        label={isSilenced ? 'Ativar som' : 'Silenciar'}
        onClick={toggleMute}
      />
      <Slider
        className="w-24"
        aria-label="Volume"
        value={[effectiveVolume]}
        min={0}
        max={1}
        step={0.01}
        onValueChange={value => setVolume(toSingleSliderValue(value))}
      />
    </div>
  );
}
