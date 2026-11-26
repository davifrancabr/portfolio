import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { DocsExplorer } from '@/features/docs/components/docs-explorer';
import {
  docFeatures,
  docStatusCounts,
  docStatusMeta,
  roadmap,
  roadmapStatusMeta,
  techStack,
  type DocStatus
} from '@/features/docs/data';
import {
  ArrowRight,
  BookOpen,
  CircleCheck,
  Clock3,
  Map,
  Sparkles
} from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Documentação | Melodia',
  description:
    'Guia completo das funcionalidades da Melodia: conta, descoberta, player, biblioteca, aparência, administração e transparência do produto.'
};

const STATUS_ICONS: Record<DocStatus, typeof CircleCheck> = {
  available: CircleCheck,
  demo: Sparkles,
  planned: Clock3
};

export default function DocsPage() {
  return (
    <main className="flex-1 bg-surface pb-16 text-foreground">
      <div className="mx-auto w-full max-w-6xl px-4 pt-8 sm:px-6 lg:px-8">
        <header className="relative overflow-hidden rounded-4xl border border-border bg-linear-to-br from-violet-600/15 via-surface-2 to-surface p-6 sm:p-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-16 size-72 rounded-full bg-fuchsia-500/20 blur-3xl"
          />

          <div className="relative max-w-2xl">
            <p className="flex items-center gap-1.5 text-sm font-medium text-gold">
              <BookOpen className="size-4" aria-hidden="true" />
              Central de documentação
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              Tudo o que a Melodia faz
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Um guia de todas as funcionalidades da plataforma: como usar cada
              recurso, o que já está disponível e o que está a caminho. Use a
              busca ou os filtros para encontrar o que precisa.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              <Link
                href="/"
                className={buttonVariants({ variant: 'secondary', size: 'sm' })}
              >
                Voltar para a home
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href="#features-heading"
                className={buttonVariants({ variant: 'outline', size: 'sm' })}
              >
                Explorar funcionalidades
              </Link>
              <Link
                href="/roadmap"
                className={buttonVariants({ variant: 'outline', size: 'sm' })}
              >
                <Map className="size-4" aria-hidden="true" />
                Roadmap
              </Link>
              <Link
                href="/changelog"
                className={buttonVariants({ variant: 'ghost', size: 'sm' })}
              >
                <Sparkles className="size-4" aria-hidden="true" />
                Novidades
              </Link>
              <Badge
                variant="outline"
                className="h-7 px-3 text-xs text-muted-foreground"
              >
                {docFeatures.length} recursos catalogados
              </Badge>
            </div>
          </div>
        </header>

        <section
          aria-label="Resumo da documentação"
          className="mt-6 grid gap-3 sm:grid-cols-3"
        >
          {(
            ['available', 'demo', 'planned'] satisfies readonly DocStatus[]
          ).map(status => {
            const Icon = STATUS_ICONS[status];
            const meta = docStatusMeta[status];

            return (
              <div
                key={status}
                className="flex items-start gap-3 rounded-3xl bg-surface-2 p-5 ring-1 ring-border"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-muted text-foreground">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-2xl font-semibold tabular-nums">
                    {docStatusCounts[status]}
                  </p>
                  <p className="text-sm font-medium">{meta.label}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                    {meta.description}
                  </p>
                </div>
              </div>
            );
          })}
        </section>

        <DocsExplorer />

        <section aria-labelledby="roadmap-heading" className="mt-14">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-1">
              <p className="flex items-center gap-1.5 text-sm font-medium text-gold">
                <Sparkles className="size-4" aria-hidden="true" />
                Próximos passos
              </p>
              <h2
                id="roadmap-heading"
                className="text-xl font-semibold tracking-tight sm:text-2xl"
              >
                Roadmap do produto
              </h2>
              <p className="text-sm text-muted-foreground">
                A ordem planejada para completar a experiência de streaming.
              </p>
            </div>
            <Link
              href="/roadmap"
              className={buttonVariants({ variant: 'ghost', size: 'sm' })}
            >
              Roadmap completo
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>

          <ol className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {roadmap.map(item => {
              const status = roadmapStatusMeta[item.status];

              return (
                <li
                  key={item.step}
                  className="flex items-start gap-3 rounded-2xl bg-surface-2 p-4 ring-1 ring-border"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground tabular-nums">
                    {item.step}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold">{item.title}</h3>
                      <Badge
                        variant="outline"
                        className={`h-5 text-[11px] ${status.className}`}
                      >
                        {status.label}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        <section aria-labelledby="stack-heading" className="mt-14">
          <div className="flex flex-col gap-1">
            <h2
              id="stack-heading"
              className="text-xl font-semibold tracking-tight sm:text-2xl"
            >
              Como a Melodia é construída
            </h2>
            <p className="text-sm text-muted-foreground">
              A base técnica por trás das funcionalidades documentadas acima.
            </p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {techStack.map(({ name, description, icon: Icon }) => (
              <div
                key={name}
                className="rounded-2xl bg-surface-2 p-5 ring-1 ring-border"
              >
                <span className="flex size-9 items-center justify-center rounded-xl bg-gold/10 text-gold ring-1 ring-gold/15">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <h3 className="mt-3 text-sm font-semibold">{name}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <aside className="mt-10 rounded-3xl border border-dashed border-border bg-surface-2/60 p-5 text-sm leading-relaxed text-muted-foreground">
          <p>
            <span className="font-medium text-foreground">Transparência:</span>{' '}
            recursos marcados como <strong>Demonstração</strong> usam dados de
            exemplo. Recursos marcados como <strong>Em breve</strong> já possuem
            estrutura no banco de dados, mas ainda não estão disponíveis na
            interface. Esta página é atualizada junto com o produto.
          </p>
        </aside>
      </div>
    </main>
  );
}
