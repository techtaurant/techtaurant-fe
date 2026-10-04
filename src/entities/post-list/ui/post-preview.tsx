import { cn } from '@/shared/lib/cn';
import { extractPostPlainText } from '@/shared/lib/markdown/extract-post-plain-text';

type Props = {
  title: string;
  content: string;
};

export function PostPreview({ title, content }: Props) {
  const previewText = extractPostPlainText(content);

  return (
    <>
      <h2 className={cn('mb-2 line-clamp-2 block text-lg font-bold', 'md:mb-3 md:text-xl')}>{title}</h2>
      <p
        className={cn(
          'text-muted-foreground mb-3 line-clamp-2 text-sm leading-relaxed whitespace-normal',
          'md:line-clamp-3 md:text-base',
        )}
      >
        {previewText}
      </p>
    </>
  );
}
