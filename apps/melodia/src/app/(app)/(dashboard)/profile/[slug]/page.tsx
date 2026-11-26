import { ProfileView } from '@/features/profile/components/profile-view';
import { getPublicProfileBySlug } from '@/server/queries/profile';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

type PublicProfilePageProps = PageProps<'/profile/[slug]'>;

export async function generateMetadata(
  props: PublicProfilePageProps
): Promise<Metadata> {
  const { slug } = await props.params;
  const profile = await getPublicProfileBySlug(slug);

  if (!profile) {
    return {
      title: 'Perfil não encontrado | Melodia',
      robots: { index: false, follow: false }
    };
  }

  return {
    title: `${profile.user.name} | Melodia`,
    description:
      profile.user.bio?.trim() ||
      `Playlists e artistas seguidos por ${profile.user.name} no Melodia.`
  };
}

export default async function PublicProfilePage(props: PublicProfilePageProps) {
  const { slug } = await props.params;
  const profile = await getPublicProfileBySlug(slug);

  if (!profile) notFound();

  return <ProfileView profile={profile} isOwner={false} />;
}
