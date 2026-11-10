import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from '@/components/ui/empty';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { UserRoleBadge } from '@/features/admin/components/role-badge';
import { StatCard } from '@/features/admin/components/stat-card';
import { requireAdmin } from '@/lib/session';
import { getAdminOverview } from '@/server/queries/admin';
import {
  Disc3,
  Headphones,
  ListMusic,
  MicVocal,
  Music,
  ShieldCheck,
  Users
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Administração | Melodia',
  description: 'Painel administrativo do catálogo e da comunidade Melodia.',
  robots: { index: false, follow: false }
};

const numberFormatter = new Intl.NumberFormat('pt-BR');
const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric'
});
const dateTimeFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit'
});

export default async function AdminPage() {
  const session = await requireAdmin();

  const { stats, recentUsers, topTracks, recentPlays } =
    await getAdminOverview();

  return (
    <main className="flex-1 bg-surface pb-16 text-foreground">
      <div className="mx-auto w-full max-w-6xl px-4 pt-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="flex items-center gap-1.5 text-sm font-medium text-gold">
              <ShieldCheck className="size-4" aria-hidden="true" />
              Área restrita
            </p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Painel administrativo
            </h1>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Acompanhe o catálogo, os usuários e a atividade da plataforma.
            </p>
          </div>
          <Badge
            variant="outline"
            className="h-7 shrink-0 gap-1.5 self-start px-3 sm:self-auto"
          >
            <ShieldCheck className="size-3.5" aria-hidden="true" />
            {session.user.name}
          </Badge>
        </header>

        <section
          aria-label="Resumo da plataforma"
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
        >
          <StatCard label="Usuários" value={stats.users} icon={Users} />
          <StatCard label="Artistas" value={stats.artists} icon={MicVocal} />
          <StatCard label="Álbuns" value={stats.albums} icon={Disc3} />
          <StatCard label="Faixas" value={stats.tracks} icon={Music} />
          <StatCard
            label="Playlists"
            value={stats.playlists}
            icon={ListMusic}
          />
          <StatCard label="Reproduções" value={stats.plays} icon={Headphones} />
        </section>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <Card className="bg-surface-2">
            <CardHeader>
              <CardTitle>Usuários recentes</CardTitle>
              <CardDescription>
                Os últimos cadastros da plataforma.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentUsers.length === 0 ? (
                <Empty className="border">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <Users aria-hidden="true" />
                    </EmptyMedia>
                    <EmptyTitle>Nenhum usuário ainda</EmptyTitle>
                    <EmptyDescription>
                      Os novos cadastros aparecerão aqui.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Papel</TableHead>
                      <TableHead className="text-right">Cadastro</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentUsers.map(recentUser => (
                      <TableRow key={recentUser.id}>
                        <TableCell>
                          <div className="flex items-center gap-2.5">
                            <span
                              aria-hidden="true"
                              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold text-foreground"
                            >
                              {recentUser.name.trim().charAt(0).toUpperCase() ||
                                'U'}
                            </span>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-foreground">
                                {recentUser.name}
                              </p>
                              <p className="truncate text-xs text-muted-foreground">
                                {recentUser.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <UserRoleBadge
                            role={recentUser.role}
                            banned={recentUser.banned}
                          />
                        </TableCell>
                        <TableCell className="text-right text-xs text-muted-foreground">
                          {dateFormatter.format(recentUser.createdAt)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card className="bg-surface-2">
            <CardHeader>
              <CardTitle>Faixas mais tocadas</CardTitle>
              <CardDescription>
                Ranking pelas reproduções registradas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {topTracks.length === 0 ? (
                <Empty className="border">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <Music aria-hidden="true" />
                    </EmptyMedia>
                    <EmptyTitle>Sem reproduções registradas</EmptyTitle>
                    <EmptyDescription>
                      O ranking será montado quando as faixas começarem a tocar.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              ) : (
                <ol className="flex flex-col gap-1">
                  {topTracks.map((track, index) => (
                    <li
                      key={track.id}
                      className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-accent"
                    >
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                        {index + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">
                          {track.title}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {track.artist ?? 'Artista desconhecido'}
                        </p>
                      </div>
                      <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                        {numberFormatter.format(track.playCount)}{' '}
                        {track.playCount === 1 ? 'reprodução' : 'reproduções'}
                      </span>
                    </li>
                  ))}
                </ol>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-4 bg-surface-2">
          <CardHeader>
            <CardTitle>Atividade recente</CardTitle>
            <CardDescription>
              Últimas reproduções registradas na plataforma.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentPlays.length === 0 ? (
              <Empty className="border">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Headphones aria-hidden="true" />
                  </EmptyMedia>
                  <EmptyTitle>Nenhuma reprodução registrada</EmptyTitle>
                  <EmptyDescription>
                    As reproduções com pelo menos 30 segundos aparecerão aqui.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Faixa</TableHead>
                    <TableHead>Usuário</TableHead>
                    <TableHead className="text-right">Quando</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentPlays.map(play => (
                    <TableRow key={play.id}>
                      <TableCell className="font-medium text-foreground">
                        {play.trackTitle}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {play.userName}
                      </TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground">
                        {dateTimeFormatter.format(play.playedAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
