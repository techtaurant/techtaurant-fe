'use client';

import { overlay } from 'overlay-kit';

import type { CommentItem } from '@/entities/comment';
import { PostDetailCommentDeleteConfirmModal } from '@/features/post-comments/ui/post-detail-comment-delete-confirm-modal';

type Params = {
  postId: string;
};

export const useOpenCommentDeleteConfirmModal = ({ postId }: Params) => {
  const openCommentDeleteConfirmModal = (comment: CommentItem) => {
    overlay.open(({ overlayId, isOpen, unmount }) => (
      <PostDetailCommentDeleteConfirmModal
        commentId={comment.id}
        overlayId={overlayId}
        isOpen={isOpen}
        onClose={unmount}
        postId={postId}
      />
    ));
  };

  return openCommentDeleteConfirmModal;
};
