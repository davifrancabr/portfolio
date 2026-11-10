import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type StatCardProps = {
  label: string;
  value: number;
  icon: LucideIcon;
  className?: string;
};

const numberFormatter = new Intl.NumberFormat('pt-BR');

export function StatCard({
  label,
  value,
  icon: Icon,
  className
}: StatCardProps) {
  return (
    <Card size="sm" className={cn('bg-surface-2', className)}>
      <CardContent className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold ring-1 ring-gold/20"
        >
          <Icon className="size-5" />
        </span>
        <div className="min-w-0">
          <p className="text-2xl font-semibold tracking-tight text-foreground">
            {numberFormatter.format(value)}
          </p>
          <p className="truncate text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
