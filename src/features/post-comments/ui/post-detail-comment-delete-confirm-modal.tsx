'use client';

import { useDeleteCommentMutation } from '@/features/post-comments/model/use-delete-comment-mutation';
import { ConfirmModal } from '@/shared/ui/modal';
import { toast } from '@/shared/ui/toast';

type Props = {
  commentId: string;
  isOpen: boolean;
  onClose: () => void;
  overlayId: string;
  postId: string;
};

const COMMENT_DELETE_CONFIRM_TITLE = '댓글을 삭제할까요?';
const COMMENT_DELETE_CONFIRM_DESCRIPTION = '삭제한 댓글은 다시 복구할 수 없어요.';
const COMMENT_DELETE_CONFIRM_LABEL = '삭제하기';
const COMMENT_DELETE_SUCCESS_MESSAGE = '댓글을 삭제했어요.';
const COMMENT_DELETE_FAILED_MESSAGE = '댓글 삭제에 실패했어요.';

export function PostDetailCommentDeleteConfirmModal({ commentId, isOpen, onClose, overlayId, postId }: Props) {
  const { deleteComment, isCommentDeleting } = useDeleteCommentMutation({ postId });

  const handleConfirmButtonClick = () => {
    deleteComment({
      commentId,
      onError: () => {
        toast.error(COMMENT_DELETE_FAILED_MESSAGE);
      },
      onSuccess: () => {
        toast.success(COMMENT_DELETE_SUCCESS_MESSAGE);
        onClose();
      },
    });
  };

  return (
    <ConfirmModal
      id={overlayId}
      isOpen={isOpen}
      title={COMMENT_DELETE_CONFIRM_TITLE}
      description={COMMENT_DELETE_CONFIRM_DESCRIPTION}
      confirmLabel={COMMENT_DELETE_CONFIRM_LABEL}
      isConfirming={isCommentDeleting}
      onClose={onClose}
      onConfirm={handleConfirmButtonClick}
    />
  );
}
