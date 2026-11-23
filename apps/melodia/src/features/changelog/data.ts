import { Bug, Palette, Sparkles, Wrench, type LucideIcon } from 'lucide-react';

export type ChangeKind = 'feature' | 'improvement' | 'fix' | 'design';

export type ChangeKindMeta = {
  label: string;
  plural: string;
  description: string;
  icon: LucideIcon;
  badgeClassName: string;
  iconClassName: string;
};

export type ChangelogItem = {
  id: string;
  kind: ChangeKind;
  title: string;
  description: string;
  route?: string;
};

export type Release = {
  version: string;
  name: string;
  date: string;
  summary: string;
  isCurrent?: boolean;
  items: readonly ChangelogItem[];
};

export const changeKindMeta: Record<ChangeKind, ChangeKindMeta> = {
  feature: {
    label: 'Novidade',
    plural: 'Novidades',
    description: 'Novos recursos e páginas.',
    icon: Sparkles,
    badgeClassName:
      'bg-gold/15 text-gold ring-gold/20 dark:bg-gold/15 dark:text-gold',
    iconClassName: 'bg-gold/10 text-gold ring-gold/15'
  },
  improvement: {
    label: 'Melhoria',
    plural: 'Melhorias',
    description: 'Ajustes em fluxos e comportamentos existentes.',
    icon: Wrench,
    badgeClassName:
      'bg-sky-500/10 text-sky-700 ring-sky-500/20 dark:text-sky-400',
    iconClassName:
      'bg-sky-500/10 text-sky-700 ring-sky-500/15 dark:text-sky-400'
  },
  fix: {
    label: 'Correção',
    plural: 'Correções',
    description: 'Problemas que deixaram de existir.',
    icon: Bug,
    badgeClassName:
      'bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-400',
    iconClassName:
      'bg-emerald-500/10 text-emerald-700 ring-emerald-500/15 dark:text-emerald-400'
  },
  design: {
    label: 'Design',
    plural: 'Design',
    description: 'Mudanças visuais e de identidade.',
    icon: Palette,
    badgeClassName:
      'bg-violet-500/10 text-violet-700 ring-violet-500/20 dark:text-violet-400',
    iconClassName:
      'bg-violet-500/10 text-violet-700 ring-violet-500/15 dark:text-violet-400'
  }
};

export const changeKinds = [
  'feature',
  'improvement',
  'fix',
  'design'
] as const satisfies readonly ChangeKind[];

const releases: readonly Release[] = [
  {
    version: '0.6.0',
    name: 'Transparência de produto',
    date: '2026-11-23',
    summary:
      'A Melodia passa a contar a própria história: o que foi entregue, o que está em andamento e o que vem depois.',
    isCurrent: true,
    items: [
      {
        id: 'changelog-page',
        kind: 'feature',
        title: 'Página de changelog',
        description:
          'Histórico de versões com busca, filtros por tipo de mudança e atalhos para cada recurso entregue.',
        route: '/changelog'
      },
      {
        id: 'roadmap-page',
        kind: 'feature',
        title: 'Página de roadmap',
        description:
          'Fases do produto com status, progresso e a lista de funcionalidades de cada etapa.',
        route: '/roadmap'
      },
      {
        id: 'header-product-links',
        kind: 'improvement',
        title: 'Atalhos de produto no cabeçalho',
        description:
          'Documentação, changelog e roadmap ficaram a um clique em qualquer página do app.'
      },
      {
        id: 'docs-cross-links',
        kind: 'improvement',
        title: 'Documentação conectada ao roadmap',
        description:
          'A central de documentação agora aponta para o changelog e para o roadmap completo.'
      },
      {
        id: 'release-highlight',
        kind: 'design',
        title: 'Destaque da versão atual',
        description:
          'O changelog marca visualmente a versão mais recente e separa as entregas por tipo.'
      }
    ]
  },
  {
    version: '0.5.0',
    name: 'Administração e polimento',
    date: '2026-11-18',
    summary:
      'Painel restrito com indicadores reais do banco, atalhos do usuário e ajustes de navegação.',
    items: [
      {
        id: 'admin-panel',
        kind: 'feature',
        title: 'Painel administrativo',
        description:
          'Área restrita a administradores com contagens de usuários, artistas, álbuns, faixas, playlists e reproduções.',
        route: '/admin'
      },
      {
        id: 'admin-users',
        kind: 'feature',
        title: 'Usuários recentes',
        description:
          'Últimos cadastros com nome, e-mail, papel e data de criação, incluindo sinalização de contas banidas.'
      },
      {
        id: 'admin-top-tracks',
        kind: 'feature',
        title: 'Faixas mais tocadas',
        description:
          'Ranking das faixas com mais reproduções registradas, lido direto do banco no servidor.'
      },
      {
        id: 'admin-activity',
        kind: 'feature',
        title: 'Atividade recente',
        description:
          'Últimas reproduções com faixa, usuário e horário, prontas para receber o histórico real.'
      },
      {
        id: 'admin-access-rules',
        kind: 'improvement',
        title: 'Regra de acesso administrativo',
        description:
          'Usuários comuns recebem 404 ao tentar abrir o painel, evitando revelar a rota restrita.'
      },
      {
        id: 'header-fix',
        kind: 'fix',
        title: 'Cabeçalho em telas menores',
        description:
          'Links, busca e menu do usuário foram reorganizados para não quebrar o layout no celular.',
        route: '/'
      },
      {
        id: 'role-badge',
        kind: 'design',
        title: 'Papéis visíveis no menu',
        description:
          'O menu do usuário identifica administradores com um ícone de escudo ao lado do nome.'
      }
    ]
  },
  {
    version: '0.4.0',
    name: 'Player completo',
    date: '2026-11-10',
    summary:
      'Reprodução contínua entre páginas, controles completos e integração com os controles do sistema.',
    items: [
      {
        id: 'persistent-player',
        kind: 'feature',
        title: 'Reprodução contínua',
        description:
          'Um único elemento de áudio permanece vivo enquanto você navega, sem cortar a faixa.',
        route: '/'
      },
      {
        id: 'player-queue',
        kind: 'feature',
        title: 'Fila com contexto',
        description:
          'A coleção em reprodução vira a fila do player e guarda a origem para o botão da home saber se deve tocar ou pausar.'
      },
      {
        id: 'player-controls',
        kind: 'feature',
        title: 'Controles essenciais',
        description:
          'Play, pause, faixa anterior, próxima faixa, barra de progresso arrastável e volume com atalho de mudo.'
      },
      {
        id: 'player-modes',
        kind: 'feature',
        title: 'Aleatório e repetição',
        description:
          'Modos de escuta para embaralhar a fila e repetir tudo ou apenas a faixa atual.'
      },
      {
        id: 'media-session',
        kind: 'feature',
        title: 'Controles do sistema',
        description:
          'Integração com Media Session: teclas de mídia, notificações e tela de bloqueio com título, artista e capa.'
      },
      {
        id: 'player-preferences',
        kind: 'improvement',
        title: 'Preferências salvas',
        description:
          'Volume, mudo, aleatório e repetição sobrevivem a recarregamentos e novas visitas.'
      },
      {
        id: 'mobile-player',
        kind: 'design',
        title: 'Player compacto no celular',
        description:
          'Barra inferior reorganizada para telas pequenas, com progresso no topo e controles essenciais à mão.'
      }
    ]
  },
  {
    version: '0.3.0',
    name: 'Experiência inicial',
    date: '2026-11-09',
    summary:
      'A primeira versão navegável da home, com identidade visual, tema e acessibilidade.',
    items: [
      {
        id: 'home-demo',
        kind: 'feature',
        title: 'Home de descoberta',
        description:
          'Destaque da semana, tocadas recentemente, seleções "feito para você" e gêneros, alimentados por dados de demonstração.',
        route: '/'
      },
      {
        id: 'theme-switcher',
        kind: 'feature',
        title: 'Tema claro, escuro e sistema',
        description:
          'Alternância de aparência pelo cabeçalho, com preferência aplicada sem transições bruscas.'
      },
      {
        id: 'responsive-layout',
        kind: 'improvement',
        title: 'Layout responsivo',
        description:
          'Grades, cabeçalho e player adaptados para celular, tablet e desktop.'
      },
      {
        id: 'accessibility-basics',
        kind: 'improvement',
        title: 'Acessibilidade desde o começo',
        description:
          'Rótulos ARIA, foco visível e navegação por teclado nos controles principais.'
      },
      {
        id: 'gradient-covers',
        kind: 'design',
        title: 'Capas geradas por gradiente',
        description:
          'Placeholders com identidade própria para coleções que ainda não têm capa.'
      }
    ]
  },
  {
    version: '0.2.0',
    name: 'Base de dados do catálogo',
    date: '2026-11-09',
    summary:
      'O modelo relacional que sustenta catálogo, biblioteca e histórico.',
    items: [
      {
        id: 'catalog-schema',
        kind: 'feature',
        title: 'Schema do catálogo',
        description:
          'Tabelas para artistas, álbuns, faixas, gêneros e as relações de autoria entre faixas e artistas.'
      },
      {
        id: 'library-schema',
        kind: 'feature',
        title: 'Schema da biblioteca',
        description:
          'Playlists com ordem de faixas, curtidas, artistas seguidos e histórico de reprodução.'
      },
      {
        id: 'typed-relations',
        kind: 'improvement',
        title: 'Relações tipadas',
        description:
          'Relações declaradas no Drizzle para consultas com tipos derivados, sem duplicar interfaces.'
      }
    ]
  },
  {
    version: '0.1.0',
    name: 'Fundação',
    date: '2026-11-09',
    summary:
      'O esqueleto do app: framework, banco, autenticação e proteção de rotas.',
    items: [
      {
        id: 'app-scaffold',
        kind: 'feature',
        title: 'Base do app',
        description:
          'Next.js 16 com App Router, React 19, TypeScript estrito, Tailwind e shadcn/ui.'
      },
      {
        id: 'auth',
        kind: 'feature',
        title: 'Contas com Better Auth',
        description:
          'Cadastro, login e sessão com e-mail e senha, com senhas armazenadas apenas como hash.',
        route: '/register'
      },
      {
        id: 'route-protection',
        kind: 'feature',
        title: 'Proteção de rotas',
        description:
          'Checagem otimista de sessão no proxy e autorização real no servidor com requireSession.',
        route: '/login'
      }
    ]
  }
];

export const changelogReleases = releases;

export const currentRelease = releases.find(release => release.isCurrent);

export const changelogStats = {
  releases: releases.length,
  changes: releases.reduce((total, release) => total + release.items.length, 0),
  latestVersion: releases[0]?.version ?? '—'
};

export const changeKindCounts: Record<ChangeKind, number> = {
  feature: 0,
  improvement: 0,
  fix: 0,
  design: 0
};

for (const release of releases) {
  for (const item of release.items) {
    changeKindCounts[item.kind] += 1;
  }
}

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC'
});

export function formatReleaseDate(value: string) {
  return dateFormatter.format(new Date(`${value}T00:00:00Z`));
}
