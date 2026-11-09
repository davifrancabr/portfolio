import type { Metadata } from 'next';
import Link from 'next/link';
import { Compass, Sparkles } from 'lucide-react';
import {
  CollectionCard,
  QuickPickCard
} from '@/features/home/components/collection-card';
import { FeaturedBanner } from '@/features/home/components/featured-banner';
import { SectionHeading } from '@/features/home/components/section-heading';
import { genres, madeForYou, recentlyPlayed } from '@/features/home/data';

export const metadata: Metadata = {
  title: 'Início | Melodia',
  description:
    'Descubra faixas, retome o que você ouvia e monte a trilha do seu dia.'
};

export default function HomePage() {
  return (
    <main className="flex-1 bg-surface pb-16 text-foreground">
      <div className="mx-auto w-full max-w-6xl px-4 pt-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-1">
          <p className="flex items-center gap-1.5 text-sm font-medium text-gold">
            <Sparkles className="size-4" aria-hidden="true" />
            Sua música, do seu jeito
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Ouça algo novo hoje
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
            Descubra faixas, retome o que você estava ouvindo e monte a trilha
            do seu dia.
          </p>
        </header>

        <FeaturedBanner />

        <section className="mt-12" aria-labelledby="recently-played-heading">
          <SectionHeading
            id="recently-played-heading"
            title="Tocadas recentemente"
            description="Continue de onde você parou"
            action={{ label: 'Ver biblioteca', href: '/library' }}
          />
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {recentlyPlayed.map(collection => (
              <QuickPickCard key={collection.id} collection={collection} />
            ))}
          </div>
        </section>

        <section className="mt-12" aria-labelledby="made-for-you-heading">
          <SectionHeading
            id="made-for-you-heading"
            title="Feito para você"
            description="Seleções que combinam com o seu gosto"
            action={{ label: 'Ver tudo', href: '/library' }}
          />
          <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
            {madeForYou.map(collection => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        </section>

        <section className="mt-12" aria-labelledby="genres-heading">
          <SectionHeading
            id="genres-heading"
            title="Explore por gênero"
            description="Encontre o som certo para cada momento"
          />
          <div className="mt-5 flex flex-wrap gap-2.5">
            {genres.map(genre => (
              <Link
                key={genre}
                href={`/playlist?genre=${encodeURIComponent(genre)}`}
                className="flex items-center gap-1.5 rounded-full bg-surface-2 px-4 py-2 text-sm text-muted-foreground ring-1 ring-border transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                <Compass className="size-3.5" aria-hidden="true" />
                {genre}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
