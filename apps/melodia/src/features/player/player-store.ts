import { createJSONStorage, persist } from 'zustand/middleware';
import { create } from 'zustand';

export type RepeatMode = 'off' | 'all' | 'one';

/**
 * Faixa no contexto do player. Hoje alimentada por dados de demonstração;
 * quando o catálogo existir, as queries do servidor mapeiam `tracks` para
 * este formato (incluindo a URL de áudio assinada).
 */
export type PlayerTrack = {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
  /** Duração conhecida antes dos metadados carregarem. */
  durationMs: number;
  coverUrl?: string | null;
  /** Gradiente usado quando não há imagem de capa. */
  gradient?: string | null;
};

type PlayerState = {
  queue: readonly PlayerTrack[];
  currentIndex: number;
  /** Identifica a coleção/origem da fila em reprodução. */
  contextId: string | null;
  isPlaying: boolean;
  positionMs: number;
  durationMs: number;
  volume: number;
  isMuted: boolean;
  shuffle: boolean;
  repeat: RepeatMode;
  /** Incrementa a cada seek explícito; o motor de áudio observa isso. */
  seekVersion: number;
};

type PlayerActions = {
  playQueue: (
    tracks: readonly PlayerTrack[],
    startIndex?: number,
    contextId?: string | null
  ) => void;
  togglePlay: () => void;
  pause: () => void;
  next: () => void;
  previous: () => void;
  handleEnded: () => void;
  seek: (ms: number) => void;
  /** Posição reportada pelo elemento de áudio (não dispara seek). */
  setPositionMs: (ms: number) => void;
  setDurationMs: (ms: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  clear: () => void;
};

export type PlayerStore = PlayerState & PlayerActions;

const DEFAULT_STATE: PlayerState = {
  queue: [],
  currentIndex: -1,
  contextId: null,
  isPlaying: false,
  positionMs: 0,
  durationMs: 0,
  volume: 0.8,
  isMuted: false,
  shuffle: false,
  repeat: 'off',
  seekVersion: 0
};

/** Voltar reinicia a faixa após 3s ou mais reproduzidos. */
const PREVIOUS_RESTART_THRESHOLD_MS = 3000;

const REPEAT_SEQUENCE: readonly RepeatMode[] = ['off', 'all', 'one'];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Índice da próxima faixa. `-1` significa "pare no fim da fila"
 * (só ocorre quando não deve dar a volta).
 */
function resolveNextIndex(
  queue: readonly PlayerTrack[],
  currentIndex: number,
  options: { shuffle: boolean; wrap: boolean }
): number {
  if (queue.length <= 1) return currentIndex;
  if (options.shuffle) {
    let candidate = currentIndex;
    while (candidate === currentIndex) {
      candidate = Math.floor(Math.random() * queue.length);
    }
    return candidate;
  }
  if (currentIndex + 1 < queue.length) return currentIndex + 1;
  return options.wrap ? 0 : -1;
}

export const usePlayerStore = create<PlayerStore>()(
  persist(
    (set, get) => {
      // Troca de faixa preservando o estado de reprodução atual.
      const goToIndex = (index: number) => {
        const state = get();
        const track = state.queue[index];
        if (!track) return;
        set({
          currentIndex: index,
          positionMs: 0,
          durationMs: track.durationMs,
          seekVersion: state.seekVersion + 1
        });
      };

      /** Volta ao início preservando pausado/playing (ação do usuário). */
      const seekToStart = () => {
        set(state => ({
          positionMs: 0,
          seekVersion: state.seekVersion + 1
        }));
      };

      /** Reinicia garantindo reprodução (fim de faixa automático). */
      const restartPlayback = () => {
        set(state => ({
          isPlaying: true,
          positionMs: 0,
          seekVersion: state.seekVersion + 1
        }));
      };

      return {
        ...DEFAULT_STATE,

        playQueue: (tracks, startIndex = 0, contextId = null) => {
          if (tracks.length === 0) return;
          const index = clamp(startIndex, 0, tracks.length - 1);
          const track = tracks[index];
          if (!track) return;
          set({
            queue: [...tracks],
            currentIndex: index,
            contextId,
            isPlaying: true,
            positionMs: 0,
            durationMs: track.durationMs,
            seekVersion: get().seekVersion + 1
          });
        },

        togglePlay: () => {
          const { currentIndex, queue, isPlaying } = get();
          if (currentIndex < 0 || !queue[currentIndex]) return;
          set({ isPlaying: !isPlaying });
        },

        pause: () => set({ isPlaying: false }),

        next: () => {
          const state = get();
          if (state.currentIndex < 0 || state.queue.length === 0) return;
          if (state.queue.length === 1) {
            seekToStart();
            return;
          }
          const index = resolveNextIndex(state.queue, state.currentIndex, {
            shuffle: state.shuffle,
            wrap: true
          });
          goToIndex(index);
        },

        previous: () => {
          const state = get();
          if (state.currentIndex < 0 || state.queue.length === 0) return;
          if (
            state.positionMs > PREVIOUS_RESTART_THRESHOLD_MS ||
            state.queue.length === 1
          ) {
            state.seek(0);
            return;
          }
          const index =
            state.currentIndex > 0
              ? state.currentIndex - 1
              : state.queue.length - 1;
          goToIndex(index);
        },

        handleEnded: () => {
          const state = get();
          if (state.currentIndex < 0) return;
          if (
            state.repeat === 'one' ||
            (state.repeat === 'all' && state.queue.length <= 1)
          ) {
            restartPlayback();
            return;
          }
          const index = resolveNextIndex(state.queue, state.currentIndex, {
            shuffle: state.shuffle,
            wrap: state.repeat === 'all'
          });
          if (index < 0 || index === state.currentIndex) {
            set({ isPlaying: false, positionMs: 0 });
            return;
          }
          goToIndex(index);
        },

        seek: ms => {
          const { durationMs } = get();
          const max = durationMs > 0 ? durationMs : Number.MAX_SAFE_INTEGER;
          set(state => ({
            positionMs: clamp(ms, 0, max),
            seekVersion: state.seekVersion + 1
          }));
        },

        setPositionMs: ms => set({ positionMs: Math.max(ms, 0) }),

        setDurationMs: ms =>
          set({ durationMs: Number.isFinite(ms) ? Math.max(ms, 0) : 0 }),

        setVolume: volume =>
          set({ volume: clamp(volume, 0, 1), isMuted: volume <= 0 }),

        toggleMute: () => set(state => ({ isMuted: !state.isMuted })),

        toggleShuffle: () => set(state => ({ shuffle: !state.shuffle })),

        cycleRepeat: () =>
          set(state => {
            const position = REPEAT_SEQUENCE.indexOf(state.repeat);
            const nextMode = REPEAT_SEQUENCE[(position + 1) % 3];
            return { repeat: nextMode };
          }),

        clear: () => set(DEFAULT_STATE)
      };
    },
    {
      name: 'melodia-player-preferences',
      version: 1,
      storage: createJSONStorage(() => {
        // Não acessa localStorage durante SSR/prerender; o
        // createJSONStorage captura o erro e desativa a persistência.
        if (typeof window === 'undefined') {
          throw new Error('localStorage is only available in the browser');
        }
        return window.localStorage;
      }),
      partialize: state => ({
        volume: state.volume,
        isMuted: state.isMuted,
        shuffle: state.shuffle,
        repeat: state.repeat
      }),
      // Evita divergência entre SSR e primeira renderização no cliente.
      skipHydration: true
    }
  )
);
