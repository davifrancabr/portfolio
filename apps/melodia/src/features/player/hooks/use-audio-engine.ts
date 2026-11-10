'use client';

import { useEffect, type RefObject } from 'react';
import { usePlayerStore } from '../player-store';

function isMediaSessionSupported() {
  return typeof navigator !== 'undefined' && 'mediaSession' in navigator;
}

function syncMediaSessionPosition(audio: HTMLAudioElement) {
  if (!isMediaSessionSupported()) return;
  if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;
  try {
    navigator.mediaSession.setPositionState({
      duration: audio.duration,
      playbackRate: audio.playbackRate,
      position: Math.min(audio.currentTime, audio.duration)
    });
  } catch {
    // Best-effort: navegadores podem rejeitar estados de posição.
  }
}

/**
 * Sincroniza o `<audio>` (dono do estado real de reprodução) com a store
 * do player. A store é a fonte da verdade para `isPlaying`; os eventos do
 * elemento reportam posição, duração e fim de faixa.
 */
export function useAudioEngine(audioRef: RefObject<HTMLAudioElement | null>) {
  const track = usePlayerStore(s =>
    s.currentIndex >= 0 ? s.queue[s.currentIndex] : null
  );
  const isPlaying = usePlayerStore(s => s.isPlaying);
  const volume = usePlayerStore(s => s.volume);
  const isMuted = usePlayerStore(s => s.isMuted);
  const repeat = usePlayerStore(s => s.repeat);
  const seekVersion = usePlayerStore(s => s.seekVersion);

  // Carrega a fonte sempre que a faixa atual muda.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!track) {
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
      return;
    }

    audio.src = track.audioUrl;
    audio.load();

    const store = usePlayerStore.getState();
    store.setPositionMs(0);
    store.setDurationMs(track.durationMs);
  }, [track, audioRef]);

  // Play/pause. Rejeições AbortError são trocas de faixa, não erros.
  // `seekVersion` entra nas dependências para retomar após reinícios
  // automáticos (repetir faixa/fila), quando `isPlaying` não muda.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !track) return;

    if (isMediaSessionSupported()) {
      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
    }

    if (!isPlaying) {
      audio.pause();
      return;
    }

    audio.play().catch(error => {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return;
      }
      console.error('[player] failed to play audio', error);
      usePlayerStore.setState({ isPlaying: false });
    });
  }, [isPlaying, track, seekVersion, audioRef]);

  // Volume e mudo.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    audio.muted = isMuted;
  }, [volume, isMuted, audioRef]);

  // Repetir faixa usa o loop nativo do elemento.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.loop = repeat === 'one';
  }, [repeat, audioRef]);

  // Aplica seeks explícitos (o fluxo contrário vem do timeupdate).
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.readyState < HTMLMediaElement.HAVE_METADATA) return;
    audio.currentTime = usePlayerStore.getState().positionMs / 1000;
  }, [seekVersion, audioRef]);

  // Eventos do elemento → store.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      usePlayerStore.getState().setPositionMs(audio.currentTime * 1000);
      syncMediaSessionPosition(audio);
    };

    const onLoadedMetadata = () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        usePlayerStore.getState().setDurationMs(audio.duration * 1000);
      }
      syncMediaSessionPosition(audio);
    };

    const onEnded = () => usePlayerStore.getState().handleEnded();

    const onError = () => {
      if (!audio.error) return;
      console.error('[player] failed to load audio', audio.error);
      usePlayerStore.setState({ isPlaying: false });
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, [audioRef]);

  // Metadados exibidos nas notificações/controles do sistema.
  useEffect(() => {
    if (!isMediaSessionSupported()) return;
    if (!track) {
      navigator.mediaSession.metadata = null;
      return;
    }
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: track.artist,
      artwork: track.coverUrl ? [{ src: track.coverUrl, sizes: '512x512' }] : []
    });
  }, [track]);

  // Ações de mídia do sistema (teclas de mídia, controles do OS).
  useEffect(() => {
    if (!isMediaSessionSupported()) return;

    const handlers: ReadonlyArray<
      [MediaSessionAction, MediaSessionActionHandler]
    > = [
      ['play', () => usePlayerStore.setState({ isPlaying: true })],
      ['pause', () => usePlayerStore.setState({ isPlaying: false })],
      ['previoustrack', () => usePlayerStore.getState().previous()],
      ['nexttrack', () => usePlayerStore.getState().next()],
      [
        'seekto',
        details => {
          if (typeof details.seekTime === 'number') {
            usePlayerStore.getState().seek(details.seekTime * 1000);
          }
        }
      ]
    ];

    for (const [action, handler] of handlers) {
      try {
        navigator.mediaSession.setActionHandler(action, handler);
      } catch {
        // Ação não suportada neste navegador.
      }
    }

    return () => {
      for (const [action] of handlers) {
        try {
          navigator.mediaSession.setActionHandler(action, null);
        } catch {
          // noop
        }
      }
    };
  }, []);
}
