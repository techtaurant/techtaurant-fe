'use client';

import { useState } from 'react';

import type { PostDetailAttachmentPresignedUrlResponse } from '@/shared/api/generated';
import { cn } from '@/shared/lib/cn';
import { PostContent } from '@/shared/ui/post-content';
import { preparePostHeadings } from '@/views/post-detail/lib/prepare-post-headings';

type Props = {
  attachmentPresignedUrls: PostDetailAttachmentPresignedUrlResponse[];
  content: string;
  postId: string;
};

export function PostDetailContent({ attachmentPresignedUrls, content, postId }: Props) {
  const [headings, setHeadings] = useState<ReturnType<typeof preparePostHeadings>>([]);
  const prepareBody = (body: HTMLDivElement | null) => {
    if (!body) return;
    const nextHeadings = preparePostHeadings(body, postId);
    setHeadings((currentHeadings) => {
      const isUnchanged =
        currentHeadings.length === nextHeadings.length &&
        currentHeadings.every((heading, index) => {
          const next = nextHeadings[index];
          return heading.id === next.id && heading.title === next.title && heading.level === next.level;
        });
      return isUnchanged ? currentHeadings : nextHeadings;
    });
  };

  return (
    <>
      {headings.length > 0 && (
        <nav aria-label="본문 목차" className="border-border mb-8 rounded-lg border px-5 py-4">
          <p className="mb-2 font-semibold">목차</p>
          <ul>
            {headings.map((heading) => (
              <li key={heading.id} className={cn(heading.level === 3 && 'pl-4')}>
                <a
                  className="text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex min-h-11 items-center rounded-sm text-sm underline-offset-4 hover:underline focus-visible:ring-2"
                  href={`#${heading.id}`}
                  onClick={() => document.getElementById(heading.id)?.focus({ preventScroll: true })}
                >
                  {heading.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
      <div ref={prepareBody}>
        <PostContent attachmentPresignedUrls={attachmentPresignedUrls} className="mb-12" content={content} />
      </div>
    </>
  );
}
