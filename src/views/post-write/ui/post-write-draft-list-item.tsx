'use client';

import type { DraftListItemResponse } from '@/shared/api/generated';
import { cn } from '@/shared/lib/cn';
import { formatDisplayTime } from '@/shared/lib/format-date';
import { Button } from '@/shared/ui/button';
import { useOpenPostWriteDraftDeleteConfirmModal } from '@/views/post-write/lib/use-open-post-write-draft-delete-confirm-modal';

type Props = {
  draft: DraftListItemResponse;
  onSelectClick: () => void;
};

const UNTITLED_DRAFT_LABEL = '(제목 없음)';

export function PostWriteDraftListItem({ draft, onSelectClick }: Props) {
  const openPostWriteDraftDeleteConfirmModal = useOpenPostWriteDraftDeleteConfirmModal();

  const handleDeleteButtonClick = () => {
    openPostWriteDraftDeleteConfirmModal(draft.id);
  };

  return (
    <li
      className={cn(
        'border-border bg-background flex items-start gap-3 rounded-xl border p-4 transition-colors',
        'hover:bg-muted/50',
      )}
    >
      <Button
        className={cn(
          'h-auto min-w-0 flex-1 flex-col items-start gap-1.5 px-1 py-0.5 text-left',
          'hover:bg-transparent',
        )}
        onClick={onSelectClick}
        variant="ghost"
      >
        <span className="text-foreground w-full truncate text-base font-semibold">
          {draft.title || UNTITLED_DRAFT_LABEL}
        </span>
        {draft.contentPreview && (
          <span className="text-muted-foreground line-clamp-2 w-full text-sm font-normal whitespace-normal">
            {draft.contentPreview}
          </span>
        )}
        <time className="text-muted-foreground text-xs font-normal" dateTime={draft.updatedAt}>
          {formatDisplayTime(draft.updatedAt)}
        </time>
      </Button>

      <Button
        className={cn(
          'bg-form-error-border/15 text-form-error-foreground shrink-0',
          'hover:bg-form-error-border/25 hover:text-form-error-foreground',
        )}
        onClick={handleDeleteButtonClick}
        size="sm"
        variant="ghost"
      >
        삭제
      </Button>
    </li>
  );
}
