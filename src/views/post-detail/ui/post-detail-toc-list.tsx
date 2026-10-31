'use client';

import type { MouseEvent } from 'react';

import { cn } from '@/shared/lib/cn';
import type { PostHeading } from '@/views/post-detail/model/use-post-headings';

type Props = {
  headings: PostHeading[];
  onNavigate?: () => void;
};

export function PostDetailTocList({ headings, onNavigate }: Props) {
  const handleTocItemClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;

    onNavigate?.();
  };

  return (
    <nav className="max-h-[calc(100dvh-6rem)] overflow-y-auto overscroll-contain pr-4">
      <ul className="space-y-2 py-2">
        {headings.map(({ id, text, level }) => (
          <li key={id}>
            <a
              href={`#${encodeURIComponent(id)}`}
              className={cn(
                'text-muted-foreground hover:text-foreground focus-visible:ring-ring block rounded-sm py-1 text-sm leading-7 wrap-break-word focus-visible:ring-2',
                level === 2 && 'pl-4',
                level === 3 && 'pl-8',
              )}
              onClick={handleTocItemClick}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
