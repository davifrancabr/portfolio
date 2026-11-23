'use client';

import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  docCategories,
  docFeatures,
  docStatusMeta,
  type DocCategoryId,
  type DocFeature
} from '@/features/docs/data';
import { BookOpen, ChevronDown, ExternalLink, Search, X } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

type Filter = 'all' | DocCategoryId;

function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function matchesQuery(feature: DocFeature, query: string) {
  if (!query) return true;

  const haystack = normalize(
    [
      feature.title,
      feature.summary,
      ...(feature.steps ?? []),
      ...(feature.notes ?? []),
      ...(feature.keywords ?? [])
    ].join(' ')
  );

  return query.split(/\s+/).every(term => haystack.includes(term));
}

function FeatureCard({ feature }: Readonly<{ feature: DocFeature }>) {
  const status = docStatusMeta[feature.status];
  const Icon = feature.icon;
  const hasDetails =
    (feature.steps?.length ?? 0) > 0 || (feature.notes?.length ?? 0) > 0;

  return (
    <article className="flex flex-col rounded-3xl bg-surface-2 p-5 ring-1 ring-border transition-colors hover:ring-foreground/15">
      <div className="flex items-start justify-between gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-gold/10 text-gold ring-1 ring-gold/15">
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <Badge variant="outline" className={status.className}>
          {status.label}
        </Badge>
      </div>

      <h3 className="mt-4 text-base font-semibold tracking-tight text-foreground">
        {feature.title}
      </h3>
      <p className="mt-1 flex-1 text-sm leading-relaxed text-muted-foreground">
        {feature.summary}
      </p>

      {hasDetails && (
        <details className="group mt-4 border-t border-border pt-3">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-sm font-medium text-foreground outline-none select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-2 [&::-webkit-details-marker]:hidden">
            Como funciona
            <ChevronDown
              className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
              aria-hidden="true"
            />
          </summary>

          <div className="mt-3 space-y-4">
            {feature.steps && feature.steps.length > 0 && (
              <ol className="list-decimal space-y-1.5 pl-4 text-sm leading-relaxed text-muted-foreground marker:text-gold">
                {feature.steps.map(step => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            )}

            {feature.notes && feature.notes.length > 0 && (
              <ul className="space-y-1.5 text-sm leading-relaxed text-muted-foreground">
                {feature.notes.map(note => (
                  <li key={note} className="flex gap-2">
                    <span
                      aria-hidden="true"
                      className="mt-1.5 size-1 shrink-0 rounded-full bg-gold"
                    />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </details>
      )}

      {feature.route && (
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-3">
          <code className="truncate rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
            {feature.route}
          </code>
          <Link
            href={feature.route}
            className={buttonVariants({ variant: 'ghost', size: 'xs' })}
          >
            Abrir
            <ExternalLink className="size-3" aria-hidden="true" />
          </Link>
        </div>
      )}
    </article>
  );
}

export function DocsExplorer() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const normalizedQuery = normalize(query);

  const filtered = useMemo(
    () =>
      docFeatures.filter(
        feature =>
          (filter === 'all' || feature.category === filter) &&
          matchesQuery(feature, normalizedQuery)
      ),
    [filter, normalizedQuery]
  );

  const groups = useMemo(
    () =>
      docCategories
        .map(category => ({
          category,
          items: filtered.filter(feature => feature.category === category.id)
        }))
        .filter(group => group.items.length > 0),
    [filtered]
  );

  const countByCategory = useMemo(() => {
    const counts = new Map<DocCategoryId, number>();

    for (const feature of docFeatures) {
      counts.set(feature.category, (counts.get(feature.category) ?? 0) + 1);
    }

    return counts;
  }, []);

  return (
    <section aria-labelledby="features-heading" className="mt-10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2
            id="features-heading"
            className="text-xl font-semibold tracking-tight sm:text-2xl"
          >
            Funcionalidades
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {filtered.length === 1
              ? '1 funcionalidade encontrada'
              : `${filtered.length} funcionalidades encontradas`}
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
            placeholder="Buscar por funcionalidade, ação ou rota..."
            aria-label="Buscar na documentação"
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
        aria-label="Filtrar por categoria"
      >
        <Button
          type="button"
          size="sm"
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
          aria-pressed={filter === 'all'}
        >
          Todas
          <span className="text-xs opacity-70">{docFeatures.length}</span>
        </Button>
        {docCategories.map(category => (
          <Button
            key={category.id}
            type="button"
            size="sm"
            variant={filter === category.id ? 'default' : 'outline'}
            onClick={() => setFilter(category.id)}
            aria-pressed={filter === category.id}
          >
            {category.label}
            <span className="text-xs opacity-70">
              {countByCategory.get(category.id) ?? 0}
            </span>
          </Button>
        ))}
      </div>

      {groups.length === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border px-6 py-16 text-center">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <BookOpen className="size-5" aria-hidden="true" />
          </span>
          <h3 className="text-base font-semibold">Nenhum resultado</h3>
          <p className="max-w-sm text-sm text-muted-foreground">
            Não encontramos uma funcionalidade com esse termo. Tente outra
            palavra ou limpe os filtros.
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
        <div className="mt-8 flex flex-col gap-10">
          {groups.map(({ category, items }) => (
            <section
              key={category.id}
              id={category.id}
              aria-labelledby={`${category.id}-heading`}
              className="scroll-mt-24"
            >
              <div className="mb-4 flex flex-col gap-1">
                <h3
                  id={`${category.id}-heading`}
                  className="text-lg font-semibold tracking-tight"
                >
                  {category.label}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {category.description}
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {items.map(feature => (
                  <FeatureCard key={feature.id} feature={feature} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </section>
  );
}
