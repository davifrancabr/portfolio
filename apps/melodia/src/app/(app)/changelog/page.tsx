import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { ReleaseTimeline } from '@/features/changelog/components/release-timeline';
import {
  changelogStats,
  currentRelease,
  formatReleaseDate
} from '@/features/changelog/data';
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Map,
  Sparkles,
  Tag
} from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Changelog | Melodia',
  description:
    'Histórico de versões da Melodia: novidades, melhorias, correções e mudanças de design de cada entrega.'
};

export default function ChangelogPage() {
  return (
    <main className="flex-1 bg-surface pb-16 text-foreground">
      <div className="mx-auto w-full max-w-6xl px-4 pt-8 sm:px-6 lg:px-8">
        <header className="relative overflow-hidden rounded-4xl border border-border bg-linear-to-br from-gold/15 via-surface-2 to-surface p-6 sm:p-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-16 size-72 rounded-full bg-gold/20 blur-3xl"
          />

          <div className="relative max-w-2xl">
            <p className="flex items-center gap-1.5 text-sm font-medium text-gold">
              <Sparkles className="size-4" aria-hidden="true" />
              Diário de bordo
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              O que muda na Melodia
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Cada versão entregue, com o que entrou no ar de verdade. Sem
              promessas vagas: aqui você encontra novidades, melhorias,
              correções e mudanças de design, com atalho para o que já pode ser
              usado.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              <Link
                href="/roadmap"
                className={buttonVariants({ variant: 'secondary', size: 'sm' })}
              >
                <Map className="size-4" aria-hidden="true" />
                Ver o roadmap
              </Link>
              <Link
                href="/docs"
                className={buttonVariants({ variant: 'outline', size: 'sm' })}
              >
                <BookOpen className="size-4" aria-hidden="true" />
                Explorar documentação
              </Link>
              <Badge
                variant="outline"
                className="h-7 px-3 text-xs text-muted-foreground"
              >
                {changelogStats.releases} versões registradas
              </Badge>
            </div>
          </div>
        </header>

        <section
          aria-label="Resumo do changelog"
          className="mt-6 grid gap-3 sm:grid-cols-3"
        >
          <div className="flex items-start gap-3 rounded-3xl bg-surface-2 p-5 ring-1 ring-border">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-gold/10 text-gold ring-1 ring-gold/15">
              <Tag className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="font-mono text-2xl font-semibold tabular-nums">
                v{changelogStats.latestVersion}
              </p>
              <p className="text-sm font-medium">Versão atual</p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                {currentRelease?.name ?? 'Última entrega publicada.'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-3xl bg-surface-2 p-5 ring-1 ring-border">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-muted text-foreground">
              <CalendarDays className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-2xl font-semibold tabular-nums">
                {changelogStats.releases}
              </p>
              <p className="text-sm font-medium">Versões publicadas</p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                Desde {formatReleaseDate('2026-11-09')}, com entregas contínuas.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-3xl bg-surface-2 p-5 ring-1 ring-border">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-muted text-foreground">
              <Sparkles className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-2xl font-semibold tabular-nums">
                {changelogStats.changes}
              </p>
              <p className="text-sm font-medium">Mudanças registradas</p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                Entre recursos, melhorias, correções e design.
              </p>
            </div>
          </div>
        </section>

        <ReleaseTimeline />

        <aside className="mt-12 rounded-3xl border border-dashed border-border bg-surface-2/60 p-5 text-sm leading-relaxed text-muted-foreground">
          <p>
            <span className="font-medium text-foreground">Como ler:</span> cada
            versão segue versionamento semântico simplificado. Recursos marcados
            como <strong>Demonstração</strong> na documentação usam dados de
            exemplo; o que aparece aqui já está disponível na interface. Para o
            que vem depois, consulte o{' '}
            <Link
              href="/roadmap"
              className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
            >
              roadmap
            </Link>
            .
          </p>
          <Link
            href="/"
            className={`${buttonVariants({ variant: 'ghost', size: 'sm' })} mt-3 -ml-2`}
          >
            Voltar para a home
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </aside>
      </div>
    </main>
  );
}
