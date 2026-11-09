import { Header } from '@/components/layout/Header';

type AppLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
