'use client';

import { overlay } from 'overlay-kit';

import type { CommentItem } from '@/entities/comment';
import { PostDetailCommentAuthorBlockConfirmModal } from '@/features/post-comments/ui/post-detail-comment-author-block-confirm-modal';

export const useOpenCommentAuthorBlockConfirmModal = () => {
  const openCommentAuthorBlockConfirmModal = (comment: CommentItem) => {
    overlay.open(({ overlayId, isOpen, unmount }) => (
      <PostDetailCommentAuthorBlockConfirmModal
        authorName={comment.authorName}
        overlayId={overlayId}
        isOpen={isOpen}
        onClose={unmount}
        targetUserId={comment.authorId}
      />
    ));
  };

  return openCommentAuthorBlockConfirmModal;
};
