import { Card, CardContent } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';

export type ProfileStatItem = {
  label: string;
  value: number;
  icon: LucideIcon;
};

type ProfileStatsProps = {
  items: readonly ProfileStatItem[];
};

const numberFormatter = new Intl.NumberFormat('pt-BR');

export function ProfileStats({ items }: ProfileStatsProps) {
  return (
    <section
      aria-label="Resumo do perfil"
      className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4"
    >
      {items.map(({ label, value, icon: Icon }) => (
        <Card key={label} size="sm" className="bg-surface-2">
          <CardContent className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold ring-1 ring-gold/20"
            >
              <Icon className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="text-xl font-semibold tracking-tight tabular-nums text-foreground">
                {numberFormatter.format(value)}
              </p>
              <p className="truncate text-xs text-muted-foreground">{label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
