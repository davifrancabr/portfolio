import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from '@/components/ui/empty';
import type { ProfileFollowedArtist } from '@/server/queries/profile';
import { BadgeCheck, UserRoundPlus } from 'lucide-react';
import { formatDate } from '../utils/formatDate';

type ProfileArtistsProps = {
  artists: readonly ProfileFollowedArtist[];
  isOwner: boolean;
};

function getInitial(name: string) {
  return name.trim().charAt(0).toUpperCase() || 'A';
}

export function ProfileArtists({ artists, isOwner }: ProfileArtistsProps) {
  if (artists.length === 0) {
    return (
      <Empty className="border bg-surface-2/60">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <UserRoundPlus aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>Nenhum artista seguido</EmptyTitle>
          <EmptyDescription>
            {isOwner
              ? 'Siga artistas para acompanhar novidades e ver tudo reunido aqui.'
              : 'Este perfil ainda não segue nenhum artista.'}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {artists.map(artist => (
        <article
          key={artist.id}
          className="flex items-center gap-3 rounded-2xl bg-surface-2 p-3 ring-1 ring-border"
        >
          <Avatar className="size-12">
            {artist.imageUrl && <AvatarImage src={artist.imageUrl} alt="" />}
            <AvatarFallback className="bg-muted text-base font-semibold text-foreground">
              {getInitial(artist.name)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <p className="flex items-center gap-1 truncate text-sm font-medium text-foreground">
              {artist.name}
              {artist.verified && (
                <>
                  <BadgeCheck
                    className="size-4 shrink-0 text-gold"
                    aria-hidden="true"
                  />
                  <span className="sr-only">Artista verificado</span>
                </>
              )}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              Segue desde {formatDate(artist.followedAt)}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}
