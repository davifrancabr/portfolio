import { Spinner } from '@/components/ui/spinner';
import { useSession } from '@/lib/auth-client';

export default function ProfilePage() {
  const { data: session, isPending } = useSession();

  if (isPending) return <Spinner />;

  return (
    <>
      <p>a</p>
    </>
  );
}
