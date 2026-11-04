import '@/shared/ui/post-content/post-content-highlight.css';

import { cn } from '@/shared/lib/cn';
import styles from '@/shared/ui/post-content/post-content.module.css';

type Props = {
  className?: string;
  content: string;
};

export function PostContent({ className, content }: Props) {
  return (
    <div
      data-post-content
      className={cn(styles.postContent, className)}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
