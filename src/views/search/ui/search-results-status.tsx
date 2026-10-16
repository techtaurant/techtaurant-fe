import type { ReactNode } from 'react';

import { Button } from '@/shared/ui/button';

type Props = {
  children: ReactNode;
  isError: boolean;
  isLoading: boolean;
  isEmpty: boolean;
  onRetry: () => void;
};

export function SearchResultsStatus({ children, isError, isLoading, isEmpty, onRetry }: Props) {
  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 py-20">
        <p className="text-muted-foreground text-sm">검색 결과를 불러오지 못했습니다.</p>
        <Button onClick={onRetry}>다시 시도</Button>
      </div>
    );
  }

  if (isLoading) {
    return <p className="text-muted-foreground py-20 text-center text-sm">검색 결과를 불러오는 중입니다.</p>;
  }

  if (isEmpty) {
    return <p className="text-muted-foreground py-20 text-center text-sm">검색 결과가 없습니다.</p>;
  }

  return children;
}
