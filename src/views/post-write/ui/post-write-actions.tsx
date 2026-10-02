'use client';

import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/button';
import { PostWriteDraftActions } from '@/views/post-write/ui/post-write-draft-actions';

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
  return (
    <div className={cn('flex w-full items-center justify-between gap-3')}>
      <Button className={cn('shrink-0 font-semibold')} onClick={onExitClick} size="lg" variant="neutral">
        나가기
      </Button>

      <div className={cn('flex shrink-0 items-center gap-3')}>
        <PostWriteDraftActions
          isDraftSaving={isDraftSaving}
          lastSavedAt={lastSavedAt}
          onDraftListOpenClick={onDraftListOpenClick}
          onDraftSaveClick={onDraftSaveClick}
        />

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
