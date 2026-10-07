'use client';

import type { CategoryResponse } from '@/entities/category';

type Props = {
  categories: CategoryResponse[];
  categoryId?: string;
  onChange: (categoryId?: string) => void;
};

export function PostCategoryFilterSelect({ categories, categoryId, onChange }: Props) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium">카테고리</span>
      <select
        value={categoryId ?? ''}
        onChange={(event) => onChange(event.target.value || undefined)}
        className="border-border bg-background w-full rounded-md border px-3 py-2"
      >
        <option value="">전체 글</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
    </label>
  );
}
