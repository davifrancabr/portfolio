'use client';

import { authClient } from '@/lib/auth-client';
import { Heart, Home } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/button';
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

function UserHeader() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending)
    return (
      <div className="size-8 bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
    );

  if (session?.user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline" />}>
          {session.user.image ? (
            <Image
              src={session.user.image}
              alt=""
              className="size-8"
              width={32}
              height={32}
            />
          ) : (
            <section className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
              {session.user.name.charAt(0).toUpperCase() || 'U'}
            </section>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuItem>
              <Link href="/">Perfil</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/">Meus Pedidos</Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Button
              onClick={() => {
                void authClient.signOut();
              }}
            >
              Sair
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <section className="flex flex-row items-center justify-center space-x-2">
      <Link href="/sign-in">Entrar</Link>
      <Link href="/sign-up">Cadastrar</Link>
    </section>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 flex flex-row items-center h-16 bg-surface-3 px-4 shadow-md">
      <nav className="flex flex-row items-center justify-between w-full">
        <Link href="/" className="flex items-center gap-2">
          <Home /> Inicio
        </Link>
        <section className="flex items-center gap-4">
          <Input placeholder="🔍 Pesquisar" className="w-80" />
          <section className="flex items-center justify-center gap-2 hover:border-2 hover:bg-surface-2 w-30 h-12 rounded-lg">
            <Heart />
            <p>Favoritos</p>
          </section>
        </section>
        <section>
          <UserHeader />
        </section>
      </nav>
    </header>
  );
}
