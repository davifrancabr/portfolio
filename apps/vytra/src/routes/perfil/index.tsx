import { db } from '#/db';
import { getSession } from '#/lib/auth.function';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/perfil/')({
  beforeLoad: async () => {
    const data = await getSession();
    if (!data?.session) throw redirect({ to: '/' });

    return { session: data };
  },
  loader: async ({ context }) => {
    const data = await db.query.user.findFirst({
      where: {
        id: context.session.user.id
      }
    });

    return { data };
  },
  component: RouteComponent
});

function RouteComponent() {
  const { data } = Route.useLoaderData();

  return (
    <main className="flex flex-col">
      <section>a</section>
    </main>
  );
}
