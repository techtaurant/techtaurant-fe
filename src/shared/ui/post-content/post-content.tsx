import '@/shared/ui/post-content/post-content-highlight.css';

import type { PostDetailAttachmentPresignedUrlResponse } from '@/shared/api/generated';
import { cn } from '@/shared/lib/cn';
import { highlightCode } from '@/shared/lib/markdown/highlight-code';
import { renderPostMarkdown } from '@/shared/lib/markdown/render-post-markdown';
import styles from '@/shared/ui/post-content/post-content.module.css';

type Props = {
  attachmentPresignedUrls: PostDetailAttachmentPresignedUrlResponse[];
  className?: string;
  content: string;
};

export function PostContent({ attachmentPresignedUrls, className, content }: Props) {
  const html = renderPostMarkdown(content, attachmentPresignedUrls, highlightCode);

  return (
    <div data-post-content className={cn(styles.postContent, className)} dangerouslySetInnerHTML={{ __html: html }} />
  );
}
