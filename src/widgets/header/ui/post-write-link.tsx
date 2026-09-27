import { PenLine } from 'lucide-react';

import { cn } from '@/shared/lib/cn';
import { buttonVariants } from '@/shared/ui/button';

export function PostWriteLink() {
  return (
    <a
      className={cn(
        buttonVariants({ size: 'lg', variant: 'primarySurface' }),
        'hidden h-9.5 min-w-22 shrink-0 text-[15px] font-semibold',
        'md:inline-flex',
      )}
      href="/write"
    >
      <PenLine className="h-4 w-4" />
      글쓰기
    </a>
  );
}
