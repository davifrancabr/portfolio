'use client';

import { Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePlayerStore } from '@/features/player/player-store';
import { cn } from '@/lib/utils';
import { featuredTracks } from '../data';

const FEATURED_CONTEXT_ID = 'collection:meia-noite-em-copacabana';

export function PlayFeaturedButton({ className }: { className?: string }) {
  const isPlayingFeatured = usePlayerStore(
    s => s.contextId === FEATURED_CONTEXT_ID && s.isPlaying
  );

  function handleClick() {
    const player = usePlayerStore.getState();
    if (player.contextId === FEATURED_CONTEXT_ID) {
      player.togglePlay();
      return;
    }
    player.playQueue(featuredTracks, 0, FEATURED_CONTEXT_ID);
  }

  return (
    <Button
      size="lg"
      onClick={handleClick}
      aria-label={
        isPlayingFeatured
          ? 'Pausar Meia-noite em Copacabana'
          : 'Ouvir Meia-noite em Copacabana agora'
      }
      className={cn('bg-gold text-gold-foreground hover:bg-gold/90', className)}
    >
      {isPlayingFeatured ? (
        <Pause className="size-4 fill-current" aria-hidden="true" />
      ) : (
        <Play className="size-4 fill-current" aria-hidden="true" />
      )}
      {isPlayingFeatured ? 'Pausar' : 'Ouvir agora'}
    </Button>
  );
}
