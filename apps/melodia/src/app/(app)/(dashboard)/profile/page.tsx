import { ProfileView } from '@/features/profile/components/profile-view';
import { requireSession } from '@/lib/session';
import { getUserProfile } from '@/server/queries/profile';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Seu perfil | Melodia',
  description:
    'Suas playlists, músicas curtidas, histórico e artistas seguidos no Melodia.',
  robots: { index: false, follow: false }
};

export default async function ProfilePage() {
  const session = await requireSession();

  const profile = await getUserProfile(session.user.id);

  if (!profile) notFound();

  return <ProfileView profile={profile} isOwner />;
}
