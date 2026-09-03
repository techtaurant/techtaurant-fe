'use client';

import { ThumbsDown, ThumbsUp } from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';

import type { CommentItem } from '@/entities/comment';
import { COMMENT_LIKE_STATUS } from '@/entities/comment';
import { useGetMe, UserAvatar } from '@/entities/user';
import { useOpenCommentAuthorBlockConfirmModal } from '@/features/post-comments/lib/use-open-comment-author-block-confirm-modal';
import { useOpenCommentDeleteConfirmModal } from '@/features/post-comments/lib/use-open-comment-delete-confirm-modal';
import { useCommentReaction } from '@/features/post-comments/model/use-comment-reaction';
import { PostDetailCommentActions } from '@/features/post-comments/ui/post-detail-comment-actions';
import { PostDetailCommentEditor } from '@/features/post-comments/ui/post-detail-comment-editor';
import { cn } from '@/shared/lib/cn';
import { formatDisplayTime } from '@/shared/lib/format-date';

type Props = {
  children?: ReactNode;
  comment: CommentItem;
  extraActions?: ReactNode;
  onRequireLogin: () => void;
  postAuthorId: string;
  variant?: 'compact' | 'default';
};

const DELETED_COMMENT_MESSAGE = '삭제된 댓글입니다.';
const BANNED_COMMENT_AUTHOR_NAME = '차단한 사용자';
const BANNED_COMMENT_CONTENT = '차단한 사용자의 댓글입니다.';

export function PostDetailCommentItem({
  children,
  comment,
  extraActions,
  onRequireLogin,
  postAuthorId,
  variant = 'default',
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const { data: me } = useGetMe();
  const commentReaction = useCommentReaction({ comment, onRequireLogin });
  const openCommentAuthorBlockConfirmModal = useOpenCommentAuthorBlockConfirmModal();
  const openCommentDeleteConfirmModal = useOpenCommentDeleteConfirmModal({ postId: comment.postId });
  const currentUserId = me?.id;
  const isBanned = comment.isBanned;
  const isOwnComment = !!currentUserId && currentUserId === comment.authorId;
  const isPostAuthor = postAuthorId === comment.authorId;
  const shouldShowInteractionRow = !comment.isDeleted && !isBanned;
  const shouldShowCommentActions = shouldShowInteractionRow && !!currentUserId && !isEditing;
  const authorName = isBanned ? BANNED_COMMENT_AUTHOR_NAME : comment.authorName;
  const profileImageUrl = isBanned ? '' : (comment.authorProfileImageUrl ?? '');
  const commentContent = getCommentContent(comment);
  const isCompact = variant === 'compact';

  const handleEditComment = () => {
    setIsEditing(true);
  };

  const handleCloseCommentEditor = () => {
    setIsEditing(false);
  };

  return (
    <div className={cn('flex', isCompact ? 'gap-2.5' : 'gap-3')}>
      <UserAvatar
        name={authorName}
        profileImageUrl={profileImageUrl}
        className={cn('z-30 shrink-0', isCompact ? 'h-7 w-7' : 'h-7.5 w-7.5')}
      />

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center justify-between gap-2">
          <div className="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1">
            <span className={cn('text-foreground font-semibold', isCompact ? 'text-xs' : 'text-sm')}>{authorName}</span>
            {isPostAuthor && (
              <span className="bg-comment-author-badge-background text-comment-author-badge-foreground inline-flex items-center rounded-full px-2 py-0.5 text-[11px] leading-4 font-semibold">
                작성자
              </span>
            )}
            <span className={cn('text-muted-foreground', isCompact ? 'text-[11px]' : 'text-xs')}>
              {formatDisplayTime(comment.createdAt)}
            </span>
          </div>
          {shouldShowCommentActions && (
            <PostDetailCommentActions
              comment={comment}
              isOwnComment={isOwnComment}
              onBlockCommentAuthor={openCommentAuthorBlockConfirmModal}
              onDeleteComment={openCommentDeleteConfirmModal}
              onEditComment={handleEditComment}
            />
          )}
        </div>

        {isEditing ? (
          <PostDetailCommentEditor
            comment={comment}
            onCancelEdit={handleCloseCommentEditor}
            onEditSuccess={handleCloseCommentEditor}
          />
        ) : (
          <p
            className={cn(
              'text-foreground wrap-break-words mb-2 leading-relaxed whitespace-pre-wrap',
              isCompact ? 'text-xs' : 'text-sm',
            )}
          >
            {commentContent}
          </p>
        )}

        {shouldShowInteractionRow && !isEditing && (
          <div className="flex items-center gap-4">
            <div className="text-muted-foreground inline-flex items-center gap-1 text-xs">
              <button
                type="button"
                className={cn(
                  'hover:text-foreground rounded-full p-1 transition-colors disabled:opacity-60',
                  comment.likeStatus === COMMENT_LIKE_STATUS.LIKE &&
                    'text-button-danger-surface hover:text-button-danger-surface',
                )}
                disabled={commentReaction.isPending}
                onClick={commentReaction.handleLikeComment}
              >
                <ThumbsUp className={cn(isCompact ? 'h-3 w-3' : 'h-3.5 w-3.5')} />
              </button>
              <span className="px-0.5 text-[11px] font-semibold">{comment.likeCount}</span>
              <button
                type="button"
                className={cn(
                  'hover:text-foreground rounded-full p-1 transition-colors disabled:opacity-60',
                  comment.likeStatus === COMMENT_LIKE_STATUS.DISLIKE &&
                    'text-button-primary-surface hover:text-button-primary-surface',
                )}
                disabled={commentReaction.isPending}
                onClick={commentReaction.handleDislikeComment}
              >
                <ThumbsDown className={cn(isCompact ? 'h-3 w-3' : 'h-3.5 w-3.5')} />
              </button>
            </div>
            {extraActions}
          </div>
        )}

        {children}
      </div>
    </div>
  );
}

const getCommentContent = (comment: CommentItem) => {
  if (comment.isDeleted) return DELETED_COMMENT_MESSAGE;
  if (comment.isBanned) return BANNED_COMMENT_CONTENT;

  return comment.content;
};
