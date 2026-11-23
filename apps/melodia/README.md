# Melodia

Plataforma de streaming de músicas: catálogo, player persistente, playlists, curtidas, histórico e busca. O app roda sobre Next.js 16 (App Router) com autenticação via Better Auth e persistência em PostgreSQL com Drizzle ORM.

> Este app faz parte do monorepo [Davifranca-Portfolio](../../README.md). Para convenções de código, comandos e checklist de tarefas, leia o [`AGENTS.md`](./AGENTS.md) e o [`AGENTS.md` da raiz](../../AGENTS.md).

## Stack

- **Framework:** Next.js 16 (App Router), React 19 com React Compiler
- **Linguagem:** TypeScript estrito
- **Banco de dados:** PostgreSQL + Drizzle ORM (`drizzle-orm`, `drizzle-kit`)
- **Autenticação:** Better Auth (e-mail/senha, username e plugin admin)
- **UI:** Tailwind CSS 4, shadcn/ui (`@base-ui/react`), lucide-react
- **Estado do player:** Zustand (com persistência)
- **Gráficos:** Recharts
- **Gerenciador de pacotes:** Bun

## Funcionalidades

| Área               | Rota                    | Estado                                                      |
| ------------------ | ----------------------- | ----------------------------------------------------------- |
| Entrar / cadastrar | `/login`, `/register`   | Funcional, com Better Auth e redirect seguro                |
| Início             | `/`                     | Interface pronta com dados de demonstração                  |
| Player persistente | Global (barra inferior) | Funcional: fila, play/pause, seek, volume, shuffle e repeat |
| Documentação       | `/docs`                 | Funcional: guia pesquisável por categoria e status          |
| Changelog          | `/changelog`            | Funcional: releases com busca e filtro por tipo de mudança  |
| Roadmap            | `/roadmap`              | Funcional: fases, progresso, dependências e prioridades     |
| Administração      | `/admin`                | Funcional: métricas reais do banco, exige papel `admin`     |
| Biblioteca         | `/library`              | Em construção (placeholder)                                 |
| Playlist           | `/playlist`             | Em construção (placeholder)                                 |
| Configurações      | `/settings`             | Em construção (placeholder)                                 |

As rotas de biblioteca, playlist, configurações e administração são protegidas de forma otimista em `src/proxy.ts`; a autorização real acontece no servidor com `requireSession()` / `requireAdmin()`.

## Como rodar

### Pré-requisitos

- [Node.js](https://nodejs.org/) `>= 24`
- [Bun](https://bun.sh/)
- [Docker](https://www.docker.com/) (opcional, para o PostgreSQL local)

### 1. Instalar dependências

Na raiz do monorepo:

```bash
bun install
```

### 2. Subir o PostgreSQL

A partir de `apps/melodia`:

```bash
docker compose up -d
```

Isso sobe o PostgreSQL em `localhost:5432` (banco `melodia`) e o Adminer em [http://localhost:8080](http://localhost:8080).

### 3. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Preencha `BETTER_AUTH_SECRET` com um valor aleatório:

```bash
openssl rand -base64 32
```

Variáveis principais:

| Variável              | Descrição                              |
| --------------------- | -------------------------------------- |
| `DATABASE_URL`        | String de conexão do PostgreSQL        |
| `BETTER_AUTH_SECRET`  | Segredo usado pelo Better Auth         |
| `BETTER_AUTH_URL`     | URL base do app para o Better Auth     |
| `NEXT_PUBLIC_APP_URL` | URL pública usada em links e redirects |

### 4. Aplicar as migrations

```bash
bun run db:migrate
```

### 5. Iniciar o servidor

```bash
bun run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Scripts

| Comando               | Descrição                                              |
| --------------------- | ------------------------------------------------------ |
| `bun run dev`         | Servidor de desenvolvimento                            |
| `bun run build`       | Build de produção                                      |
| `bun run start`       | Servidor de produção (após o build)                    |
| `bun run lint`        | ESLint                                                 |
| `bun run typecheck`   | Checagem de tipos com `tsc --noEmit`                   |
| `bun run db:generate` | Gera migration a partir das mudanças no schema         |
| `bun run db:migrate`  | Aplica as migrations pendentes                         |
| `bun run db:push`     | Sincroniza o schema direto no banco (apenas dev local) |
| `bun run db:studio`   | Abre o Drizzle Studio                                  |

> `db:push` nunca deve ser usado em produção: gere e aplique migrations.

## Estrutura

```text
src/
├─ app/
│  ├─ (app)/                  # área pública e logada
│  │  ├─ page.tsx             # início
│  │  ├─ docs/                # documentação de funcionalidades
│  │  ├─ changelog/           # histórico de versões
│  │  ├─ roadmap/             # fases e funcionalidades planejadas
│  │  ├─ library/             # biblioteca (em construção)
│  │  ├─ playlist/            # playlist (em construção)
│  │  ├─ settings/            # configurações (em construção)
│  │  └─ (dashboard)/admin/   # painel administrativo
│  ├─ (auth)/                 # login e cadastro
│  └─ api/auth/[...all]/      # handler do Better Auth
├─ components/
│  ├─ layout/                 # header, temas e navegação
│  └─ ui/                     # componentes shadcn/ui
├─ features/<domínio>/        # componentes, hooks e dados por domínio
├─ server/queries/            # leituras com Drizzle (somente servidor)
├─ db/
│  ├─ index.ts                # client Drizzle (singleton)
│  └─ schemas.ts              # tabelas e relações
├─ lib/                       # auth, auth-client, session e utils
└─ proxy.ts                   # redirecionamento otimista (Next 16)
```

## Modelo de dados

O schema em `src/db/schemas.ts` já contempla as entidades do MVP:

- **Catálogo:** `artists`, `albums`, `tracks`, `genres`, `track_artists`, `track_genres`
- **Biblioteca:** `playlists`, `playlist_tracks`, `liked_tracks`, `artist_follows`
- **Reprodução:** `play_history` (registro previsto apenas após ≥ 30 s ouvidos)
- **Autenticação:** `user`, `session`, `account`, `verification` (Better Auth)

Chaves de domínio usam `uuid`; referências a `user.id` usam `text` com `onDelete: "cascade"`. As colunas são camelCase no TypeScript e snake_case no banco.

## Decisões de projeto

- Server Components por padrão; `"use client"` apenas onde há interatividade (player, formulários).
- Acesso ao banco restrito a `src/server/**`, Server Components e route handlers.
- Mutações via Server Actions que chamam `requireSession()` e validam a entrada.
- Identidade sempre vem de `session.user.id`; nunca de dados enviados pelo cliente.
- URLs de áudio assinadas com expiração (previsto para quando o catálogo real entrar).

## Documentação do produto

Com o app rodando, a própria interface documenta o produto:

- [Documentação](http://localhost:3000/docs)
- [Changelog](http://localhost:3000/changelog)
- [Roadmap](http://localhost:3000/roadmap)

## Notas

- O `lint` pode falhar ao carregar o parser enquanto a combinação ESLint 10 + `typescript-eslint` 8 não suportar TypeScript 7. É uma limitação do toolchain, não dos arquivos do app.
- Nunca commite `.env`; mantenha o `.env.example` atualizado.
