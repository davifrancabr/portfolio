import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import {
  roadmapFeatureStatusMeta,
  roadmapPhases,
  roadmapPrinciples,
  roadmapStats,
  roadmapStatusMeta,
  type RoadmapPhase,
  type RoadmapStatus
} from '@/features/roadmap/data';
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CircleCheck,
  Clock3,
  Compass,
  Flag,
  Layers,
  ListChecks,
  Map,
  Sparkles,
  Target
} from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Roadmap | Melodia',
  description:
    'Roadmap da Melodia: o que já foi entregue, o que está em andamento e as funcionalidades planejadas para as próximas fases.'
};

const phaseBarClassName: Record<RoadmapPhase['status'], string> = {
  done: 'bg-emerald-500',
  'in-progress': 'bg-gold',
  planned: 'bg-muted-foreground/40',
  exploring: 'bg-violet-500'
};

const principleIcons = [Target, Layers, Flag] as const;

function PhaseCard({ phase }: Readonly<{ phase: RoadmapPhase }>) {
  const status = roadmapStatusMeta[phase.status];
  const StatusIcon = status.icon;

  return (
    <li id={phase.id} className="relative scroll-mt-24 pl-11 sm:pl-14">
      <span
        aria-hidden="true"
        className={`absolute top-2 left-0 flex size-8 items-center justify-center rounded-full text-sm font-semibold ring-1 sm:size-9 ${status.nodeClassName}`}
      >
        {phase.status === 'done' ? (
          <StatusIcon className="size-4" />
        ) : (
          phase.order
        )}
      </span>

      <article className="rounded-3xl bg-surface-2 p-5 ring-1 ring-border sm:p-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className={status.badgeClassName}>
                <StatusIcon aria-hidden="true" />
                {status.label}
              </Badge>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <CalendarDays className="size-3.5" aria-hidden="true" />
                {phase.timeframe}
              </span>
            </div>

            <h2 className="mt-2 text-lg font-semibold tracking-tight text-foreground sm:text-xl">
              {phase.title}
            </h2>
            <p className="text-sm font-medium text-gold">{phase.tagline}</p>
          </div>

          <div className="w-full shrink-0 sm:w-40">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Progresso</span>
              <span className="font-medium tabular-nums text-foreground">
                {phase.progress}%
              </span>
            </div>
            <div
              role="progressbar"
              aria-label={`Progresso da fase ${phase.title}`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={phase.progress}
              className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted"
            >
              <div
                className={`h-full rounded-full transition-all ${phaseBarClassName[phase.status]}`}
                style={{ width: `${phase.progress}%` }}
              />
            </div>
          </div>
        </header>

        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {phase.summary}
        </p>

        <ul className="mt-5 grid gap-x-6 gap-y-4 border-t border-border pt-4 sm:grid-cols-2">
          {phase.features.map(feature => {
            const featureMeta = roadmapFeatureStatusMeta[feature.status];
            const FeatureIcon = featureMeta.icon;

            return (
              <li key={feature.title} className="flex gap-2.5">
                <FeatureIcon
                  className={`mt-0.5 size-4 shrink-0 ${featureMeta.iconClassName}`}
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <span className="sr-only">{featureMeta.label}: </span>
                  <p
                    className={`text-sm font-medium ${
                      feature.status === 'done'
                        ? 'text-foreground'
                        : 'text-foreground/90'
                    }`}
                  >
                    {feature.title}
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>

        {phase.dependsOn && (
          <p className="mt-4 flex items-center gap-1.5 border-t border-border pt-3 text-xs text-muted-foreground">
            <Layers className="size-3.5" aria-hidden="true" />
            Depende de: {phase.dependsOn}
          </p>
        )}
      </article>
    </li>
  );
}

export default function RoadmapPage() {
  return (
    <main className="flex-1 bg-surface pb-16 text-foreground">
      <div className="mx-auto w-full max-w-6xl px-4 pt-8 sm:px-6 lg:px-8">
        <header className="relative overflow-hidden rounded-4xl border border-border bg-linear-to-br from-emerald-500/10 via-surface-2 to-surface p-6 sm:p-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-16 size-72 rounded-full bg-emerald-500/15 blur-3xl"
          />

          <div className="relative max-w-2xl">
            <p className="flex items-center gap-1.5 text-sm font-medium text-gold">
              <Map className="size-4" aria-hidden="true" />
              Plano de produto
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              Para onde a Melodia vai
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              O caminho até um streaming completo, em fases honestas: o que já
              está no ar, o que está sendo construído agora e o que vem depois.
              O roadmap é vivo e muda conforme o uso real do produto.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              <Link
                href="/changelog"
                className={buttonVariants({ variant: 'secondary', size: 'sm' })}
              >
                <Sparkles className="size-4" aria-hidden="true" />
                Ver o que já foi entregue
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
                {roadmapStats.features} funcionalidades mapeadas
              </Badge>
            </div>

            <div className="mt-6 max-w-sm">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Flag className="size-3.5" aria-hidden="true" />
                  Progresso geral
                </span>
                <span className="font-medium tabular-nums text-foreground">
                  {roadmapStats.overallProgress}%
                </span>
              </div>
              <div
                role="progressbar"
                aria-label="Progresso geral do roadmap"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={roadmapStats.overallProgress}
                className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-muted"
              >
                <div
                  className="h-full rounded-full bg-linear-to-r from-emerald-500 to-gold"
                  style={{ width: `${roadmapStats.overallProgress}%` }}
                />
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">
                {roadmapStats.featuresDone} de {roadmapStats.features}{' '}
                funcionalidades entregues, ponderando o que está em andamento.
              </p>
            </div>
          </div>
        </header>

        <section
          aria-label="Resumo do roadmap"
          className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
        >
          <div className="flex items-start gap-3 rounded-3xl bg-surface-2 p-5 ring-1 ring-border">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-500/15 dark:text-emerald-400">
              <CircleCheck className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-2xl font-semibold tabular-nums">
                {roadmapStats.phasesDone}
              </p>
              <p className="text-sm font-medium">Fases entregues</p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                {roadmapStats.phasesDone === 1
                  ? 'Fase completa'
                  : 'Fases completas'}{' '}
                de {roadmapStats.phases}.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-3xl bg-surface-2 p-5 ring-1 ring-border">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-gold/10 text-gold ring-1 ring-gold/15">
              <Clock3 className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-2xl font-semibold tabular-nums">
                {roadmapStats.phasesInProgress}
              </p>
              <p className="text-sm font-medium">Em andamento</p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                Fase ativa com partes já funcionando.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-3xl bg-surface-2 p-5 ring-1 ring-border">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-muted text-foreground">
              <ListChecks className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-2xl font-semibold tabular-nums">
                {roadmapStats.phasesPlanned}
              </p>
              <p className="text-sm font-medium">Fases planejadas</p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                Priorizadas para depois do catálogo.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-3xl bg-surface-2 p-5 ring-1 ring-border">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-700 ring-1 ring-violet-500/15 dark:text-violet-400">
              <Compass className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-2xl font-semibold tabular-nums">
                {roadmapStats.phasesExploring}
              </p>
              <p className="text-sm font-medium">Em exploração</p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                Ideias que ainda podem mudar de forma.
              </p>
            </div>
          </div>
        </section>

        <section
          aria-label="Legenda de status"
          className="mt-6 flex flex-wrap items-center gap-2"
        >
          {(
            [
              'done',
              'in-progress',
              'planned',
              'exploring'
            ] satisfies readonly RoadmapStatus[]
          ).map(status => {
            const meta = roadmapStatusMeta[status];
            const Icon = meta.icon;

            return (
              <Badge
                key={status}
                variant="outline"
                className={`h-7 px-3 ${meta.badgeClassName}`}
                title={meta.description}
              >
                <Icon aria-hidden="true" />
                {meta.label}
              </Badge>
            );
          })}
          <span className="text-xs text-muted-foreground">
            Atualizado em novembro de 2026.
          </span>
        </section>

        <section aria-labelledby="phases-heading" className="mt-12">
          <div className="flex flex-col gap-1">
            <h2
              id="phases-heading"
              className="text-xl font-semibold tracking-tight sm:text-2xl"
            >
              Fases do produto
            </h2>
            <p className="text-sm text-muted-foreground">
              Da base técnica à experiência avançada, na ordem em que as coisas
              precisam acontecer.
            </p>
          </div>

          <div className="relative mt-8">
            <div
              aria-hidden="true"
              className="absolute top-2 bottom-2 left-4 w-px bg-border sm:left-[18px]"
            />
            <ol className="flex flex-col gap-6">
              {roadmapPhases.map(phase => (
                <PhaseCard key={phase.id} phase={phase} />
              ))}
            </ol>
          </div>
        </section>

        <section aria-labelledby="principles-heading" className="mt-14">
          <div className="flex flex-col gap-1">
            <h2
              id="principles-heading"
              className="text-xl font-semibold tracking-tight sm:text-2xl"
            >
              Como a ordem é decidida
            </h2>
            <p className="text-sm text-muted-foreground">
              Três critérios simples para escolher o que vem primeiro.
            </p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {roadmapPrinciples.map((principle, index) => {
              const Icon = principleIcons[index] ?? Target;

              return (
                <div
                  key={principle.title}
                  className="rounded-2xl bg-surface-2 p-5 ring-1 ring-border"
                >
                  <span className="flex size-9 items-center justify-center rounded-xl bg-gold/10 text-gold ring-1 ring-gold/15">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <h3 className="mt-3 text-sm font-semibold">
                    {principle.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {principle.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <aside className="mt-10 flex flex-col gap-4 rounded-3xl border border-dashed border-border bg-surface-2/60 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm leading-relaxed text-muted-foreground">
            <p className="font-medium text-foreground">
              Acompanhe as entregas de perto
            </p>
            <p>O changelog registra cada versão assim que ela vai ao ar.</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <Link
              href="/changelog"
              className={buttonVariants({ variant: 'secondary', size: 'sm' })}
            >
              Abrir changelog
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href="/"
              className={buttonVariants({ variant: 'ghost', size: 'sm' })}
            >
              Voltar para a home
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
