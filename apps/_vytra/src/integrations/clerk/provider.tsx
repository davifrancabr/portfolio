import { ClerkProvider } from '@clerk/tanstack-react-start';

export default function AppClerkProvider({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ClerkProvider>{children}</ClerkProvider>;
}
