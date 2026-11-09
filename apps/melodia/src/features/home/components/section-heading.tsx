import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

type SectionHeadingProps = {
  id?: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    href: string;
  };
};

export function SectionHeading({
  id,
  title,
  description,
  action
}: SectionHeadingProps) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <h2
          id={id}
          className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
        >
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action && (
        <Link
          href={action.href}
          className="flex shrink-0 items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          {action.label}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}
