import type { PostDetailAttachmentPresignedUrlResponse } from '@/shared/api/generated';
import { cn } from '@/shared/lib/cn';
import { renderPostMarkdown } from '@/shared/lib/markdown/render-post-markdown';

type Props = {
  attachmentPresignedUrls: PostDetailAttachmentPresignedUrlResponse[];
  content: string;
};

export function PostWritePreview({ attachmentPresignedUrls, content }: Props) {
  const html = renderPostMarkdown(content, attachmentPresignedUrls);

  return (
    <div
      className={cn(
        'text-foreground text-base leading-8 wrap-break-word whitespace-pre-wrap',
        '[&_pre]:whitespace-pre-wrap',
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
