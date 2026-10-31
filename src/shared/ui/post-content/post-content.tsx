import '@/shared/ui/post-content/post-content-highlight.css';

import type { Ref } from 'react';

import type { PostDetailAttachmentPresignedUrlResponse } from '@/shared/api/generated';
import { cn } from '@/shared/lib/cn';
import { highlightCode } from '@/shared/lib/markdown/highlight-code';
import { renderPostMarkdown } from '@/shared/lib/markdown/render-post-markdown';
import styles from '@/shared/ui/post-content/post-content.module.css';

type Props = {
  ref?: Ref<HTMLDivElement>;
  attachmentPresignedUrls: PostDetailAttachmentPresignedUrlResponse[];
  className?: string;
  content: string;
};

export function PostContent({ attachmentPresignedUrls, className, content, ref }: Props) {
  const html = renderPostMarkdown(content, attachmentPresignedUrls, highlightCode);

  return (
    <div
      ref={ref}
      data-post-content
      className={cn(styles.postContent, className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
