'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  changeKindCounts,
  changeKindMeta,
  changeKinds,
  changelogReleases,
  changelogStats,
  formatReleaseDate,
  type ChangeKind,
  type ChangelogItem,
  type Release
} from '@/features/changelog/data';
import { CalendarDays, ExternalLink, Search, Sparkles, X } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

type Filter = 'all' | ChangeKind;

function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function matchesQuery(haystack: readonly string[], query: string) {
  if (!query) return true;

  const normalized = normalize(haystack.join(' '));
  return query.split(/\s+/).every(term => normalized.includes(term));
}

function itemHaystack(item: ChangelogItem) {
  return [item.title, item.description, item.route ?? ''];
}

function releaseHaystack(release: Release) {
  return [release.version, release.name, release.summary];
}

function ReleaseItem({ item }: Readonly<{ item: ChangelogItem }>) {
  const meta = changeKindMeta[item.kind];
  const Icon = meta.icon;

  return (
    <li className="flex gap-3 py-3.5">
      <span
        className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl ring-1 ${meta.iconClassName}`}
      >
        <Icon className="size-4" aria-hidden="true" />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-semibold text-foreground">
            {item.title}
          </h3>
          <Badge
            variant="outline"
            className={`h-5 px-2 text-[11px] ${meta.badgeClassName}`}
          >
            {meta.label}
          </Badge>
        </div>
        <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
          {item.description}
        </p>
      </div>

      {item.route && (
        <Link
          href={item.route}
          className="mt-0.5 hidden shrink-0 items-center gap-1 rounded-full px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:inline-flex"
        >
          Abrir
          <ExternalLink className="size-3" aria-hidden="true" />
        </Link>
      )}
    </li>
  );
}

function ReleaseCard({
  release,
  items
}: Readonly<{ release: Release; items: readonly ChangelogItem[] }>) {
  const formattedDate = formatReleaseDate(release.date);

  return (
    <li
      id={`v${release.version}`}
      className="relative scroll-mt-24 pl-11 sm:pl-14"
    >
      <span
        aria-hidden="true"
        className={`absolute top-2 left-0 flex size-8 items-center justify-center rounded-full ring-1 sm:size-9 ${
          release.isCurrent
            ? 'bg-gold text-gold-foreground ring-gold/40 shadow-[0_0_0_4px_var(--surface)]'
            : 'bg-surface-2 text-muted-foreground ring-border'
        }`}
      >
        <Sparkles className="size-4" />
      </span>

      <article
        className={`rounded-3xl p-5 ring-1 sm:p-6 ${
          release.isCurrent
            ? 'bg-linear-to-br from-gold/10 via-surface-2 to-surface-2 ring-gold/25'
            : 'bg-surface-2 ring-border'
        }`}
      >
        <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="h-6 rounded-full bg-surface px-2.5 font-mono text-xs text-foreground ring-border"
              >
                v{release.version}
              </Badge>
              {release.isCurrent && (
                <Badge className="h-6 rounded-full bg-gold px-2.5 text-xs text-gold-foreground">
                  Versão atual
                </Badge>
              )}
            </div>

            <h2 className="mt-2 text-lg font-semibold tracking-tight text-foreground sm:text-xl">
              {release.name}
            </h2>
          </div>

          <p className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarDays className="size-3.5" aria-hidden="true" />
            <time dateTime={release.date}>{formattedDate}</time>
          </p>
        </header>

        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {release.summary}
        </p>

        <ul className="mt-4 divide-y divide-border border-t border-border">
          {items.map(item => (
            <ReleaseItem key={item.id} item={item} />
          ))}
        </ul>
      </article>
    </li>
  );
}

export function ReleaseTimeline() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const normalizedQuery = normalize(query);

  const groups = useMemo(
    () =>
      changelogReleases
        .map(release => {
          const releaseMatches = matchesQuery(
            releaseHaystack(release),
            normalizedQuery
          );

          const items = release.items.filter(item => {
            const kindMatches = filter === 'all' || item.kind === filter;
            const queryMatches =
              !normalizedQuery ||
              releaseMatches ||
              matchesQuery(itemHaystack(item), normalizedQuery);

            return kindMatches && queryMatches;
          });

          const visibleItems =
            items.length > 0
              ? items
              : releaseMatches && filter === 'all'
                ? release.items
                : [];

          return { release, items: visibleItems };
        })
        .filter(group => group.items.length > 0),
    [filter, normalizedQuery]
  );

  const visibleChanges = groups.reduce(
    (total, group) => total + group.items.length,
    0
  );

  return (
    <section aria-labelledby="releases-heading" className="mt-12">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2
            id="releases-heading"
            className="text-xl font-semibold tracking-tight sm:text-2xl"
          >
            Histórico de versões
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {visibleChanges === 1
              ? '1 mudança encontrada'
              : `${visibleChanges} mudanças encontradas`}{' '}
            em {groups.length === 1 ? '1 versão' : `${groups.length} versões`}
          </p>
        </div>

        <div className="relative w-full max-w-sm">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Buscar por recurso, versão ou rota..."
            aria-label="Buscar no changelog"
            className="pl-9"
          />
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              className="absolute top-1/2 right-2 -translate-y-1/2"
              onClick={() => setQuery('')}
              aria-label="Limpar busca"
            >
              <X aria-hidden="true" />
            </Button>
          )}
        </div>
      </div>

      <div
        className="mt-5 flex flex-wrap gap-2"
        role="group"
        aria-label="Filtrar por tipo de mudança"
      >
        <Button
          type="button"
          size="sm"
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
          aria-pressed={filter === 'all'}
        >
          Tudo
          <span className="text-xs opacity-70">{changelogStats.changes}</span>
        </Button>
        {changeKinds.map(kind => {
          const meta = changeKindMeta[kind];

          return (
            <Button
              key={kind}
              type="button"
              size="sm"
              variant={filter === kind ? 'default' : 'outline'}
              onClick={() => setFilter(kind)}
              aria-pressed={filter === kind}
            >
              {meta.plural}
              <span className="text-xs opacity-70">
                {changeKindCounts[kind]}
              </span>
            </Button>
          );
        })}
      </div>

      {groups.length === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border px-6 py-16 text-center">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <Sparkles className="size-5" aria-hidden="true" />
          </span>
          <h3 className="text-base font-semibold">
            Nenhuma mudança encontrada
          </h3>
          <p className="max-w-sm text-sm text-muted-foreground">
            Não encontramos uma entrega com esse termo. Tente outra palavra ou
            limpe os filtros.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setQuery('');
              setFilter('all');
            }}
          >
            Limpar filtros
          </Button>
        </div>
      ) : (
        <div className="relative mt-8">
          <div
            aria-hidden="true"
            className="absolute top-2 bottom-2 left-4 w-px bg-border sm:left-[18px]"
          />
          <ol className="flex flex-col gap-6">
            {groups.map(group => (
              <ReleaseCard
                key={group.release.version}
                release={group.release}
                items={group.items}
              />
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}
