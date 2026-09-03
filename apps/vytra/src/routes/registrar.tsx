import { Register } from '#/components/forms/signUp-form';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/registrar')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <main className="flex flex-col mx-auto py-20">
      <Register />
    </main>
  );
}
