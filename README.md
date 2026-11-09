# Portfolio — Davi Franca

Monorepo com os projetos do meu portfolio: aplicações full-stack modernas construídas com **Next.js 16**, **TypeScript**, **PostgreSQL** e **Drizzle ORM**, compartilhando tooling, configuração e (aos poucos) componentes e utilitários.

Cada app é independente e resolve um problema de produto diferente, mas todos seguem a mesma base técnica, o que mantém o repositório consistente e fácil de evoluir.

## Projetos

| Projeto                     | Descrição                                                                                                | Stack principal                                    | Estado                                                               |
| --------------------------- | -------------------------------------------------------------------------------------------------------- | -------------------------------------------------- | -------------------------------------------------------------------- |
| [**Melodia**](apps/melodia) | Plataforma de streaming de músicas: catálogo, player persistente, playlists, curtidas, histórico e busca | Next.js, Drizzle, Better Auth, shadcn/ui, Recharts | Em desenvolvimento (base e design system prontos; MVP em construção) |

### Melodia

App de streaming de músicas pensado em torno de um MVP claro:

1. Cadastro e login
2. Catálogo (artistas, álbuns, faixas)
3. Player persistente
4. Playlists
5. Curtidas e histórico
6. Busca

Decisões de projeto que valem destaque: Server Components por padrão, acesso ao banco restrito ao servidor, mutações via Server Actions com validação, histórico de reprodução registrado só após 30 s ouvidos e URLs de áudio assinadas com expiração. Detalhes em [`apps/melodia/AGENTS.md`](apps/melodia/AGENTS.md).

## Stack

- **Framework:** Next.js 16 (App Router), React 19 com React Compiler
- **Linguagem:** TypeScript 7 em modo estrito
- **Banco de dados:** PostgreSQL + Drizzle ORM
- **Autenticação:** Better Auth
- **UI:** Tailwind CSS 4, shadcn/ui (`@base-ui/react`), lucide-react
- **Monorepo:** Turborepo + Bun workspaces
- **Qualidade:** ESLint, Prettier, `tsc --noEmit`

## Estrutura do repositório

```
.
├─ apps/
│  └─ melodia/               # app de streaming de músicas
├─ packages/
│  ├─ eslint-config/         # configurações ESLint compartilhadas
│  ├─ typescript-config/     # tsconfigs base (base, nextjs, react-library, tanstack-react)
│  ├─ ui/                    # componentes React compartilhados
│  └─ shared/                # utilitários compartilhados
├─ AGENTS.md                 # guia para agentes de código e contribuidores
├─ turbo.json                # pipeline de tarefas
└─ package.json              # workspaces: apps/*, packages/*
```

Os pacotes em `packages/` são internos (`private`) e usam o escopo `@Davifranca-Portfolio/*`.

## Como rodar

### Pré-requisitos

- [Node.js](https://nodejs.org/) `>= 24`
- [Bun](https://bun.sh/) (versão definida em `devEngines`, hoje `1.3.14`)
- PostgreSQL acessível, para os apps que usam banco

### Instalação

```bash
git clone https://github.com/davifrancabr/portfolio.git
cd portfolio
bun install
```

### Desenvolvimento

```bash
# Todos os apps
bun run dev

# Apenas um app
bunx turbo run dev --filter=melodia
```

O app abre em [http://localhost:3000](http://localhost:3000) por padrão. Cada app lê suas variáveis de ambiente de um `.env` local (nunca versionado); consulte o `.env.example` do app quando existir.

### Qualidade e build

```bash
bun run lint          # ESLint em todos os workspaces
bun run check-types   # checagem de tipos
bun run format        # Prettier
bun run build         # build de produção (cacheado pelo Turborepo)
```

Para atuar em um workspace específico, use `--filter` com o nome do pacote, por exemplo `bunx turbo run build --filter=melodia`.

## Princípios

- **Uma base, vários produtos:** mesma stack e convenções em todos os apps, para que aprender um projeto signifique entender os outros.
- **Compartilhar com critério:** código só vai para `packages/*` quando mais de um app usa de verdade.
- **Segurança no servidor:** autorização real sempre no backend; nada de confiar em dados de identidade vindos do cliente.
- **Documentação viva:** `AGENTS.md` (raiz e por app) registra comandos, estrutura e convenções, e deve ser atualizado junto com o código.

## Contribuindo e trabalhando com agentes de código

Antes de alterar qualquer coisa, leia o [`AGENTS.md`](AGENTS.md) da raiz e o do app em que for trabalhar. Eles listam comandos, convenções, o checklist de conclusão de tarefa e problemas conhecidos do repositório.

## Licença

Distribuído sob a licença [MIT](LICENSE) © 2026 Davi Franca.
