'use client';

import { authClient } from '@/lib/auth-client';
import {
  Home,
  Library,
  LogOut,
  Moon,
  Settings,
  ShieldCheck,
  Sun
} from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button, buttonVariants } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { Input } from '../ui/input';
import { Spinner } from '../ui/spinner';

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:bg-accent hover:text-foreground aria-expanded:bg-accent aria-expanded:text-foreground"
          />
        }
        aria-label="Alternar tema"
      >
        <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
        <span className="sr-only">Alternar tema</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          Claro
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          Escuro
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          Sistema
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function UserHeader() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    setIsSigningOut(true);

    try {
      await authClient.signOut();
      router.replace('/login');
      router.refresh();
    } finally {
      setIsSigningOut(false);
    }
  }

  if (isPending) {
    return <div className="size-9 animate-pulse rounded-full bg-muted" />;
  }

  if (!session?.user) {
    return (
      <Link
        href="/login"
        className={buttonVariants({ variant: 'secondary', size: 'sm' })}
      >
        Entrar
      </Link>
    );
  }

  const initial = session.user.name.trim().charAt(0).toUpperCase() || 'U';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            className="m-0 size-10 rounded-full p-0 text-foreground hover:bg-accent hover:text-foreground aria-expanded:bg-accent aria-expanded:text-foreground"
          />
        }
        aria-label={`Menu de ${session.user.name}`}
      >
        <Avatar size="lg" className="ring-1 ring-border">
          {session.user.image && (
            <AvatarImage src={session.user.image} alt="" />
          )}
          <AvatarFallback className="bg-muted text-foreground">
            {initial}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex flex-col gap-0.5">
            <span className="truncate text-sm font-medium text-foreground">
              <p>
                {session.user.name}
                {session.user.role === 'admin' && <ShieldCheck />}
              </p>
            </span>
            <span className="truncate text-xs font-normal">
              {session.user.email}
            </span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem render={<Link href="/library" />}>
            <Library />
            Minha biblioteca
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link href="/settings" />}>
            <Settings />
            Configurações
          </DropdownMenuItem>
          {session.user.role === 'admin' && (
            <DropdownMenuItem render={<Link href="/admin" />}>
              <ShieldCheck />
              Painel administrativo
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={handleSignOut}
          disabled={isSigningOut}
        >
          {isSigningOut ? <Spinner /> : <LogOut />}
          {isSigningOut ? 'Saindo...' : 'Sair'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center gap-4 border-b border-border bg-surface-3/95 px-4 text-foreground shadow-sm backdrop-blur">
      <nav className="flex w-full items-center justify-between gap-4">
        <Link
          href="/"
          className="group flex items-center gap-2 rounded-full px-2 py-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <Home className="size-4 transition-transform group-hover:-translate-y-0.5" />
          Inicio
        </Link>
        <div className="flex min-w-0 flex-1 items-center justify-center gap-3">
          <Input
            placeholder="Pesquisar"
            aria-label="Pesquisar"
            className="w-full min-w-0 max-w-64"
          />
        </div>
        <ModeToggle />
        <UserHeader />
      </nav>
    </header>
  );
}
