'use client';

import { useState } from 'react';

import type { CommentItem, CommentSort } from '@/entities/comment';
import { usePostDetailReplyComposer } from '@/features/post-comments/model/use-post-detail-reply-composer';
import { PostDetailCommentItem } from '@/features/post-comments/ui/post-detail-comment-item';
import { PostDetailCommentReplies } from '@/features/post-comments/ui/post-detail-comment-replies';
import { PostDetailReplyComposer } from '@/features/post-comments/ui/post-detail-reply-composer';
import { cn } from '@/shared/lib/cn';

type Props = {
  comments: CommentItem[];
  commentsSort: CommentSort;
  onRequireLogin: () => void;
  postAuthorId: string;
};

const REPLY_ACTION_LABEL = '답글 달기';
const HIDE_REPLIES_LABEL = '답글 접기';

export function PostDetailCommentList({ comments, commentsSort, onRequireLogin, postAuthorId }: Props) {
  const [replyThreadOpenByCommentId, setReplyThreadOpenByCommentId] = useState<Record<string, boolean>>({});
  const replyComposer = usePostDetailReplyComposer({
    onReplyCreated: (commentId) => {
      setReplyThreadOpenByCommentId((current) => ({
        ...current,
        [commentId]: true,
      }));
    },
    onRequireLogin,
  });

  const handleReplyThreadToggle = (commentId: string, isOpen: boolean) => {
    setReplyThreadOpenByCommentId((current) => ({
      ...current,
      [commentId]: !isOpen,
    }));
  };

  return comments.map((comment) => {
    const isReplyThreadOpen = replyThreadOpenByCommentId[comment.id] ?? comment.replyCount > 0;
    const isReplyingCurrentComment = replyComposer.isReplyingToComment(comment.id);

    return (
      <div key={comment.id} className="relative">
        {(isReplyingCurrentComment || isReplyThreadOpen) && (
          <span className="border-border/70 pointer-events-none absolute top-9.5 bottom-0 left-3.75 border-l" />
        )}
        <PostDetailCommentItem
          comment={comment}
          extraActions={
            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={replyComposer.isReplyButtonDisabled}
                className={cn(
                  'text-muted-foreground text-xs transition-colors',
                  'hover:text-foreground disabled:opacity-60',
                )}
                onClick={() => replyComposer.handleReplyButtonClick(comment.id, comment.postId)}
              >
                {REPLY_ACTION_LABEL}
              </button>
              {comment.replyCount > 0 && (
                <button
                  type="button"
                  className={cn('text-muted-foreground text-xs transition-colors', 'hover:text-foreground')}
                  onClick={() => handleReplyThreadToggle(comment.id, isReplyThreadOpen)}
                >
                  {isReplyThreadOpen ? HIDE_REPLIES_LABEL : `답글 ${comment.replyCount}개`}
                </button>
              )}
            </div>
          }
          onRequireLogin={onRequireLogin}
          postAuthorId={postAuthorId}
        >
          {isReplyingCurrentComment && (
            <PostDetailReplyComposer
              focusRequestKey={replyComposer.replyFocusRequestKey}
              isSubmitting={replyComposer.isReplySubmitting}
              value={replyComposer.replyValue}
              onCancelButtonClick={replyComposer.cancelReply}
              onChange={replyComposer.handleReplyValueChange}
              onSubmitButtonClick={replyComposer.handleCreateReply}
            />
          )}
          {isReplyThreadOpen && (
            <PostDetailCommentReplies
              commentsSort={commentsSort}
              onRequireLogin={onRequireLogin}
              parentCommentId={comment.id}
              postAuthorId={postAuthorId}
            />
          )}
        </PostDetailCommentItem>
      </div>
    );
  });
}
