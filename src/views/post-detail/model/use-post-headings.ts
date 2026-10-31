'use client';

import type { RefObject } from 'react';
import { useEffect, useState } from 'react';

export type PostHeading = {
  id: string;
  text: string;
  level: number;
};

const slugifyHeadingText = (text: string) => {
  return (
    text
      .toLowerCase()
      .replace(/[_\s]+/g, '-')
      .replace(/[^\p{L}\p{N}-]/gu, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || 'heading'
  );
};

const readPostHeadings = (content: HTMLElement): PostHeading[] => {
  const usedIds = new Set<string>();

  return Array.from(content.querySelectorAll<HTMLElement>('h1, h2, h3')).flatMap((element) => {
    const text = element.textContent?.replace(/\s+/g, ' ').trim();
    if (!text) return [];

    const slug = slugifyHeadingText(text);
    let id = slug;
    let suffix = 2;
    while (usedIds.has(id)) id = `${slug}-${suffix++}`;
    usedIds.add(id);

    element.id = id;
    return [{ id, text, level: Number(element.tagName.slice(1)) }];
  });
};

type Params = {
  contentRef: RefObject<HTMLDivElement | null>;
};

export const usePostHeadings = ({ contentRef }: Params) => {
  const [headings, setHeadings] = useState<PostHeading[]>([]);

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const frameId = requestAnimationFrame(() => setHeadings(readPostHeadings(content)));
    return () => cancelAnimationFrame(frameId);
  }, [contentRef]);

  useEffect(() => {
    const heading = headings.find(({ id }) => `#${encodeURIComponent(id)}` === window.location.hash);
    if (!heading) return;

    document.getElementById(heading.id)?.scrollIntoView();
  }, [headings]);

  return headings;
};
