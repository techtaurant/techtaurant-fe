'use client';

import { useDeletePostDetail } from '@/features/post-detail-interactions/model/use-delete-post-detail';
import { ConfirmModal } from '@/shared/ui/modal';
import { toast } from '@/shared/ui/toast';

type Props = {
  overlayId: string;
  isOpen: boolean;
  postId: string;
  onClose: () => void;
};

const POST_DELETE_CONFIRM_TITLE = '게시물을 삭제할까요?';
const POST_DELETE_CONFIRM_DESCRIPTION = '삭제한 글은 다시 복구할 수 없어요.';
const POST_DELETE_CONFIRM_LABEL = '삭제하기';
const POST_DELETE_SUCCESS_MESSAGE = '게시물을 삭제했어요.';
const POST_DELETE_FAILED_MESSAGE = '삭제하지 못했어요. 잠시 후 다시 시도해주세요.';

export function PostDetailDeleteConfirmModal({ overlayId, isOpen, postId, onClose }: Props) {
  const { deletePost, isPostDeleting } = useDeletePostDetail({
    onError: () => toast.error(POST_DELETE_FAILED_MESSAGE),
    onSuccess: () => {
      toast.success(POST_DELETE_SUCCESS_MESSAGE);
      onClose();
    },
    postId,
  });

  return (
    <ConfirmModal
      id={overlayId}
      isOpen={isOpen}
      title={POST_DELETE_CONFIRM_TITLE}
      description={POST_DELETE_CONFIRM_DESCRIPTION}
      confirmLabel={POST_DELETE_CONFIRM_LABEL}
      isConfirming={isPostDeleting}
      onClose={onClose}
      onConfirm={deletePost}
    />
  );
}
