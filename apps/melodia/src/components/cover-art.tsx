import { cn } from '@/lib/utils';
import { Music2, type LucideIcon } from 'lucide-react';

type CoverArtProps = {
  gradient: string;
  icon?: LucideIcon;
  className?: string;
};

export function CoverArt({
  gradient,
  icon: Icon = Music2,
  className
}: Readonly<CoverArtProps>) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'relative flex items-center justify-center overflow-hidden rounded-2xl bg-linear-to-br text-white',
        gradient,
        className
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.28),transparent_55%)]" />
      <Icon className="relative size-1/3 drop-shadow-sm" strokeWidth={1.25} />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/35 to-transparent" />
    </div>
  );
}
