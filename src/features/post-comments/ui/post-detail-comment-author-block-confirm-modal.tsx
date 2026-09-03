'use client';

import { useCommentAuthorBlock } from '@/features/post-comments/model/use-comment-author-block';
import { ConfirmModal } from '@/shared/ui/modal';
import { toast } from '@/shared/ui/toast';

type Props = {
  authorName: string;
  isOpen: boolean;
  onClose: () => void;
  overlayId: string;
  targetUserId: string;
};

const COMMENT_AUTHOR_BLOCK_CONFIRM_TITLE = '이 사용자를 차단할까요?';
const COMMENT_AUTHOR_BLOCK_CONFIRM_DESCRIPTION = '이 사용자를 차단한 계정 목록에 추가합니다.';
const COMMENT_AUTHOR_BLOCK_CONFIRM_LABEL = '차단하기';

export function PostDetailCommentAuthorBlockConfirmModal({
  authorName,
  isOpen,
  onClose,
  overlayId,
  targetUserId,
}: Props) {
  const { blockCommentAuthor, isCommentAuthorBlocking } = useCommentAuthorBlock();

  const handleConfirmButtonClick = () => {
    if (isCommentAuthorBlocking) return;

    blockCommentAuthor({
      targetUserId,
      onError: () => {
        toast.error(`${authorName}님을 차단하지 못했어요`);
      },
      onSuccess: () => {
        toast.blocked(`${authorName}님을 차단했어요`);
        onClose();
      },
    });
  };

  return (
    <ConfirmModal
      id={overlayId}
      isOpen={isOpen}
      title={COMMENT_AUTHOR_BLOCK_CONFIRM_TITLE}
      description={COMMENT_AUTHOR_BLOCK_CONFIRM_DESCRIPTION}
      confirmLabel={COMMENT_AUTHOR_BLOCK_CONFIRM_LABEL}
      isConfirming={isCommentAuthorBlocking}
      onClose={onClose}
      onConfirm={handleConfirmButtonClick}
    />
  );
}
