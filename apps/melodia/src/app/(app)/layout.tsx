import { Header } from '@/components/layout/Header';
import { Player } from '@/features/player/components/player';

type AppLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <>
      <Header />
      {children}
      <Player />
    </>
  );
}
