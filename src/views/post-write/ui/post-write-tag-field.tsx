'use client';

import type { KeyboardEvent } from 'react';
import { useId, useRef, useState } from 'react';

import { useGetTags } from '@/entities/tag';
import { cn } from '@/shared/lib/cn';
import { useDebouncedValue } from '@/shared/lib/use-debounced-value';
import { Button } from '@/shared/ui/button';
import {
  POST_WRITE_SUGGESTION_MAX_COUNT,
  POST_WRITE_SUGGESTION_SEARCH_DEBOUNCE_MS,
} from '@/views/post-write/config/constants';
import { getSuggestionHighlight } from '@/views/post-write/lib/get-suggestion-highlight';
import { useSuggestionDropdown } from '@/views/post-write/model/use-suggestion-dropdown';
import { PostWriteSuggestionList } from '@/views/post-write/ui/post-write-suggestion-list';

const MAX_TAG_COUNT = 10;

type Props = {
  onTagsChange: (tags: string[]) => void;
  tags: string[];
};

export function PostWriteTagField({ onTagsChange, tags }: Props) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [draftTagName, setDraftTagName] = useState('');

  const trimmedTagName = draftTagName.trim();
  const debouncedTagName = useDebouncedValue({
    delayMs: POST_WRITE_SUGGESTION_SEARCH_DEBOUNCE_MS,
    value: trimmedTagName,
  });
  const isTagLimitReached = tags.length >= MAX_TAG_COUNT;

  const { activeIndex, closeSuggestions, handleNavigationKeyDown, isOpen, openSuggestions } = useSuggestionDropdown({
    onDismiss: () => setDraftTagName(''),
  });

  const { data: searchedTags } = useGetTags({
    enabled: isOpen && !isTagLimitReached,
    params: {
      size: POST_WRITE_SUGGESTION_MAX_COUNT,
      ...(debouncedTagName.length > 0 && { name: debouncedTagName }),
    },
  });

  const suggestedTagNames = (searchedTags ?? []).map(({ name }) => name).filter((name) => !tags.includes(name));
  const isSuggestionVisible = isOpen && suggestedTagNames.length > 0 && !isTagLimitReached;
  const { activeSuggestionIndex, highlightedSuggestionIndex } = getSuggestionHighlight({
    activeIndex,
    isVisible: isSuggestionVisible,
    query: trimmedTagName,
    suggestions: suggestedTagNames,
  });

  const addTag = (name: string) => {
    const trimmedName = name.trim();
    if (!trimmedName || tags.includes(trimmedName)) return;

    onTagsChange([...tags, trimmedName]);
    setDraftTagName('');
  };

  const handleInputBlur = () => {
    addTag(draftTagName);
    closeSuggestions();
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.isComposing) return;
    if (handleNavigationKeyDown(event, suggestedTagNames.length)) return;
    if (event.key !== 'Enter') return;

    event.preventDefault();
    addTag(activeSuggestionIndex >= 0 ? suggestedTagNames[activeSuggestionIndex] : draftTagName);
  };

  const handleTagRemoveClick = (name: string) => {
    onTagsChange(tags.filter((tag) => tag !== name));
  };

  return (
    <div className="relative">
      <label htmlFor={inputId} className="text-muted-foreground mb-3 block text-sm font-semibold tracking-[0.18em]">
        태그
      </label>

      <div className="flex cursor-text flex-wrap items-center gap-2" onClick={() => inputRef.current?.focus()}>
        {tags.map((name) => (
          <span
            key={name}
            className="bg-muted text-foreground inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm"
          >
            {name}
            <Button
              aria-label={`${name} 태그 삭제`}
              className="text-muted-foreground hover:text-foreground h-auto w-auto p-0 text-lg"
              onClick={() => handleTagRemoveClick(name)}
              onMouseDown={(event) => event.preventDefault()}
              size="sm"
              variant="icon"
            >
              ×
            </Button>
          </span>
        ))}

        <input
          ref={inputRef}
          autoComplete="off"
          className={cn(
            'text-foreground min-w-45 flex-1 bg-transparent px-0 py-0 text-base',
            'placeholder:text-muted-foreground focus:outline-none',
          )}
          disabled={isTagLimitReached}
          id={inputId}
          onBlur={handleInputBlur}
          onChange={(event) => {
            setDraftTagName(event.target.value);
            openSuggestions();
          }}
          onFocus={openSuggestions}
          onKeyDown={handleInputKeyDown}
          placeholder={tags.length === 0 ? '태그를 입력하고 Enter를 눌러주세요 (예: typescript)' : ''}
          type="text"
          value={draftTagName}
        />
      </div>

      {isTagLimitReached && (
        <p className="text-muted-foreground mt-2 text-sm font-medium">
          태그는 최대 {MAX_TAG_COUNT}개까지 추가할 수 있어요.
        </p>
      )}

      {isSuggestionVisible && (
        <PostWriteSuggestionList
          highlightedIndex={highlightedSuggestionIndex}
          onSuggestionSelect={addTag}
          suggestions={suggestedTagNames}
        />
      )}
    </div>
  );
}
