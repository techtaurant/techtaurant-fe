'use client';

import type { CommentSort } from '@/entities/comment';
import { usePostDetailReplyList } from '@/features/post-comments/model/use-post-detail-reply-list';
import { PostDetailCommentItem } from '@/features/post-comments/ui/post-detail-comment-item';
import { cn } from '@/shared/lib/cn';

type Props = {
  commentsSort: CommentSort;
  onRequireLogin: () => void;
  parentCommentId: string;
  postAuthorId: string;
};

const REPLIES_LOADING_MESSAGE = '답글을 불러오는 중입니다.';
const REPLIES_ERROR_MESSAGE = '답글을 불러오지 못했습니다.';
const LOAD_MORE_REPLIES_LABEL = '답글 더보기';
const LOAD_MORE_REPLIES_LOADING_LABEL = '불러오는 중';

export function PostDetailCommentReplies({ commentsSort, onRequireLogin, parentCommentId, postAuthorId }: Props) {
  const replyList = usePostDetailReplyList({
    commentsSort,
    parentCommentId,
  });
  const hasReplies = replyList.replies.length > 0;
  const shouldShowRepliesLoading = replyList.isRepliesLoading && !hasReplies;
  const shouldShowRepliesError = !replyList.isRepliesLoading && replyList.isRepliesError && !hasReplies;

  return (
    <div className="mt-3 space-y-3">
      {shouldShowRepliesLoading && <p className="text-muted-foreground py-1 text-xs">{REPLIES_LOADING_MESSAGE}</p>}
      {shouldShowRepliesError && <p className="text-muted-foreground py-1 text-xs">{REPLIES_ERROR_MESSAGE}</p>}
      {hasReplies &&
        replyList.replies.map((reply, index) => (
          <div key={reply.id} className="relative">
            {index === replyList.replies.length - 1 && (
              <span className="bg-background pointer-events-none absolute top-0 bottom-0 -left-7 z-10 w-1.5" />
            )}
            <span className="border-border/70 pointer-events-none absolute top-0 -left-6.75 z-20 h-3.5 w-5.75 rounded-bl-2xl border-b border-l" />
            <PostDetailCommentItem
              comment={reply}
              onRequireLogin={onRequireLogin}
              postAuthorId={postAuthorId}
              variant="compact"
            />
          </div>
        ))}
      {replyList.repliesHasNext && (
        <div className="relative">
          {hasReplies && (
            <span className="bg-background pointer-events-none absolute -top-3 bottom-0 -left-7 z-10 w-1.5" />
          )}
          <button
            type="button"
            disabled={replyList.isRepliesLoadingMore}
            className={cn(
              'border-border text-muted-foreground rounded-full border px-3 py-1.5 text-xs font-medium transition-colors duration-200',
              'hover:bg-muted/85 hover:text-foreground disabled:opacity-60',
            )}
            onClick={replyList.handleLoadMoreReplies}
          >
            {replyList.isRepliesLoadingMore ? LOAD_MORE_REPLIES_LOADING_LABEL : LOAD_MORE_REPLIES_LABEL}
          </button>
        </div>
      )}
    </div>
  );
}
