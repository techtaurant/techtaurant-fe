'use client';

import type { KeyboardEvent } from 'react';
import { useId } from 'react';

import { useSearchCategories } from '@/entities/category';
import { useGetMe } from '@/entities/user';
import { cn } from '@/shared/lib/cn';
import { useDebouncedValue } from '@/shared/lib/use-debounced-value';
import {
  POST_WRITE_SUGGESTION_MAX_COUNT,
  POST_WRITE_SUGGESTION_SEARCH_DEBOUNCE_MS,
} from '@/views/post-write/config/constants';
import { getSuggestionHighlight } from '@/views/post-write/lib/get-suggestion-highlight';
import { useSuggestionDropdown } from '@/views/post-write/model/use-suggestion-dropdown';
import { PostWriteSuggestionList } from '@/views/post-write/ui/post-write-suggestion-list';

const MAX_CATEGORY_DEPTH = 5;

type Props = {
  categoryPath: string;
  onCategoryPathChange: (categoryPath: string) => void;
};

export function PostWriteCategoryField({ categoryPath, onCategoryPathChange }: Props) {
  const inputId = useId();

  const trimmedCategoryPath = categoryPath.trim();

  const { data: me } = useGetMe();
  const debouncedCategoryPath = useDebouncedValue({
    delayMs: POST_WRITE_SUGGESTION_SEARCH_DEBOUNCE_MS,
    value: trimmedCategoryPath,
  });
  const { activeIndex, closeSuggestions, handleNavigationKeyDown, isOpen, openSuggestions } = useSuggestionDropdown();

  const { data: searchedCategories } = useSearchCategories({
    enabled: isOpen,
    path: debouncedCategoryPath,
    userId: me?.id,
  });

  const suggestedPaths = (searchedCategories ?? []).map(({ path }) => path).slice(0, POST_WRITE_SUGGESTION_MAX_COUNT);
  const isSuggestionVisible = isOpen && suggestedPaths.length > 0;
  const { activeSuggestionIndex, highlightedSuggestionIndex } = getSuggestionHighlight({
    activeIndex,
    isVisible: isSuggestionVisible,
    query: trimmedCategoryPath,
    suggestions: suggestedPaths,
  });
  const isDepthExceeded = categoryPath.split('/').filter(Boolean).length > MAX_CATEGORY_DEPTH;

  const applySuggestion = (path: string) => {
    onCategoryPathChange(path);
    closeSuggestions();
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.isComposing) return;
    if (handleNavigationKeyDown(event, suggestedPaths.length)) return;
    if (event.key !== 'Enter') return;

    event.preventDefault();

    if (activeSuggestionIndex < 0) {
      closeSuggestions();
      return;
    }

    applySuggestion(suggestedPaths[activeSuggestionIndex]);
  };

  return (
    <div className="relative">
      <label htmlFor={inputId} className="text-muted-foreground mb-3 block text-sm font-semibold tracking-[0.18em]">
        카테고리 <span className="text-form-error-foreground">*</span>
      </label>

      <input
        autoComplete="off"
        className={cn(
          'text-foreground w-full bg-transparent px-0 py-0 text-base font-bold transition-colors duration-200',
          'placeholder:text-muted-foreground placeholder:font-normal focus:outline-none',
        )}
        id={inputId}
        onBlur={closeSuggestions}
        onChange={(event) => {
          onCategoryPathChange(event.target.value);
          openSuggestions();
        }}
        onFocus={openSuggestions}
        onKeyDown={handleInputKeyDown}
        placeholder="카테고리를 입력해주세요 (예: frontend/typescript)"
        type="text"
        value={categoryPath}
      />

      {isDepthExceeded && (
        <p className="text-form-error-foreground mt-2 text-sm font-medium">
          카테고리는 최대 {MAX_CATEGORY_DEPTH}단계까지 지정할 수 있어요.
        </p>
      )}

      {isSuggestionVisible && (
        <PostWriteSuggestionList
          highlightedIndex={highlightedSuggestionIndex}
          onSuggestionSelect={applySuggestion}
          suggestions={suggestedPaths}
        />
      )}
    </div>
  );
}
