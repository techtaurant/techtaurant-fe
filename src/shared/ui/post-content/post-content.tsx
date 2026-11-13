'use client';

import 'katex/dist/katex.min.css';
import '@/shared/ui/post-content/post-content-highlight.css';

import { useTheme } from 'next-themes';
import { useEffect, useRef } from 'react';

import { cn } from '@/shared/lib/cn';
import styles from '@/shared/ui/post-content/post-content.module.css';
import { renderPostDiagrams } from '@/shared/ui/post-content/render-post-diagrams';
import { renderPostMath } from '@/shared/ui/post-content/render-post-math';

type Props = {
  className?: string;
  content: string;
};

export function PostContent({ className, content }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    container.innerHTML = content;

    // 로딩 실패 시에도 정제된 원문을 읽을 수 있게 유지한다.
    void Promise.allSettled([
      renderPostMath(container, () => cancelled),
      renderPostDiagrams(container, resolvedTheme === 'dark', () => cancelled),
    ]);

    return () => {
      cancelled = true;
    };
  }, [content, resolvedTheme]);

  return (
    <div
      ref={containerRef}
      data-post-content
      className={cn(styles.postContent, className)}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
