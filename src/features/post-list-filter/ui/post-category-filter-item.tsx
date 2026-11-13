'use client';

import { ChevronDown, ChevronUp, Folder, FolderOpen } from 'lucide-react';
import { useState } from 'react';

import type { CategoryResponse, CategoryTreeNode } from '@/entities/category';
import { cn } from '@/shared/lib/cn';
import { Badge } from '@/shared/ui/badge';

type Props = {
  category: CategoryTreeNode;
  selectedCategory?: CategoryResponse;
  onChange: (categoryId?: string) => void;
};

export function PostCategoryFilterItem({ category, selectedCategory, onChange }: Props) {
  const isSelected = selectedCategory?.id === category.id;
  const isOnSelectedPath = isSelected || !!selectedCategory?.path.startsWith(`${category.path}/`);
  const [isExpanded, setIsExpanded] = useState(isOnSelectedPath);
  const hasChildren = category.children.length > 0;
  const FolderIcon = isExpanded || isSelected ? FolderOpen : Folder;
  const ChevronIcon = isExpanded ? ChevronUp : ChevronDown;

  return (
    <li>
      <div
        className={cn(
          'flex items-center rounded-md pr-2 text-sm transition-colors',
          isSelected
            ? 'bg-muted font-bold text-blue-500'
            : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground',
        )}
        style={{ paddingLeft: 10 + (category.depth - 1) * 16 }}
      >
        <button
          type="button"
          aria-pressed={isSelected}
          className="flex min-w-0 flex-1 items-center gap-2 py-2 text-left"
          onClick={() => {
            onChange(category.id);
            if (hasChildren) setIsExpanded(!isExpanded);
          }}
        >
          <FolderIcon className="text-muted-foreground size-4 shrink-0" />
          <span className="truncate" title={category.name}>
            {category.name}
          </span>
          <Badge className="bg-background text-muted-foreground ml-1 min-w-5 shrink-0 justify-center px-1.5 font-normal">
            {category.postCount}
          </Badge>
        </button>
        {hasChildren && (
          <button
            type="button"
            aria-label={`${category.name} 하위 카테고리 ${isExpanded ? '접기' : '펼치기'}`}
            aria-expanded={isExpanded}
            className="bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground ml-2 inline-flex size-4 shrink-0 items-center justify-center rounded-full transition-colors"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <ChevronIcon className="size-3.5" />
          </button>
        )}
      </div>
      {isExpanded && (
        <ul className="mt-1 space-y-1">
          {category.children.map((child) => (
            <PostCategoryFilterItem
              key={child.id}
              category={child}
              selectedCategory={selectedCategory}
              onChange={onChange}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
