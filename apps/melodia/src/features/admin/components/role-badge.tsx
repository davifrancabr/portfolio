import { Badge } from '@/components/ui/badge';

const roleLabels: Record<string, string> = {
  admin: 'Administrador',
  user: 'Usuário'
};

type UserRoleBadgeProps = {
  role: string;
  banned?: boolean;
};

export function UserRoleBadge({ role, banned = false }: UserRoleBadgeProps) {
  if (banned) return <Badge variant="destructive">Banido</Badge>;

  return (
    <Badge variant={role === 'admin' ? 'default' : 'secondary'}>
      {roleLabels[role] ?? role}
    </Badge>
  );
}
