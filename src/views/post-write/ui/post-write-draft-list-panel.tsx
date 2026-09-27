'use client';

import { X } from 'lucide-react';

import { useGetDraftList } from '@/entities/post-write';
import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/button';
import { Observer } from '@/shared/ui/intersection-observer';
import { PostWriteDraftListItem } from '@/views/post-write/ui/post-write-draft-list-item';
import { Header } from '@/widgets/header';

type Props = {
  onCloseClick: () => void;
  onSelectDraft: (draftId: string) => void;
};

const DRAFT_LIST_TITLE = '내 임시저장 목록';
const DRAFT_LIST_EMPTY_MESSAGE = '임시저장한 글이 없어요.';
const DRAFT_LIST_LOAD_FAILED_MESSAGE = '임시저장 목록을 불러오지 못했어요.';
const CLOSE_BUTTON_LABEL = '닫기';

export function PostWriteDraftListPanel({ onCloseClick, onSelectDraft }: Props) {
  const { data: drafts = [], fetchNextPage, hasNextPage, isError, isFetchingNextPage, isPending } = useGetDraftList();

  const hasKnownDrafts = drafts.length > 0;
  const shouldShowLoadFailedState = isError && !hasKnownDrafts;
  const shouldShowEmptyState = !isPending && !isError && !hasKnownDrafts;
  const draftCountLabel = hasNextPage ? `${drafts.length}+` : `${drafts.length}`;

  const handleObserverEnter = () => {
    if (!hasNextPage || isFetchingNextPage) return;

    fetchNextPage();
  };

  return (
    <div className={cn('bg-background absolute inset-0 z-10 flex flex-col pt-16')}>
      <Header />

      <div className={cn('min-h-0 flex-1 overflow-y-auto')}>
        <div className={cn('mx-auto w-full max-w-3xl px-6 py-8', 'md:py-10')}>
          <div className="mb-6 flex items-center justify-between gap-3 pl-4">
            <h2 className="text-foreground flex items-baseline gap-2 text-2xl font-bold">
              {DRAFT_LIST_TITLE}
              {hasKnownDrafts && (
                <span className="text-muted-foreground text-base font-medium">총 {draftCountLabel}개</span>
              )}
            </h2>
            <Button
              aria-label={CLOSE_BUTTON_LABEL}
              className="h-10 w-10 rounded-full px-0"
              onClick={onCloseClick}
              size="sm"
              variant="icon"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          {(shouldShowLoadFailedState || shouldShowEmptyState) && (
            <p className="border-border text-muted-foreground rounded-xl border border-dashed py-16 text-center text-sm">
              {shouldShowLoadFailedState ? DRAFT_LIST_LOAD_FAILED_MESSAGE : DRAFT_LIST_EMPTY_MESSAGE}
            </p>
          )}

          <ul className="flex flex-col gap-3">
            {drafts.map((draft) => (
              <PostWriteDraftListItem key={draft.id} draft={draft} onSelectClick={() => onSelectDraft(draft.id)} />
            ))}
          </ul>

          {hasNextPage && <Observer onEnter={handleObserverEnter} />}
        </div>
      </div>
    </div>
  );
}
