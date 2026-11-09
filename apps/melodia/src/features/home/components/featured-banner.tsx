import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Disc3, Heart, Play } from 'lucide-react';
import Link from 'next/link';
import { featured } from '../data';
import { CoverArt } from './cover-art';

export function FeaturedBanner() {
  return (
    <section className="relative overflow-hidden rounded-4xl border border-border bg-linear-to-br from-violet-600/15 via-surface-2 to-surface p-6 sm:p-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-16 size-72 rounded-full bg-fuchsia-500/20 blur-3xl"
      />
      <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-3 py-1 text-xs font-medium text-gold ring-1 ring-gold/20">
            <Disc3 className="size-3.5" aria-hidden="true" />
            Em destaque
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl">
            {featured.title}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {featured.artist}
          </p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
            {featured.description}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href={featured.href}
              className={cn(
                buttonVariants({ size: 'lg' }),
                'bg-gold text-gold-foreground hover:bg-gold/90'
              )}
            >
              <Play className="size-4 fill-current" aria-hidden="true" />
              Ouvir agora
            </Link>
            <Link
              href="/library"
              className={buttonVariants({ variant: 'outline', size: 'lg' })}
            >
              <Heart className="size-4" aria-hidden="true" />
              Salvar na biblioteca
            </Link>
          </div>
        </div>

        <CoverArt
          gradient={featured.gradient}
          icon={Disc3}
          className="aspect-square w-full max-w-56 shrink-0 self-center rounded-3xl shadow-2xl md:max-w-64"
        />
      </div>
    </section>
  );
}
