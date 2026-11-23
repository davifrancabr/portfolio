import {
  Circle,
  CircleCheck,
  Clock3,
  Compass,
  type LucideIcon
} from 'lucide-react';

export type RoadmapStatus = 'done' | 'in-progress' | 'planned' | 'exploring';

export type RoadmapFeatureStatus = 'done' | 'in-progress' | 'planned';

export type RoadmapFeature = {
  title: string;
  description: string;
  status: RoadmapFeatureStatus;
};

export type RoadmapPhase = {
  id: string;
  order: number;
  title: string;
  tagline: string;
  timeframe: string;
  summary: string;
  status: RoadmapStatus;
  progress: number;
  features: readonly RoadmapFeature[];
  dependsOn?: string;
};

type RoadmapPhaseInput = Omit<RoadmapPhase, 'progress'>;

export const roadmapStatusMeta: Record<
  RoadmapStatus,
  {
    label: string;
    description: string;
    icon: LucideIcon;
    badgeClassName: string;
    nodeClassName: string;
  }
> = {
  done: {
    label: 'Entregue',
    description: 'Já está no ar e pode ser usado hoje.',
    icon: CircleCheck,
    badgeClassName:
      'bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-400',
    nodeClassName:
      'bg-emerald-500/15 text-emerald-700 ring-emerald-500/25 dark:text-emerald-400'
  },
  'in-progress': {
    label: 'Em andamento',
    description: 'Sendo construído agora, com partes já funcionando.',
    icon: Clock3,
    badgeClassName: 'bg-gold/15 text-gold ring-gold/20',
    nodeClassName: 'bg-gold/15 text-gold ring-gold/25'
  },
  planned: {
    label: 'Planejado',
    description: 'Mapeado e priorizado, ainda sem início.',
    icon: Circle,
    badgeClassName: 'bg-muted text-muted-foreground ring-border',
    nodeClassName: 'bg-muted text-muted-foreground ring-border'
  },
  exploring: {
    label: 'Explorando',
    description: 'Ideias em avaliação; podem mudar de forma ou sair da lista.',
    icon: Compass,
    badgeClassName:
      'bg-violet-500/10 text-violet-700 ring-violet-500/20 dark:text-violet-400',
    nodeClassName:
      'bg-violet-500/10 text-violet-700 ring-violet-500/20 dark:text-violet-400'
  }
};

export const roadmapFeatureStatusMeta: Record<
  RoadmapFeatureStatus,
  {
    label: string;
    icon: LucideIcon;
    iconClassName: string;
  }
> = {
  done: {
    label: 'Pronto',
    icon: CircleCheck,
    iconClassName: 'text-emerald-600 dark:text-emerald-400'
  },
  'in-progress': {
    label: 'Em andamento',
    icon: Clock3,
    iconClassName: 'text-gold'
  },
  planned: {
    label: 'Planejado',
    icon: Circle,
    iconClassName: 'text-muted-foreground/60'
  }
};

const phases: readonly RoadmapPhaseInput[] = [
  {
    id: 'foundation',
    order: 1,
    title: 'Fundação técnica',
    tagline: 'A base que sustenta tudo',
    timeframe: 'Novembro de 2026',
    summary:
      'Framework, banco, autenticação e identidade visual. Nada de música ainda, mas tudo pronto para receber o catálogo.',
    status: 'done',
    features: [
      {
        title: 'Next.js 16 + TypeScript + Tailwind',
        description:
          'App Router, componentes de servidor por padrão e tipagem estrita.',
        status: 'done'
      },
      {
        title: 'PostgreSQL + Drizzle ORM',
        description:
          'Schema relacional para catálogo, playlists, curtidas e histórico, com migrations versionadas.',
        status: 'done'
      },
      {
        title: 'Contas com Better Auth',
        description: 'Cadastro, login, sessões e senhas protegidas por hash.',
        status: 'done'
      },
      {
        title: 'Proteção de rotas',
        description:
          'Checagem otimista no proxy e autorização real no servidor com papéis.',
        status: 'done'
      },
      {
        title: 'Design system e tema',
        description:
          'Componentes shadcn/ui, temas claro, escuro e sistema, e layout responsivo.',
        status: 'done'
      }
    ]
  },
  {
    id: 'player',
    order: 2,
    title: 'Player persistente',
    tagline: 'Música sem interrupções',
    timeframe: 'Novembro de 2026',
    summary:
      'A experiência de escuta sai do papel: a barra inferior continua tocando enquanto você navega e responde aos controles do sistema.',
    status: 'done',
    features: [
      {
        title: 'Reprodução contínua',
        description:
          'Um único elemento de áudio sobrevive à navegação entre páginas.',
        status: 'done'
      },
      {
        title: 'Fila e contexto',
        description:
          'A coleção tocada vira a fila e mantém a origem da reprodução.',
        status: 'done'
      },
      {
        title: 'Controles essenciais',
        description:
          'Play, pause, anterior, próxima, barra de progresso e volume com mudo.',
        status: 'done'
      },
      {
        title: 'Aleatório e repetição',
        description:
          'Modos de escuta para embaralhar a fila, repetir tudo ou repetir a faixa.',
        status: 'done'
      },
      {
        title: 'Media Session',
        description:
          'Teclas de mídia, notificações e tela de bloqueio sincronizadas com o player.',
        status: 'done'
      },
      {
        title: 'Preferências salvas',
        description:
          'Volume, mudo, aleatório e repetição são restaurados ao voltar ao app.',
        status: 'done'
      }
    ]
  },
  {
    id: 'catalog',
    order: 3,
    title: 'Catálogo musical',
    tagline: 'Do banco de dados para a tela',
    timeframe: 'Dezembro de 2026 – Janeiro de 2027',
    summary:
      'O maior salto do produto: trocar dados de demonstração por artistas, álbuns e faixas reais, com páginas próprias e áudio seguro.',
    status: 'in-progress',
    features: [
      {
        title: 'Modelagem do catálogo',
        description:
          'Tabelas de artistas, álbuns, faixas, gêneros e relações de autoria já definidas.',
        status: 'done'
      },
      {
        title: 'Consultas de catálogo no servidor',
        description:
          'Leituras tipadas em src/server/queries, acessíveis apenas pelo servidor.',
        status: 'in-progress'
      },
      {
        title: 'Páginas de artista, álbum e faixa',
        description:
          'Cada entidade com página própria, capa, metadados e botão de reprodução.',
        status: 'planned'
      },
      {
        title: 'Gêneros navegáveis',
        description:
          'Os gêneros da home passam a filtrar o catálogo de verdade.',
        status: 'planned'
      },
      {
        title: 'URLs assinadas de áudio',
        description:
          'Reprodução com links temporários e expiração, sem expor arquivos originais.',
        status: 'planned'
      },
      {
        title: 'Importação de catálogo',
        description:
          'Fluxo para cadastrar artistas, álbuns, faixas e capas em lote.',
        status: 'planned'
      }
    ],
    dependsOn: 'Fundação técnica'
  },
  {
    id: 'library',
    order: 4,
    title: 'Biblioteca pessoal',
    tagline: 'Sua música, organizada',
    timeframe: '1º trimestre de 2027',
    summary:
      'A área logada deixa de ser um template e passa a reunir o que é seu: playlists, curtidas, histórico e artistas seguidos.',
    status: 'planned',
    features: [
      {
        title: 'Playlists',
        description:
          'Criar, editar, ordenar faixas e escolher entre playlist pública ou privada.',
        status: 'planned'
      },
      {
        title: 'Curtidas',
        description:
          'Marcar faixas com um coração e recuperar tudo na biblioteca.',
        status: 'planned'
      },
      {
        title: 'Histórico de reprodução',
        description:
          'Registro do que foi ouvido, considerando apenas reproduções de 30 segundos ou mais.',
        status: 'planned'
      },
      {
        title: 'Seguir artistas',
        description:
          'Acompanhar artistas e ver novidades ligadas a quem você segue.',
        status: 'planned'
      },
      {
        title: 'Página da biblioteca',
        description:
          'Um só lugar para curtidas, playlists e artistas, com estados vazios honestos.',
        status: 'planned'
      }
    ],
    dependsOn: 'Catálogo musical'
  },
  {
    id: 'discovery',
    order: 5,
    title: 'Busca e descoberta',
    tagline: 'Encontrar sem esforço',
    timeframe: '1º trimestre de 2027',
    summary:
      'A busca do cabeçalho passa a funcionar e a home deixa de depender de dados de exemplo, usando o que você realmente ouve.',
    status: 'planned',
    features: [
      {
        title: 'Busca unificada',
        description:
          'Faixas, artistas, álbuns e playlists em uma única consulta com resultados agrupados.',
        status: 'planned'
      },
      {
        title: 'Filtros por gênero',
        description:
          'Exploração do catálogo por gênero, com contagem de resultados.',
        status: 'planned'
      },
      {
        title: 'Tocadas recentemente reais',
        description:
          'A seção da home passa a ler o histórico em vez de dados fixos.',
        status: 'planned'
      },
      {
        title: 'Recomendações personalizadas',
        description:
          'Seleções "feito para você" com base em histórico, curtidas e gêneros.',
        status: 'planned'
      }
    ],
    dependsOn: 'Biblioteca pessoal'
  },
  {
    id: 'content-admin',
    order: 6,
    title: 'Administração de conteúdo',
    tagline: 'Operar o catálogo com segurança',
    timeframe: '2º trimestre de 2027',
    summary:
      'O painel administrativo deixa de ser apenas leitura e passa a operar o catálogo, os uploads e a moderação.',
    status: 'planned',
    features: [
      {
        title: 'CRUD de catálogo',
        description:
          'Criar, editar e arquivar artistas, álbuns, faixas e gêneros pelo painel.',
        status: 'planned'
      },
      {
        title: 'Upload e processamento de áudio',
        description:
          'Envio de arquivos, extração de duração e geração de capas padronizadas.',
        status: 'planned'
      },
      {
        title: 'Moderação',
        description:
          'Revisão de playlists públicas e gestão de contas banidas.',
        status: 'planned'
      },
      {
        title: 'Relatórios de uso',
        description:
          'Métricas por período para acompanhar crescimento e retenção.',
        status: 'planned'
      }
    ],
    dependsOn: 'Catálogo musical'
  },
  {
    id: 'experience',
    order: 7,
    title: 'Experiência avançada',
    tagline: 'O próximo nível de escuta',
    timeframe: '2º trimestre de 2027 em diante',
    summary:
      'Ideias em avaliação para depois que o núcleo de streaming estiver completo. O escopo pode mudar conforme o uso real.',
    status: 'exploring',
    features: [
      {
        title: 'Letras sincronizadas',
        description:
          'Letra acompanhando a reprodução, com destaque da linha atual.',
        status: 'planned'
      },
      {
        title: 'Equalizador e crossfade',
        description: 'Ajuste de frequências e transições suaves entre faixas.',
        status: 'planned'
      },
      {
        title: 'PWA e escuta offline',
        description:
          'Instalação no dispositivo e cache de faixas para ouvir sem conexão.',
        status: 'planned'
      },
      {
        title: 'Playlists colaborativas',
        description:
          'Convidar outras pessoas para adicionar faixas à mesma playlist.',
        status: 'planned'
      },
      {
        title: 'Perfis públicos e compartilhamento',
        description:
          'Página pública com o que você ouve e links para compartilhar coleções.',
        status: 'planned'
      }
    ],
    dependsOn: 'Busca e descoberta'
  }
];

const featureWeights: Record<RoadmapFeatureStatus, number> = {
  done: 1,
  'in-progress': 0.5,
  planned: 0
};

export const roadmapPhases: readonly RoadmapPhase[] = phases.map(phase => {
  const score = phase.features.reduce(
    (total, feature) => total + featureWeights[feature.status],
    0
  );

  return {
    ...phase,
    progress: Math.round((score / phase.features.length) * 100)
  };
});

const allFeatures = roadmapPhases.flatMap(phase => phase.features);

export const roadmapStats = {
  phases: roadmapPhases.length,
  phasesDone: roadmapPhases.filter(phase => phase.status === 'done').length,
  phasesInProgress: roadmapPhases.filter(
    phase => phase.status === 'in-progress'
  ).length,
  phasesPlanned: roadmapPhases.filter(phase => phase.status === 'planned')
    .length,
  phasesExploring: roadmapPhases.filter(phase => phase.status === 'exploring')
    .length,
  features: allFeatures.length,
  featuresDone: allFeatures.filter(feature => feature.status === 'done').length,
  overallProgress: Math.round(
    (allFeatures.reduce(
      (total, feature) => total + featureWeights[feature.status],
      0
    ) /
      allFeatures.length) *
      100
  )
};

export const roadmapPrinciples = [
  {
    title: 'Ouvir vem primeiro',
    description:
      'O que destrava a experiência principal de escuta tem prioridade sobre recursos periféricos.'
  },
  {
    title: 'Base antes da superfície',
    description:
      'Dados, segurança e consultas confiáveis vêm antes de telas bonitas em cima de dados de exemplo.'
  },
  {
    title: 'Entrega incremental',
    description:
      'Cada fase vai ao ar funcionando. Nada é anunciado como pronto antes de estar realmente utilizável.'
  }
] as const;
