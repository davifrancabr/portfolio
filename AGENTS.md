# AGENTS.md — Portfolio (monorepo)

Guia central para agentes de código (e humanos) neste repositório. Ele descreve o que vale para **todo o monorepo**. Cada app tem seu próprio `AGENTS.md` com regras específicas de domínio; quando houver conflito, o arquivo mais próximo do código editado vence.

## Visão geral

Monorepo de portfolio de Davi Franca, gerenciado com **Turborepo** e **Bun workspaces**. Reúne apps full-stack independentes (`apps/*`) e pacotes internos compartilhados (`packages/*`).

| Caminho                      | Pacote                                    | O que é                                                        | Estado                                                                                   |
| ---------------------------- | ----------------------------------------- | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `apps/melodia`               | `melodia`                                 | App de streaming de músicas (Next.js 16, Drizzle, Better Auth) | Em andamento: scaffold + shadcn/ui; sem schema, rotas ou features ainda                  |
| `packages/eslint-config`     | `@Davifranca-Portfolio/eslint-config`     | Configs ESLint (`base`, `next-js`, `react-internal`)           | Funcional, mas não consumida por nenhum app                                              |
| `packages/typescript-config` | `@Davifranca-Portfolio/typescript-config` | `base`, `nextjs`, `react-library`, `tanstack-react`            | Funcional                                                                                |
| `packages/ui`                | `@Davifranca-Portfolio/ui`                | Biblioteca React compartilhada                                 | Stub do starter (`button`, `card`, `code`); config quebrada (ver "Problemas conhecidos") |
| `packages/shared`            | `@Davifranca-Portfolio/shared`            | Utilitários compartilhados                                     | Stub: `src/formatter.ts` está vazio                                                      |

Antes de assumir que um app existe, confira `apps/` no disco: o `bun.lock` menciona `streamingly` e `vytra`, mas o código pode não estar na sua cópia.

## Ambiente

- **Node** `>=24`. **Bun** é o gerenciador de pacotes (`devEngines` pede `1.3.14`). Use `bun`, nunca `npm`/`yarn`/`pnpm`, para não gerar lockfiles paralelos.
- **TypeScript 7** e **ESLint**/**Prettier** conforme `package.json` de cada workspace.
- Variáveis de ambiente ficam em `.env*` (ignorados pelo git). Cada app que precisar delas deve manter um `.env.example` atualizado. Nunca commite segredos.

## Comandos

Rode da **raiz**:

```bash
bun install                          # instala todos os workspaces
bun run dev                          # turbo run dev (todos os apps)
bun run build                        # turbo run build
bun run lint                         # turbo run lint
bun run check-types                  # turbo run check-types
bun run format                       # prettier --write "**/*.{ts,tsx,md}"

# Restringir a um workspace (use o nome do pacote)
bunx turbo run dev --filter=melodia
bunx turbo run build --filter=melodia
bunx turbo run check-types --filter=@Davifranca-Portfolio/ui
```

Pipeline em `turbo.json`: `build` depende de `^build` e cacheia `.next/**` (exceto `cache` e `dev`); `lint` e `check-types` dependem das mesmas tarefas dos pacotes de que dependem; `dev` é persistente e sem cache.

**Importante:** o Turbo só executa uma tarefa em workspaces que tenham o script correspondente no `package.json`. Hoje `apps/melodia` define apenas `dev`, `build`, `start` e `lint`, então `check-types` **não roda nele**. Ao adicionar um app, defina `check-types` (`tsc --noEmit`) e `lint`.

## Estrutura

```
.
├─ apps/
│  └─ melodia/               # app Next.js (ver apps/melodia/AGENTS.md)
├─ packages/
│  ├─ eslint-config/         # base.js, next.js, react-internal.js
│  ├─ typescript-config/     # base.json, nextjs.json, react-library.json, tanstack-react.json
│  ├─ ui/                    # componentes React compartilhados (exports: ./* -> src/*.tsx)
│  └─ shared/                # utilitários compartilhados (src/*.ts)
├─ turbo.json
├─ package.json              # workspaces: apps/*, packages/*
└─ bun.lock
```

## Convenções gerais

- **Idioma:** texto de UI em pt-BR; código, identificadores e mensagens de commit em inglês. Documentação (README/AGENTS) em pt-BR.
- **TypeScript estrito**, sem `any`. Prefira derivar tipos a duplicá-los.
- **Imports:** apps usam o alias `@/` para `src/`. Pacotes internos são importados pelo nome do pacote (`@Davifranca-Portfolio/ui/button`), nunca por caminho relativo atravessando workspaces.
- **Formatação:** Prettier. `apps/melodia/.prettierrc` usa aspas simples, sem vírgula final e `arrowParens: avoid`. Mantenha o estilo do arquivo que você está editando; arquivos gerados por `shadcn` (`src/components/ui/*`) usam aspas duplas e não devem ser reformatados em massa.
- **Código compartilhado:** só promova algo para `packages/*` quando 2+ apps realmente usarem. Enquanto isso, mantenha dentro do app.
- **Dependências:** adicione no workspace que usa (`bun add <pkg> --cwd apps/melodia` ou `cd` no workspace). Evite divergência de versão de `react`, `next`, `typescript` e `better-auth` entre apps sem motivo.
- **Commits pequenos e focados**; não misture mudança de infraestrutura com feature.

## Stack comum dos apps

Todos os apps do portfolio seguem, em geral, a mesma base:

- Next.js 16 (App Router, React 19, React Compiler ligado), Tailwind CSS 4, shadcn/ui (`base-luma`) com `@base-ui/react` e `lucide-react`.
- PostgreSQL com Drizzle ORM e Better Auth para autenticação.

**Next.js 16 tem mudanças incompatíveis** em relação ao que modelos costumam conhecer (por exemplo, `proxy.ts` no lugar de `middleware.ts`, e tipos globais como `LayoutProps<'/'>`). Antes de escrever código de Next, leia a documentação embarcada em `node_modules/next/dist/docs/` **do app em que está trabalhando** (em monorepo, o pacote `next` pode não estar visível a partir da raiz). Respeite avisos de depreciação.

O bloco `<!-- BEGIN:nextjs-agent-rules -->` em `apps/*/AGENTS.md` é escrito e recriado por `next dev`. Não o remova à mão; commite-o junto com o trabalho para manter a árvore limpa.

## Problemas conhecidos (corrija ao tocar na área)

Estes pontos foram encontrados na análise do repositório. Não os trate como comportamento intencional:

1. **Escopo de pacote inconsistente.** Os pacotes se chamam `@Davifranca-Portfolio/*`, mas `packages/ui/tsconfig.json` estende `@repo/typescript-config/react-library.json` e `packages/ui/eslint.config.mjs` importa `@repo/eslint-config/react-internal`. Esses nomes `@repo/*` não existem; os logs em `packages/ui/.turbo/` confirmam falha de `check-types` e `lint`. Correção: trocar para `@Davifranca-Portfolio/...`. Além disso, o export do ESLint config chama-se `./next-js`, não `./next`.
2. **`packages/shared` sem config de lint.** O script `lint` roda `eslint . --max-warnings 0`, mas não há `eslint.config.*` no pacote (ver `.turbo/turbo-lint.log`). Crie um que reutilize `@Davifranca-Portfolio/eslint-config/base`.
3. **`exports` do `packages/shared`** usa `"./*": "./src/*.{ts,tsx}"`; chaves `{}` não são globs válidos em `exports`. Prefira `"./*": "./src/*.ts"` (ou separe por extensão, como o `ui` faz).
4. **Scripts do app divergem do seu `AGENTS.md`.** `apps/melodia/AGENTS.md` cita `typecheck`, `db:generate`, `db:migrate`, `db:push`, `db:studio` e `auth:generate`, e usa `npm run`, mas o `package.json` do app não define nenhum deles. Adicione os scripts (e use `bun run`) antes de depender deles.
5. **Apps não usam os pacotes internos.** `melodia` tem seu próprio `eslint.config.mjs` (ESLint 9 + `eslint-config-next`) e `tsconfig.json`, sem estender `@Davifranca-Portfolio/*`. Os pacotes compartilhados estão em ESLint 10 e React 19.2.8, enquanto o app usa ESLint 9 e React 19.3.0. Decida conscientemente entre unificar ou manter independente.
6. **Versões do Bun divergentes:** raiz pede `1.3.14` (`devEngines`) e `apps/melodia` declara `packageManager: bun@1.4.2`.
7. **Estado do `melodia`:** `src/app/page.tsx` ainda é o template do `create-next-app`; `src/db`, `src/features` e `src/server` estão vazios; `src/proxy.ts`, `src/lib/auth.ts` e o schema descritos no `AGENTS.md` do app ainda não existem. Trate essa estrutura como **alvo de design**, não como código existente. `drizzle.config.ts` aponta para `./src/db/schema/index.ts` (inexistente por enquanto).
8. **Artefatos no pacote:** o zip analisado continha `node_modules/` e `.next/`. Ambos já estão no `.gitignore`; não os versione.

## Checklist antes de concluir uma tarefa

- [ ] `bun run lint` e `bun run check-types` passam para os workspaces afetados (lembre que `melodia` ainda não tem `check-types`; rode `bunx tsc --noEmit` dentro dele até criar o script)
- [ ] `bun run build` passa se a mudança toca build, rotas ou config
- [ ] Migration gerada se o schema do banco mudou (ver `AGENTS.md` do app)
- [ ] Nenhum segredo commitado; `.env.example` atualizado
- [ ] `AGENTS.md`/`README.md` atualizados se comandos, estrutura ou convenções mudaram
- [ ] Se criou ou renomeou um workspace, confirme que `bun install` atualiza o `bun.lock` sem erros
