'use client';

import { useRouter } from 'next/navigation';
import { type KeyboardEvent, type SyntheticEvent, useState } from 'react';

import { useSearchKeyword } from '@/features/post-search/model/use-search-keyword';
import { cn } from '@/shared/lib/cn';
import { SearchInput } from '@/shared/ui/search-input';

type Props = {
  variant?: 'header' | 'page';
};

export function PostSearchForm({ variant = 'page' }: Props) {
  const router = useRouter();
  const keyword = useSearchKeyword();
  const [value, setValue] = useState(keyword);
  const isHeader = variant === 'header';

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    event.preventDefault();
    const query = value.trim();

    if (!query) return;

    router.push(`/search?query=${encodeURIComponent(query)}`);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && event.nativeEvent.isComposing) event.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className={isHeader ? 'mx-8 hidden w-full max-w-150 md:block' : 'mb-6'}>
      <SearchInput
        name="query"
        placeholder={isHeader ? '검색' : '검색어를 입력하세요'}
        value={value}
        onValueChange={setValue}
        hasClearButton={false}
        minLength={2}
        maxLength={100}
        required
        onKeyDown={handleKeyDown}
        className={cn(
          'bg-muted w-full focus-within:ring-2 focus-within:ring-current/20 focus-within:ring-inset',
          isHeader
            ? 'h-9 rounded-lg px-3 [&>svg]:mr-2 [&>svg]:size-5'
            : 'h-11 rounded-full px-4 [&>svg]:mr-2 [&>svg]:size-5',
        )}
      />
    </form>
  );
}
