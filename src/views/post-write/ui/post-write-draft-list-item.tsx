'use client';

import Link from 'next/link';

import type { DraftListItemResponse } from '@/shared/api/generated';
import { cn } from '@/shared/lib/cn';
import { formatDisplayTime } from '@/shared/lib/format-date';
import { Button, buttonVariants } from '@/shared/ui/button';
import { useOpenPostWriteDraftDeleteConfirmModal } from '@/views/post-write/lib/use-open-post-write-draft-delete-confirm-modal';
import { DRAFT_ID_SEARCH_PARAM_KEY } from '@/views/post-write/model/use-draft-id-search-param';

type Props = {
  draft: DraftListItemResponse;
};

const POST_WRITE_PATH = '/write';
const UNTITLED_DRAFT_LABEL = '(제목 없음)';

export function PostWriteDraftListItem({ draft }: Props) {
  const openPostWriteDraftDeleteConfirmModal = useOpenPostWriteDraftDeleteConfirmModal();

  const draftEditSearchParams = new URLSearchParams({ [DRAFT_ID_SEARCH_PARAM_KEY]: draft.id });

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
      <Link
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'h-auto min-w-0 flex-1 flex-col items-start gap-1.5 px-1 py-0.5 text-left',
          'hover:bg-transparent',
        )}
        href={`${POST_WRITE_PATH}?${draftEditSearchParams.toString()}`}
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
      </Link>

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
