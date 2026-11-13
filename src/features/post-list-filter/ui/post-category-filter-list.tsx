'use client';

import { useEffect, useRef } from 'react';

import type { CategoryResponse } from '@/entities/category';
import { toCategoryTree } from '@/entities/category';
import { PostCategoryFilterItem } from '@/features/post-list-filter/ui/post-category-filter-item';
import { cn } from '@/shared/lib/cn';

type Props = {
  categories: CategoryResponse[];
  categoryId?: string;
  onChange: (categoryId?: string) => void;
};

export function PostCategoryFilterList({ categories, categoryId, onChange }: Props) {
  const listRef = useRef<HTMLDivElement>(null);
  const selectedCategory = categories.find((category) => category.id === categoryId);
  const selectedCategoryId = selectedCategory?.id;

  useEffect(() => {
    if (!selectedCategoryId) return;

    const frameId = requestAnimationFrame(() => {
      const selectedButton = listRef.current?.querySelector<HTMLButtonElement>('button[aria-pressed="true"]');
      if (!selectedButton || selectedButton.getClientRects().length === 0) return;

      selectedButton.focus({ preventScroll: true });
      selectedButton.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    });

    return () => cancelAnimationFrame(frameId);
  }, [selectedCategoryId]);

  return (
    <div ref={listRef}>
      <h2 className="mb-3 px-1 text-sm font-semibold">카테고리</h2>
      <button
        type="button"
        aria-pressed={!categoryId}
        onClick={() => onChange(undefined)}
        className={cn(
          'focus-visible:bg-primary/10 block w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors focus-visible:outline-none',
          !categoryId ? 'bg-primary/10 text-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
        )}
      >
        전체 글
      </button>
      <ul key={categoryId} className="mt-2 space-y-1">
        {toCategoryTree(categories).map((category) => (
          <PostCategoryFilterItem
            key={category.id}
            category={category}
            selectedCategory={selectedCategory}
            onChange={onChange}
          />
        ))}
      </ul>
    </div>
  );
}
