import { redirectIfAuthenticated } from '@/lib/session';
import { Headphones, Heart, ListMusic, Music2, Pause } from 'lucide-react';
import Link from 'next/link';

type AuthLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

const FEATURES = [
  {
    icon: Headphones,
    title: 'Ouça sem interrupções',
    description: 'Player contínuo enquanto você navega pelo catálogo.'
  },
  {
    icon: ListMusic,
    title: 'Suas playlists, do seu jeito',
    description: 'Monte coleções para cada momento e compartilhe.'
  },
  {
    icon: Heart,
    title: 'Tudo o que você curte',
    description: 'Curtidas, histórico e artistas favoritos em um só lugar.'
  }
] as const;

export default async function AuthLayout({ children }: AuthLayoutProps) {
  await redirectIfAuthenticated();

  return (
    <div className="grid flex-1 lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-[#111118] p-12 text-white lg:flex lg:flex-col">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 -right-24 size-96 rounded-full bg-violet-600/30 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 -left-24 size-96 rounded-full bg-fuchsia-600/20 blur-3xl"
        />

        <Link
          href="/"
          className="relative flex w-fit items-center gap-2.5 text-lg font-semibold tracking-tight"
        >
          <span className="flex size-9 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
            <Music2 className="size-5" aria-hidden="true" />
          </span>{' '}
          Melodia
        </Link>

        <div className="relative my-auto max-w-md py-12">
          <h2 className="text-4xl font-semibold tracking-tight text-balance">
            Sua música, do seu jeito.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/60">
            Descubra faixas, monte playlists e leve sua biblioteca para qualquer
            lugar.
          </p>

          <ul className="mt-10 space-y-6">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex gap-4">
                <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white/80 ring-1 ring-white/10">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-medium text-white/90">{title}</p>
                  <p className="mt-0.5 text-sm text-white/50">{description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative w-full max-w-sm rounded-3xl bg-white/5 p-4 ring-1 ring-white/10 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-violet-500 to-fuchsia-500">
              <Music2 className="size-5" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                Meia-noite em Copacabana
              </p>
              <p className="truncate text-xs text-white/50">Melodia Sessions</p>
            </div>
            <Pause className="size-4 text-white/60" aria-hidden="true" />
          </div>
          <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-2/3 rounded-full bg-white/80" />
          </div>
          <div className="mt-2 flex justify-between text-[11px] text-white/40">
            <span>2:14</span>
            <span>3:42</span>
          </div>
        </div>
      </aside>

      <main className="flex flex-1 items-center justify-center px-5 py-12 sm:px-8">
        {children}
      </main>
    </div>
  );
}
