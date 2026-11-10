'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

type ControlButtonProps = {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  active?: boolean;
  className?: string;
};

/** Botão de ícone dos controles do player (aleatório, voltar, avançar...). */
export function ControlButton({
  icon: Icon,
  label,
  onClick,
  active = false,
  className
}: ControlButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'relative text-muted-foreground hover:text-foreground',
        active && 'text-gold hover:text-gold',
        className
      )}
    >
      <Icon className="size-4" aria-hidden="true" />
      {active ? (
        <span
          aria-hidden="true"
          className="absolute bottom-0.5 size-1 rounded-full bg-gold"
        />
      ) : null}
    </Button>
  );
}
