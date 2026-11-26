import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import type { ProfileUser } from '@/server/queries/profile';
import {
  CalendarDays,
  Mail,
  Pencil,
  ShieldCheck,
  SquareArrowUpRightExit
} from 'lucide-react';
import Link from 'next/link';
import { formatMonthYear } from '../utils/formatDate';

type ProfileHeroProps = {
  profileUser: ProfileUser;
  isOwner: boolean;
};

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return 'U';
  if (parts.length === 1) return (parts[0] ?? '').charAt(0).toUpperCase();

  const first = parts[0] ?? '';
  const last = parts.at(-1) ?? '';

  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
}

export function ProfileHero({
  profileUser,
  isOwner
}: Readonly<ProfileHeroProps>) {
  const bio = profileUser.bio?.trim();

  return (
    <section
      aria-labelledby="profile-name"
      className="overflow-hidden rounded-4xl bg-surface-2 ring-1 ring-border"
    >
      <div className="relative h-36 bg-linear-to-br from-violet-600 via-fuchsia-600 to-indigo-900 sm:h-44">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,rgba(255,255,255,0.3),transparent_55%)]" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/25 to-transparent" />
      </div>

      <div className="px-5 pb-6 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <Avatar className="-mt-12 size-24 shadow-xl ring-4 ring-surface-2 sm:-mt-14 sm:size-28">
              {profileUser.image && (
                <AvatarImage src={profileUser.image} alt="" />
              )}
              <AvatarFallback className="bg-muted text-2xl font-semibold text-foreground">
                {getInitials(profileUser.name)}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 sm:pt-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1
                  id="profile-name"
                  className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
                >
                  {profileUser.name}
                </h1>
                {profileUser.role === 'admin' && (
                  <Badge
                    variant="outline"
                    className="gap-1 border-gold/30 bg-gold/10 text-gold"
                  >
                    <ShieldCheck aria-hidden="true" />
                    Admin
                  </Badge>
                )}
              </div>

              <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-muted-foreground">
                {bio ||
                  (isOwner
                    ? 'Conte um pouco sobre você e sobre a música que te move.'
                    : 'Este usuário ainda não escreveu uma bio.')}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                {isOwner && (
                  <span className="inline-flex items-center gap-1.5">
                    <Mail className="size-3.5" aria-hidden="true" />
                    {profileUser.email}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="size-3.5" aria-hidden="true" />
                  Membro desde {formatMonthYear(profileUser.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {isOwner && (
            <div className="flex flex-wrap items-center gap-2 sm:pt-1">
              <Link
                href={`/profile/${profileUser.id}`}
                className={buttonVariants({ variant: 'outline', size: 'sm' })}
              >
                <SquareArrowUpRightExit aria-hidden="true" />
                Ver perfil público
              </Link>
              <Link href="/settings" className={buttonVariants({ size: 'sm' })}>
                <Pencil aria-hidden="true" />
                Editar perfil
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
