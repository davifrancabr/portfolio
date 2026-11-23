import {
  Accessibility,
  Activity,
  AudioLines,
  Clock,
  Compass,
  Heart,
  Headphones,
  History,
  LayoutDashboard,
  Library,
  ListMusic,
  LogIn,
  LogOut,
  Map,
  Play,
  Search,
  Settings2,
  ShieldCheck,
  Shuffle,
  SkipForward,
  Smartphone,
  Sparkles,
  SunMoon,
  TrendingUp,
  UserPlus,
  Users,
  Volume2,
  type LucideIcon
} from 'lucide-react';

export type DocStatus = 'available' | 'demo' | 'planned';

export type DocCategoryId =
  | 'account'
  | 'discovery'
  | 'player'
  | 'library'
  | 'appearance'
  | 'admin'
  | 'product';

export type DocCategory = {
  id: DocCategoryId;
  label: string;
  description: string;
};

export type DocFeature = {
  id: string;
  category: DocCategoryId;
  title: string;
  summary: string;
  icon: LucideIcon;
  status: DocStatus;
  /** Rota principal da funcionalidade, quando existir. */
  route?: string;
  steps?: readonly string[];
  notes?: readonly string[];
  keywords?: readonly string[];
};

export const docStatusMeta: Record<
  DocStatus,
  { label: string; description: string; className: string }
> = {
  available: {
    label: 'Disponível',
    description: 'Funcionalidade completa e utilizável hoje.',
    className:
      'bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-400'
  },
  demo: {
    label: 'Demonstração',
    description: 'Interface pronta, alimentada por dados de exemplo.',
    className: 'bg-gold/15 text-gold ring-gold/20'
  },
  planned: {
    label: 'Em breve',
    description: 'Estrutura e banco prontos; interface ainda em construção.',
    className: 'bg-muted text-muted-foreground ring-border'
  }
};

export const docCategories: readonly DocCategory[] = [
  {
    id: 'account',
    label: 'Conta e acesso',
    description: 'Cadastro, login e proteção das áreas logadas.'
  },
  {
    id: 'discovery',
    label: 'Descobrir música',
    description: 'A página inicial e os caminhos para encontrar algo novo.'
  },
  {
    id: 'player',
    label: 'Player',
    description: 'Reprodução contínua e todos os controles da barra inferior.'
  },
  {
    id: 'library',
    label: 'Biblioteca',
    description: 'Playlists, curtidas, histórico e artistas favoritos.'
  },
  {
    id: 'appearance',
    label: 'Aparência e acesso',
    description: 'Tema, responsividade e recursos de acessibilidade.'
  },
  {
    id: 'admin',
    label: 'Administração',
    description: 'Painel restrito com indicadores e atividade da plataforma.'
  },
  {
    id: 'product',
    label: 'Produto e transparência',
    description: 'O que já foi entregue e o que está planejado para o futuro.'
  }
];

const features: readonly DocFeature[] = [
  // Conta e acesso
  {
    id: 'create-account',
    category: 'account',
    title: 'Criar conta',
    summary:
      'Cadastro com nome, e-mail e senha. A sessão é iniciada automaticamente ao final.',
    icon: UserPlus,
    status: 'available',
    route: '/register',
    steps: [
      'Abra a página de cadastro pelo botão "Criar conta" na tela de login.',
      'Informe seu nome, um e-mail válido e uma senha de 8 a 128 caracteres.',
      'Confirme a senha e envie o formulário.',
      'Ao concluir, você é levado ao destino original (parâmetro next) ou à página inicial.'
    ],
    notes: [
      'O nome precisa ter entre 2 e 80 caracteres.',
      'As senhas precisam coincidir.',
      'A senha é armazenada com hash pelo Better Auth; a Melodia nunca guarda a senha em texto puro.'
    ],
    keywords: ['cadastro', 'registro', 'signup', 'conta', 'senha']
  },
  {
    id: 'sign-in',
    category: 'account',
    title: 'Entrar na conta',
    summary:
      'Login com e-mail e senha, com sessão lembrada e retorno seguro à página pedida.',
    icon: LogIn,
    status: 'available',
    route: '/login',
    steps: [
      'Acesse a página de login.',
      'Informe o e-mail e a senha cadastrados.',
      'Envie o formulário. Erros de credenciais são traduzidos para pt-BR.'
    ],
    notes: [
      'A opção "lembrar de mim" é ativada por padrão.',
      'Se você tentou abrir uma rota protegida, o parâmetro next devolve você ao destino após entrar.',
      'O destino é validado para impedir redirecionamentos para domínios externos.'
    ],
    keywords: ['login', 'entrar', 'sessão', 'email', 'senha']
  },
  {
    id: 'sign-out',
    category: 'account',
    title: 'Sair da conta',
    summary:
      'Encerra a sessão atual e devolve você à tela de login com segurança.',
    icon: LogOut,
    status: 'available',
    steps: [
      'Abra o menu do seu avatar no canto superior direito.',
      'Escolha "Sair".',
      'A sessão é encerrada e você é redirecionado para o login.'
    ],
    keywords: ['logout', 'sair', 'encerrar sessão']
  },
  {
    id: 'route-protection',
    category: 'account',
    title: 'Proteção de rotas',
    summary:
      'Rotas logadas exigem sessão e o painel administrativo exige papel de administrador.',
    icon: ShieldCheck,
    status: 'available',
    notes: [
      'O proxy faz uma checagem otimista do cookie de sessão antes de renderizar /library, /playlist, /settings e /admin.',
      'A autorização real acontece no servidor com requireSession(); nunca confie apenas no cookie.',
      'O painel administrativo usa requireAdmin(): usuários comuns recebem 404 para não revelar a área restrita.'
    ],
    keywords: ['segurança', 'autorização', 'admin', 'rotas', 'sessão']
  },

  // Descobrir música
  {
    id: 'featured-banner',
    category: 'discovery',
    title: 'Destaque da semana',
    summary:
      'Banner com uma coleção em destaque e botão para ouvir na hora pelo player.',
    icon: Sparkles,
    status: 'demo',
    route: '/',
    steps: [
      'Na página inicial, encontre o banner "Em destaque".',
      'Clique em "Ouvir agora" para iniciar a fila da coleção de demonstração.',
      'Use o mesmo botão para pausar enquanto a coleção estiver tocando.'
    ],
    notes: [
      'Hoje a coleção usa faixas de exemplo do SoundHelix.',
      'O botão "Salvar na biblioteca" já existe visualmente, mas será ligado às curtidas em uma próxima etapa.'
    ],
    keywords: ['home', 'início', 'destaque', 'banner', 'ouvir']
  },
  {
    id: 'recently-played',
    category: 'discovery',
    title: 'Tocadas recentemente',
    summary:
      'Atalhos horizontais para retomar coleções que você estava ouvindo.',
    icon: Clock,
    status: 'demo',
    route: '/',
    notes: [
      'Os cartões exibem título e artista com uma capa gerada por gradiente.',
      'Os dados são de demonstração até o histórico de reprodução real entrar no ar.',
      'Cada cartão leva à rota da coleção em /playlist.'
    ],
    keywords: ['recente', 'histórico', 'continuar', 'home']
  },
  {
    id: 'made-for-you',
    category: 'discovery',
    title: 'Feito para você',
    summary: 'Grade de seleções personalizadas por momento, humor e gênero.',
    icon: Compass,
    status: 'demo',
    route: '/',
    notes: [
      'Os cartões mostram uma capa, título e descrição curta.',
      'Ao passar o mouse ou focar pelo teclado, o botão de play aparece.',
      'A personalização real depende do catálogo e do histórico do usuário.'
    ],
    keywords: ['recomendação', 'seleção', 'personalizado', 'home']
  },
  {
    id: 'genres',
    category: 'discovery',
    title: 'Explorar por gênero',
    summary:
      'Etiquetas de gêneros que levarão ao catálogo filtrado quando ele existir.',
    icon: Compass,
    status: 'planned',
    route: '/',
    notes: [
      'Os gêneros já são exibidos na home e apontam para /playlist?genre=...',
      'A página de playlist ainda é o template inicial; a filtragem real será implementada com o catálogo.'
    ],
    keywords: ['gênero', 'pop', 'rock', 'samba', 'explorar']
  },
  {
    id: 'search',
    category: 'discovery',
    title: 'Busca',
    summary:
      'Campo de pesquisa no cabeçalho, preparado para buscar faixas, artistas e playlists.',
    icon: Search,
    status: 'planned',
    notes: [
      'O campo "Pesquisar" já aparece no header em todas as rotas.',
      'Ainda não executa consultas; a busca real entra na etapa 6 do roadmap.'
    ],
    keywords: ['buscar', 'pesquisa', 'procurar']
  },

  // Player
  {
    id: 'persistent-player',
    category: 'player',
    title: 'Reprodução contínua',
    summary:
      'O player fica montado no layout da área logada e continua tocando entre páginas.',
    icon: Headphones,
    status: 'available',
    notes: [
      'Um único elemento de áudio é mantido vivo durante a navegação.',
      'A barra inferior só aparece quando há uma faixa na fila.',
      'No celular, uma linha de progresso compacta fica no topo da barra.'
    ],
    keywords: ['player', 'persistente', 'navegação', 'áudio', 'contínuo']
  },
  {
    id: 'play-pause',
    category: 'player',
    title: 'Reproduzir e pausar',
    summary:
      'Controle principal do player, com estado sincronizado em toda a interface.',
    icon: Play,
    status: 'available',
    steps: [
      'Inicie uma coleção pelo botão de play da home.',
      'Use o botão central da barra para pausar ou retomar.',
      'O texto e o ícone se alternam entre "Pausar" e "Reproduzir".'
    ],
    notes: [
      'Falhas de carregamento ou reprodução pausam a faixa em vez de manter um estado falso.',
      'O estado de reprodução é a fonte da verdade para o elemento de áudio.'
    ],
    keywords: ['play', 'pause', 'tocar', 'pausar']
  },
  {
    id: 'previous-next',
    category: 'player',
    title: 'Faixa anterior e próxima',
    summary:
      'Navegação pela fila, com regra de reinício e volta ao início no fim da lista.',
    icon: SkipForward,
    status: 'available',
    steps: [
      'Use os botões de pular para navegar pela fila.',
      'O botão anterior reinicia a faixa atual se você já ouviu 3 segundos ou mais.',
      'No fim da fila, "próxima" volta ao início; "anterior" na primeira faixa vai para a última.'
    ],
    notes: [
      'Com o modo aleatório ligado, a próxima faixa é sorteada (sem repetir a atual).',
      'Ao trocar de faixa, a posição volta a zero e a duração é atualizada.'
    ],
    keywords: ['próxima', 'anterior', 'pular', 'fila', 'skip']
  },
  {
    id: 'seek',
    category: 'player',
    title: 'Barra de progresso',
    summary:
      'Arraste para navegar pela faixa, com tempos atual e total formatados.',
    icon: AudioLines,
    status: 'available',
    steps: [
      'Arraste o controle no centro da barra do player.',
      'Enquanto arrasta, o tempo exibido acompanha o polegar.',
      'Ao soltar, a reprodução salta para a posição escolhida.'
    ],
    notes: [
      'O ícone de progresso também responde a seeks feitos pelos controles do sistema.',
      'O tempo é exibido em mm:ss.'
    ],
    keywords: ['seek', 'progresso', 'arrastar', 'tempo']
  },
  {
    id: 'volume',
    category: 'player',
    title: 'Volume e mudo',
    summary:
      'Slider de volume com atalho para silenciar e ícones que refletem o nível.',
    icon: Volume2,
    status: 'available',
    steps: [
      'Arraste o slider no canto direito da barra para ajustar o volume.',
      'Clique no ícone de volume para silenciar ou reativar o som.',
      'O ícone muda entre volume baixo, alto e mudo.'
    ],
    notes: [
      'Volume e estado de mudo são salvos no navegador.',
      'Controles de volume e mudo ficam ocultos em telas pequenas.'
    ],
    keywords: ['volume', 'mudo', 'mute', 'som']
  },
  {
    id: 'shuffle-repeat',
    category: 'player',
    title: 'Aleatório e repetição',
    summary:
      'Dois modos de escuta: embaralhar a fila e repetir tudo ou apenas a faixa atual.',
    icon: Shuffle,
    status: 'available',
    steps: [
      'Clique no ícone de aleatório para ativar ou desativar a ordem embaralhada.',
      'Clique no ícone de repetição para alternar entre desligado, repetir fila e repetir faixa.',
      'O ícone fica destacado quando o modo está ativo.'
    ],
    notes: [
      'Repetir faixa usa o loop nativo do elemento de áudio.',
      'Repetir fila dá a volta ao chegar na última faixa.',
      'Os dois controles ficam ocultos em telas pequenas.'
    ],
    keywords: ['shuffle', 'aleatório', 'repeat', 'repetir', 'loop']
  },
  {
    id: 'queue',
    category: 'player',
    title: 'Fila e contexto',
    summary:
      'A fila guarda a coleção em reprodução e identifica a origem do que está tocando.',
    icon: ListMusic,
    status: 'available',
    notes: [
      'Tocar uma coleção substitui a fila atual e marca o contexto dessa coleção.',
      'O contexto permite que o botão da home saiba se deve pausar ou iniciar a reprodução.',
      'A fila, a posição e a faixa atual são mantidas entre navegações.'
    ],
    keywords: ['fila', 'queue', 'contexto', 'coleção']
  },
  {
    id: 'media-session',
    category: 'player',
    title: 'Controles do sistema',
    summary:
      'Integração com Media Session: teclas de mídia, notificações e tela de bloqueio.',
    icon: Smartphone,
    status: 'available',
    notes: [
      'Título e artista aparecem nos controles do sistema operacional.',
      'Play, pause, anterior, próxima e seek podem ser acionados de fora do app.',
      'Quando há capa, ela é enviada como artwork; a posição é sincronizada em tempo real.'
    ],
    keywords: ['media session', 'teclas de mídia', 'notificação', 'bloqueio']
  },
  {
    id: 'saved-preferences',
    category: 'player',
    title: 'Preferências salvas',
    summary:
      'Volume, mudo, aleatório e repetição sobrevivem ao recarregar a página.',
    icon: Settings2,
    status: 'available',
    notes: [
      'As preferências ficam na chave melodia-player-preferences do localStorage.',
      'A rehidratação acontece após o mount para evitar diferenças entre servidor e cliente.',
      'Fila e faixa atual não são persistidas; apenas as preferências de escuta.'
    ],
    keywords: ['preferências', 'localStorage', 'persistência', 'volume']
  },

  // Biblioteca
  {
    id: 'library',
    category: 'library',
    title: 'Minha biblioteca',
    summary:
      'Espaço para reunir curtidas, playlists e artistas seguidos em um só lugar.',
    icon: Library,
    status: 'planned',
    route: '/library',
    notes: [
      'A rota já existe e está protegida por sessão, mas ainda mostra o template inicial.',
      'O modelo de dados de curtidas, playlists e seguidores já está definido no banco.'
    ],
    keywords: ['biblioteca', 'library', 'coleção']
  },
  {
    id: 'playlists',
    category: 'library',
    title: 'Playlists',
    summary:
      'Criação de coleções próprias, com ordem das faixas e visibilidade pública ou privada.',
    icon: ListMusic,
    status: 'planned',
    route: '/playlist',
    notes: [
      'O schema prevê nome, descrição, capa, dono e flag isPublic.',
      'A tabela playlist_tracks guarda posição e data de adição.',
      'A rota /playlist ainda é o template inicial; criação e edição virão na etapa 4 do roadmap.'
    ],
    keywords: ['playlist', 'criar', 'música', 'ordem']
  },
  {
    id: 'likes',
    category: 'library',
    title: 'Curtidas',
    summary: 'Marque faixas com um coração e recupere tudo na biblioteca.',
    icon: Heart,
    status: 'planned',
    notes: [
      'A tabela liked_tracks usa chave composta por usuário e faixa.',
      'A remoção da curtida é feita pelo cascade ao excluir a faixa ou o usuário.',
      'A interface de curtir ainda não foi conectada ao player.'
    ],
    keywords: ['curtir', 'favorito', 'like', 'coração']
  },
  {
    id: 'history',
    category: 'library',
    title: 'Histórico de reprodução',
    summary:
      'Registro do que você ouviu, considerando apenas reproduções com pelo menos 30 segundos.',
    icon: History,
    status: 'planned',
    notes: [
      'A tabela play_history guarda usuário, faixa, data e milissegundos tocados.',
      'A regra de negócio exige 30 segundos ou mais antes de registrar.',
      'O painel administrativo já lê esse histórico para exibir a atividade recente.'
    ],
    keywords: ['histórico', 'reprodução', '30 segundos', 'atividade']
  },
  {
    id: 'follow-artists',
    category: 'library',
    title: 'Seguir artistas',
    summary: 'Acompanhe artistas e receba novidades do que você gosta.',
    icon: UserPlus,
    status: 'planned',
    notes: [
      'A tabela artist_follows relaciona usuário e artista com chave composta.',
      'A funcionalidade ainda não tem interface nem uso no catálogo.'
    ],
    keywords: ['artista', 'seguir', 'favorito']
  },

  // Aparência e acesso
  {
    id: 'theme',
    category: 'appearance',
    title: 'Tema claro, escuro e sistema',
    summary: 'Alterne a aparência do app pelo menu de tema no cabeçalho.',
    icon: SunMoon,
    status: 'available',
    steps: [
      'Clique no ícone de sol/lua no cabeçalho.',
      'Escolha entre Claro, Escuro ou Sistema.',
      'A preferência é aplicada sem transições bruscas.'
    ],
    notes: [
      'O tema do sistema é seguido quando a opção "Sistema" está ativa.',
      'As cores são definidas por variáveis CSS e funcionam nos dois temas.'
    ],
    keywords: ['tema', 'dark', 'light', 'claro', 'escuro']
  },
  {
    id: 'responsive',
    category: 'appearance',
    title: 'Layout responsivo',
    summary: 'Interface adaptada para celular, tablet e desktop.',
    icon: Smartphone,
    status: 'available',
    notes: [
      'A home reorganiza as grades conforme a largura da tela.',
      'A barra do player vira um layout compacto no celular.',
      'O menu do usuário e o cabeçalho continuam acessíveis em telas pequenas.'
    ],
    keywords: ['responsivo', 'mobile', 'celular', 'tablet']
  },
  {
    id: 'accessibility',
    category: 'appearance',
    title: 'Acessibilidade',
    summary:
      'Foco visível, rótulos ARIA e textos alternativos nos controles principais.',
    icon: Accessibility,
    status: 'available',
    notes: [
      'Botões do player têm rótulos como "Pausar", "Próxima faixa" e "Volume".',
      'Cartões usam foco visível e textos apenas para leitores de tela.',
      'Animações de hover também aparecem ao navegar por teclado.'
    ],
    keywords: ['acessibilidade', 'teclado', 'aria', 'foco', 'leitor de tela']
  },

  // Administração
  {
    id: 'admin-access',
    category: 'admin',
    title: 'Acesso administrativo',
    summary:
      'Área restrita a contas com papel admin, com resposta 404 para os demais.',
    icon: ShieldCheck,
    status: 'available',
    route: '/admin',
    notes: [
      'O link "Painel administrativo" só aparece no menu para administradores.',
      'A verificação acontece no servidor em cada página ou ação administrativa.',
      'Usuários comuns recebem 404 para não descobrir a rota.'
    ],
    keywords: ['admin', 'administrador', 'restrito', 'painel']
  },
  {
    id: 'admin-stats',
    category: 'admin',
    title: 'Indicadores da plataforma',
    summary:
      'Contagem de usuários, artistas, álbuns, faixas, playlists e reproduções.',
    icon: LayoutDashboard,
    status: 'available',
    route: '/admin',
    notes: [
      'Os números são lidos direto do banco no servidor.',
      'Cada indicador tem ícone e rótulo em pt-BR.',
      'A página inteira exige sessão de administrador.'
    ],
    keywords: ['estatísticas', 'métricas', 'contagem', 'dashboard']
  },
  {
    id: 'admin-users',
    category: 'admin',
    title: 'Usuários recentes',
    summary: 'Últimos cadastros com nome, e-mail, papel e data de criação.',
    icon: Users,
    status: 'available',
    route: '/admin',
    notes: [
      'Mostra até cinco usuários, do mais recente para o mais antigo.',
      'O papel é exibido com um badge; contas banidas também são sinalizadas.',
      'Quando não há cadastros, aparece um estado vazio explicativo.'
    ],
    keywords: ['usuários', 'cadastros', 'papel', 'banido']
  },
  {
    id: 'admin-top-tracks',
    category: 'admin',
    title: 'Faixas mais tocadas',
    summary: 'Ranking das faixas com mais reproduções registradas.',
    icon: TrendingUp,
    status: 'available',
    route: '/admin',
    notes: [
      'Considera apenas faixas com playCount maior que zero.',
      'Mostra até cinco posições com título, artista e contagem.',
      'A contagem usa formatação pt-BR.'
    ],
    keywords: ['ranking', 'mais tocadas', 'playCount', 'faixas']
  },
  {
    id: 'admin-activity',
    category: 'admin',
    title: 'Atividade recente',
    summary: 'Últimas reproduções registradas, com faixa, usuário e horário.',
    icon: Activity,
    status: 'available',
    route: '/admin',
    notes: [
      'Mostra até seis reproduções recentes.',
      'A lista só é preenchida quando o registro de histórico estiver conectado ao player.',
      'O estado vazio explica a regra dos 30 segundos.'
    ],
    keywords: ['atividade', 'reproduções', 'histórico', 'tempo real']
  },

  // Produto e transparência
  {
    id: 'changelog',
    category: 'product',
    title: 'Changelog',
    summary:
      'Histórico de versões com novidades, melhorias, correções e mudanças de design de cada entrega.',
    icon: Sparkles,
    status: 'available',
    route: '/changelog',
    steps: [
      'Abra o changelog pelo cabeçalho ou pela documentação.',
      'Use a busca para encontrar um recurso, versão ou rota específica.',
      'Filtre por novidades, melhorias, correções ou design.',
      'Clique em "Abrir" em uma entrega para ir direto ao recurso.'
    ],
    notes: [
      'A versão mais recente aparece destacada no topo da linha do tempo.',
      'Cada versão informa a data e um resumo do que mudou.',
      'O changelog registra apenas o que já está disponível na interface.'
    ],
    keywords: [
      'changelog',
      'versões',
      'novidades',
      'atualizações',
      'mudanças',
      'release'
    ]
  },
  {
    id: 'roadmap-page',
    category: 'product',
    title: 'Roadmap',
    summary:
      'Fases do produto com status, progresso e a lista de funcionalidades entregues e planejadas.',
    icon: Map,
    status: 'available',
    route: '/roadmap',
    steps: [
      'Abra o roadmap pelo cabeçalho, pelo changelog ou pela documentação.',
      'Confira o progresso geral e o resumo de fases por status.',
      'Percorra as fases na ordem planejada e veja o que já está pronto.',
      'Use os status Entregue, Em andamento, Planejado e Explorando para se orientar.'
    ],
    notes: [
      'O progresso é ponderado: itens em andamento contam como meio entregues.',
      'Cada fase indica de qual etapa anterior ela depende.',
      'Itens em exploração podem mudar de forma ou sair da lista.',
      'Para o histórico do que já foi entregue, consulte o changelog.'
    ],
    keywords: [
      'roadmap',
      'futuro',
      'planejamento',
      'fases',
      'progresso',
      'próximos passos'
    ]
  }
];

export const docFeatures = features;

export const docStatusCounts: Record<DocStatus, number> = {
  available: features.filter(feature => feature.status === 'available').length,
  demo: features.filter(feature => feature.status === 'demo').length,
  planned: features.filter(feature => feature.status === 'planned').length
};

export const roadmap = [
  {
    step: 1,
    title: 'Cadastro e login',
    description: 'Contas, sessão e áreas protegidas.',
    status: 'done'
  },
  {
    step: 2,
    title: 'Catálogo',
    description: 'Artistas, álbuns, faixas e gêneros.',
    status: 'progress'
  },
  {
    step: 3,
    title: 'Player persistente',
    description: 'Reprodução contínua com fila e preferências.',
    status: 'done'
  },
  {
    step: 4,
    title: 'Playlists',
    description: 'Criação, edição e compartilhamento.',
    status: 'next'
  },
  {
    step: 5,
    title: 'Curtidas e histórico',
    description: 'Faixas favoritas e registro com 30s.',
    status: 'next'
  },
  {
    step: 6,
    title: 'Busca',
    description: 'Encontre faixas, artistas e playlists.',
    status: 'next'
  }
] as const;

export const roadmapStatusMeta = {
  done: {
    label: 'Concluído',
    className:
      'bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-400'
  },
  progress: {
    label: 'Em andamento',
    className: 'bg-gold/15 text-gold ring-gold/20'
  },
  next: {
    label: 'Planejado',
    className: 'bg-muted text-muted-foreground ring-border'
  }
} as const;

export const techStack = [
  {
    name: 'Next.js 16',
    description: 'App Router, React Server Components e proxy de rotas.',
    icon: LayoutDashboard
  },
  {
    name: 'PostgreSQL + Drizzle',
    description: 'Modelo relacional tipado para catálogo e biblioteca.',
    icon: Library
  },
  {
    name: 'Better Auth',
    description: 'E-mail e senha, sessões e papéis de administrador.',
    icon: ShieldCheck
  },
  {
    name: 'Zustand',
    description: 'Estado do player com persistência de preferências.',
    icon: Headphones
  }
] as const;
