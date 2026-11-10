import type { PlayerTrack } from '@/features/player/player-store';

export type Collection = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  gradient: string;
};

export const featured = {
  title: 'Meia-noite em Copacabana',
  artist: 'Melodia Sessions',
  description:
    'Uma seleção de bossa, jazz e MPB para acompanhar a cidade quando as luzes acendem.',
  href: '/playlist?collection=meia-noite-em-copacabana',
  gradient: 'from-violet-600 via-fuchsia-600 to-indigo-900'
} as const;

export const recentlyPlayed: Collection[] = [
  {
    id: 'chuva-de-verao',
    title: 'Chuva de Verão',
    subtitle: 'Ana Ribeiro',
    href: '/playlist?collection=chuva-de-verao',
    gradient: 'from-amber-400 via-orange-500 to-rose-600'
  },
  {
    id: 'neon-e-saudade',
    title: 'Neon e Saudade',
    subtitle: 'Os Astronautas',
    href: '/playlist?collection=neon-e-saudade',
    gradient: 'from-sky-500 via-cyan-500 to-emerald-600'
  },
  {
    id: 'cafe-com-jazz',
    title: 'Café com Jazz',
    subtitle: 'Trio Azul',
    href: '/playlist?collection=cafe-com-jazz',
    gradient: 'from-rose-500 via-pink-600 to-purple-800'
  },
  {
    id: 'ritmo-da-rua',
    title: 'Ritmo da Rua',
    subtitle: 'MC Horizonte',
    href: '/playlist?collection=ritmo-da-rua',
    gradient: 'from-emerald-500 via-teal-500 to-cyan-800'
  },
  {
    id: 'lo-fi-para-focar',
    title: 'Lo-fi para focar',
    subtitle: 'Melodia',
    href: '/playlist?collection=lo-fi-para-focar',
    gradient: 'from-slate-600 via-slate-800 to-black'
  },
  {
    id: 'meia-noite-em-copacabana',
    title: 'Meia-noite em Copacabana',
    subtitle: 'Melodia Sessions',
    href: '/playlist?collection=meia-noite-em-copacabana',
    gradient: 'from-violet-600 via-fuchsia-600 to-indigo-900'
  }
];

export const madeForYou: Collection[] = [
  {
    id: 'descobertas-da-semana',
    title: 'Descobertas da semana',
    subtitle: 'Novidades escolhidas para você',
    href: '/playlist?collection=descobertas-da-semana',
    gradient: 'from-fuchsia-500 via-purple-600 to-indigo-900'
  },
  {
    id: 'favoritas-do-momento',
    title: 'Favoritas do momento',
    subtitle: 'O que você não sai de repetir',
    href: '/playlist?collection=favoritas-do-momento',
    gradient: 'from-orange-400 via-red-500 to-pink-700'
  },
  {
    id: 'para-cantar-no-chuveiro',
    title: 'Para cantar no chuveiro',
    subtitle: 'Clássicos que todo mundo sabe',
    href: '/playlist?collection=para-cantar-no-chuveiro',
    gradient: 'from-lime-400 via-emerald-500 to-teal-700'
  },
  {
    id: 'concentracao-total',
    title: 'Concentração total',
    subtitle: 'Instrumental para manter o foco',
    href: '/playlist?collection=concentracao-total',
    gradient: 'from-blue-500 via-indigo-600 to-violet-900'
  },
  {
    id: 'classicos-do-samba',
    title: 'Clássicos do samba',
    subtitle: 'Roda de samba para qualquer hora',
    href: '/playlist?collection=classicos-do-samba',
    gradient: 'from-yellow-400 via-amber-500 to-orange-700'
  },
  {
    id: 'indie-brasileiro',
    title: 'Indie brasileiro',
    subtitle: 'Guitarras e vozes da nova cena',
    href: '/playlist?collection=indie-brasileiro',
    gradient: 'from-cyan-400 via-sky-600 to-blue-900'
  }
];

export const genres = [
  'Pop',
  'Samba',
  'Rock',
  'MPB',
  'Hip-hop',
  'Eletrônica',
  'Jazz',
  'Lo-fi'
] as const;

/**
 * Faixas de demonstração da coleção em destaque. O áudio vem de exemplos
 * públicos (SoundHelix) e serve apenas para exercitar o player até o
 * catálogo real existir (com URLs de áudio assinadas). `durationMs` é
 * aproximado; os metadados carregados corrigem o valor.
 */
export const featuredTracks: readonly PlayerTrack[] = [
  {
    id: 'demo-chuva-de-verao',
    title: 'Chuva de Verão',
    artist: 'Ana Ribeiro',
    gradient: 'from-amber-400 via-orange-500 to-rose-600',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    durationMs: 322_000
  },
  {
    id: 'demo-neon-e-saudade',
    title: 'Neon e Saudade',
    artist: 'Os Astronautas',
    gradient: 'from-sky-500 via-cyan-500 to-emerald-600',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    durationMs: 316_000
  },
  {
    id: 'demo-cafe-com-jazz',
    title: 'Café com Jazz',
    artist: 'Trio Azul',
    gradient: 'from-rose-500 via-pink-600 to-purple-800',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    durationMs: 297_000
  },
  {
    id: 'demo-meia-noite-em-copacabana',
    title: 'Meia-noite em Copacabana',
    artist: 'Melodia Sessions',
    gradient: featured.gradient,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    durationMs: 349_000
  }
];
