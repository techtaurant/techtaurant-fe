'use client';

import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/button';

type Props = {
  isPostEditing: boolean;
  onExitClick: () => void;
  onPostEditClick: () => void;
};

export function PostWriteEditActions({ isPostEditing, onExitClick, onPostEditClick }: Props) {
  return (
    <div className={cn('flex w-full items-center justify-between gap-3')}>
      <Button className={cn('shrink-0 font-semibold')} onClick={onExitClick} size="lg" variant="neutral">
        나가기
      </Button>

      <Button
        className={cn('shrink-0 font-semibold')}
        disabled={isPostEditing}
        onClick={onPostEditClick}
        size="lg"
        variant="primarySurface"
      >
        {isPostEditing ? '수정 중...' : '수정하기'}
      </Button>
    </div>
  );
}
