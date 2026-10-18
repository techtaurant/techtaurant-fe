import type { HTMLAttributes } from 'react';

import { cn } from '@/shared/lib/cn';

type Props = HTMLAttributes<HTMLSpanElement>;

export function Badge({ className, ...props }: Props) {
  return (
    <span
      className={cn(
        'border-border bg-muted text-foreground inline-flex h-5 items-center rounded-full border px-2 text-[11px] leading-none font-semibold',
        className,
      )}
      {...props}
    />
  );
}
