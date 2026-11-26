import { CoverArt } from '@/components/cover-art';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from '@/components/ui/empty';
import type { ProfilePlaylist } from '@/server/queries/profile';
import { Globe2, ListMusic, Lock, Play } from 'lucide-react';
import Link from 'next/link';

type ProfilePlaylistsProps = {
  playlists: readonly ProfilePlaylist[];
  isOwner: boolean;
};

const GRADIENTS = [
  'from-fuchsia-500 via-purple-600 to-indigo-900',
  'from-orange-400 via-red-500 to-pink-700',
  'from-lime-400 via-emerald-500 to-teal-700',
  'from-blue-500 via-indigo-600 to-violet-900',
  'from-yellow-400 via-amber-500 to-orange-700',
  'from-cyan-400 via-sky-600 to-blue-900'
];

export function ProfilePlaylists({
  playlists,
  isOwner
}: ProfilePlaylistsProps) {
  if (playlists.length === 0) {
    return (
      <Empty className="border bg-surface-2/60">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ListMusic aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>Nenhuma playlist por aqui</EmptyTitle>
          <EmptyDescription>
            {isOwner
              ? 'As playlists que você criar vão aparecer neste espaço.'
              : 'Este perfil ainda não tem playlists públicas.'}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
      {playlists.map((playlist, index) => (
        <Link
          key={playlist.id}
          href={`/playlist?collection=${playlist.id}`}
          className="group flex flex-col gap-3 rounded-2xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <div className="relative">
            {playlist.coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- capas de domínios externos ainda sem remotePatterns
              <img
                src={playlist.coverUrl}
                alt=""
                className="aspect-square w-full rounded-2xl object-cover shadow-lg transition-transform duration-200 group-hover:-translate-y-0.5"
              />
            ) : (
              <CoverArt
                gradient={GRADIENTS[index % GRADIENTS.length]!}
                icon={ListMusic}
                className="aspect-square w-full shadow-lg transition-transform duration-200 group-hover:-translate-y-0.5"
              />
            )}
            <span className="absolute right-2.5 bottom-2.5 flex size-10 translate-y-1 items-center justify-center rounded-full bg-gold text-gold-foreground opacity-0 shadow-lg transition-all group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
              <Play className="size-4 fill-current" aria-hidden="true" />
              <span className="sr-only">Abrir {playlist.name}</span>
            </span>
          </div>

          <div className="min-w-0 px-0.5">
            <p className="truncate text-sm font-medium text-foreground">
              {playlist.name}
            </p>
            {playlist.description && (
              <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                {playlist.description}
              </p>
            )}
            <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              {playlist.isPublic ? (
                <Globe2 className="size-3" aria-hidden="true" />
              ) : (
                <Lock className="size-3" aria-hidden="true" />
              )}
              {playlist.trackCount}{' '}
              {playlist.trackCount === 1 ? 'faixa' : 'faixas'}
              {!playlist.isPublic && ' · Privada'}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
