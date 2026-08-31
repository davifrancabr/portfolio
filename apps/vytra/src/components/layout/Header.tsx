import { getSession } from '#/lib/auth.function';
import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import { Heart, Home } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { Input } from '../ui/input';

export function Header() {
  const session = useServerFn(getSession);

  const { data: user } = useQuery({
    queryKey: ['current-user'],
    queryFn: () => session()
  });

  const data = user?.user;

  return (
    <header className="sticky top-0 flex flex-row items-center h-16 bg-surface-3 px-4 shadow-md">
      <nav className="flex flex-row items-center justify-between w-full">
        <Link to="/" className="flex items-center gap-2">
          <Home /> Inicio
        </Link>
        <section className="flex items-center gap-4">
          <Input placeholder="🔍 Pesquisar" className="w-80" />
          <section className="flex items-center justify-center gap-2 hover:border-2 hover:bg-surface-2 w-30 h-12 rounded-lg">
            <Heart className="hover:fill-red-700" />
            <p>Favoritos</p>
          </section>
        </section>
        <section>
          {data ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage src={`${data.image}`} />
                  <AvatarFallback>{data.name[0]}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
                <DropdownMenuItem>Meu perfil</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <p>Login</p>
          )}
        </section>
      </nav>
    </header>
  );
}
