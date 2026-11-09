import { Disc3, Play } from 'lucide-react';
import Link from 'next/link';
import type { Collection } from '../data';
import { CoverArt } from './cover-art';

type CollectionCardProps = {
  collection: Collection;
};

export function QuickPickCard({ collection }: CollectionCardProps) {
  return (
    <Link
      href={collection.href}
      className="group flex items-center gap-3 rounded-2xl bg-surface-2 p-2.5 ring-1 ring-border transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <CoverArt
        gradient={collection.gradient}
        icon={Disc3}
        className="size-14 shrink-0 rounded-xl"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">
          {collection.title}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {collection.subtitle}
        </p>
      </div>
      <span className="mr-1 flex size-9 shrink-0 items-center justify-center rounded-full bg-gold text-gold-foreground opacity-0 shadow-lg transition-all group-hover:opacity-100 group-focus-visible:opacity-100">
        <Play className="size-4 fill-current" aria-hidden="true" />
        <span className="sr-only">Ouvir {collection.title}</span>
      </span>
    </Link>
  );
}

export function CollectionCard({ collection }: CollectionCardProps) {
  return (
    <Link
      href={collection.href}
      className="group flex flex-col gap-3 rounded-2xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <div className="relative">
        <CoverArt
          gradient={collection.gradient}
          className="aspect-square w-full shadow-lg transition-transform duration-200 group-hover:-translate-y-0.5"
        />
        <span className="absolute right-2.5 bottom-2.5 flex size-10 translate-y-1 items-center justify-center rounded-full bg-gold text-gold-foreground opacity-0 shadow-lg transition-all group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
          <Play className="size-4 fill-current" aria-hidden="true" />
          <span className="sr-only">Ouvir {collection.title}</span>
        </span>
      </div>
      <div className="min-w-0 px-0.5">
        <p className="truncate text-sm font-medium text-foreground">
          {collection.title}
        </p>
        <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {collection.subtitle}
        </p>
      </div>
    </Link>
  );
}
