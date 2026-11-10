'use client';

import { useEffect, useRef } from 'react';
import { useAudioEngine } from '../hooks/use-audio-engine';
import { usePlayerStore } from '../player-store';
import { PlayerBar } from './player-bar';

/**
 * Player persistente: montado no layout da área logada, mantém um único
 * elemento `<audio>` vivo durante a navegação entre rotas.
 */
export function Player() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  useAudioEngine(audioRef);

  // Rehidrata preferências persistidas (volume, aleatório, repetição)
  // após o mount para evitar divergência entre SSR e cliente.
  useEffect(() => {
    void usePlayerStore.persist.rehydrate();
  }, []);

  return (
    <>
      <audio ref={audioRef} preload="metadata" />
      <PlayerBar />
    </>
  );
}
