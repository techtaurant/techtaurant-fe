import type { PostDetailAttachmentPresignedUrlResponse } from '@/shared/api/generated';
import { cn } from '@/shared/lib/cn';
import { renderPostMarkdown } from '@/shared/lib/markdown/render-post-markdown';
import styles from '@/shared/ui/post-content/post-content.module.css';

type Props = {
  attachmentPresignedUrls: PostDetailAttachmentPresignedUrlResponse[];
  className?: string;
  content: string;
};

export function PostContent({ attachmentPresignedUrls, className, content }: Props) {
  const html = renderPostMarkdown(content, attachmentPresignedUrls);

  return <div className={cn(styles.postContent, className)} dangerouslySetInnerHTML={{ __html: html }} />;
}
