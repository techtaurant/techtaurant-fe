'use client';

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
  return (
    <div>
      <h2 className="mb-3 px-1 text-sm font-semibold">카테고리</h2>
      <button
        type="button"
        aria-pressed={!categoryId}
        onClick={() => onChange(undefined)}
        className={cn(
          'block w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors',
          !categoryId ? 'bg-muted font-medium' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
        )}
      >
        전체 글
      </button>
      <ul className="mt-2 space-y-1">
        {toCategoryTree(categories).map((category) => (
          <PostCategoryFilterItem key={category.id} category={category} categoryId={categoryId} onChange={onChange} />
        ))}
      </ul>
    </div>
  );
}
