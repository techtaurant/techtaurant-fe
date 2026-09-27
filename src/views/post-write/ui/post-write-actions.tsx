'use client';

import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/button';
import { PostWriteLastSavedLabel } from '@/views/post-write/ui/post-write-last-saved-label';

type Props = {
  isDraftSaving: boolean;
  lastSavedAt?: string;
  onDraftSaveClick: () => void;
  onExitClick: () => void;
  onPublishClick: () => void;
};

export function PostWriteActions({ isDraftSaving, lastSavedAt, onDraftSaveClick, onExitClick, onPublishClick }: Props) {
  return (
    <div className={cn('flex w-full items-center justify-between gap-3')}>
      <Button className={cn('shrink-0 font-semibold')} onClick={onExitClick} size="lg" variant="neutral">
        나가기
      </Button>

      <div className={cn('flex shrink-0 items-center gap-3')}>
        {lastSavedAt && <PostWriteLastSavedLabel lastSavedAt={lastSavedAt} />}

        <Button
          className={cn('shrink-0 font-semibold')}
          disabled={isDraftSaving}
          onClick={onDraftSaveClick}
          size="lg"
          variant="neutral"
        >
          {isDraftSaving ? '저장 중...' : '임시저장'}
        </Button>

        <Button
          className={cn('shrink-0 font-semibold')}
          disabled={isDraftSaving}
          onClick={onPublishClick}
          size="lg"
          variant="primarySurface"
        >
          발행하기
        </Button>
      </div>
    </div>
  );
}
