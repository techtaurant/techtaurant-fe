'use client';

import { useGetDraftList } from '@/entities/post-write';
import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/button';
import { PostWriteLastSavedLabel } from '@/views/post-write/ui/post-write-last-saved-label';

type Props = {
  isDraftSaving: boolean;
  lastSavedAt?: string;
  onDraftListOpenClick: () => void;
  onDraftSaveClick: () => void;
  onExitClick: () => void;
  onPublishClick: () => void;
};

export function PostWriteActions({
  isDraftSaving,
  lastSavedAt,
  onDraftListOpenClick,
  onDraftSaveClick,
  onExitClick,
  onPublishClick,
}: Props) {
  const { data: drafts = [], hasNextPage } = useGetDraftList();

  const draftCount = drafts.length;
  const draftCountLabel = hasNextPage ? `${draftCount}+` : `${draftCount}`;

  return (
    <div className={cn('flex w-full items-center justify-between gap-3')}>
      <Button className={cn('shrink-0 font-semibold')} onClick={onExitClick} size="lg" variant="neutral">
        나가기
      </Button>

      <div className={cn('flex shrink-0 items-center gap-3')}>
        {lastSavedAt && <PostWriteLastSavedLabel lastSavedAt={lastSavedAt} />}

        <div className="bg-button-neutral-surface inline-flex shrink-0 overflow-hidden rounded-lg">
          <Button
            className={cn('rounded-none font-semibold')}
            disabled={isDraftSaving}
            onClick={onDraftSaveClick}
            size="lg"
            variant="neutral"
          >
            {isDraftSaving ? '저장 중...' : '임시저장'}
          </Button>

          {draftCount > 0 && (
            <Button
              className={cn('border-muted-foreground/50 min-w-11 rounded-none border-l px-2.5 font-semibold')}
              onClick={onDraftListOpenClick}
              size="lg"
              variant="neutral"
              aria-label={`임시저장 목록 (${draftCountLabel}개)`}
            >
              {draftCountLabel}
            </Button>
          )}
        </div>

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
