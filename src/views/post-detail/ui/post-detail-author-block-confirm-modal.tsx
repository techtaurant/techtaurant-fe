'use client';

import { usePostDetailAuthorBlock } from '@/features/post-detail-interactions';
import { Button } from '@/shared/ui/button';
import { Modal } from '@/shared/ui/modal';
import { toast } from '@/shared/ui/toast';

type Props = {
  authorId: string;
  authorName: string;
  overlayId: string;
  isOpen: boolean;
  onClose: () => void;
  postId: string;
};

const AUTHOR_BLOCK_CONFIRM_TITLE = '이 사용자를 차단할까요?';
const AUTHOR_BLOCK_CONFIRM_DESCRIPTION = '이 사용자를 차단한 계정 목록에 추가합니다.';
const AUTHOR_BLOCK_CONFIRM_ACTION = '차단하기';
const AUTHOR_BLOCK_CANCEL_ACTION = '취소';

export function PostDetailAuthorBlockConfirmModal({ authorId, authorName, overlayId, isOpen, onClose, postId }: Props) {
  const { blockAuthor, isAuthorBlockPending } = usePostDetailAuthorBlock({
    authorId,
    onError: () => {
      toast.error(`${authorName}님을 차단하지 못했어요`);
    },
    onSuccess: () => {
      toast.blocked(`${authorName}님을 차단했어요`);
      onClose();
    },
    postId,
  });

  const handleModalClose = () => {
    if (isAuthorBlockPending) return;
    onClose();
  };

  const handleBlockAuthorClick = () => {
    if (isAuthorBlockPending) return;
    blockAuthor();
  };

  return (
    <Modal
      id={overlayId}
      isOpen={isOpen}
      onClose={handleModalClose}
      className="max-w-xs rounded-2xl border-0 p-5 shadow-xl"
    >
      <h2 className="text-foreground text-lg font-semibold">{AUTHOR_BLOCK_CONFIRM_TITLE}</h2>
      <p className="text-muted-foreground mt-2 text-sm">{AUTHOR_BLOCK_CONFIRM_DESCRIPTION}</p>

      <div className="mt-5 flex justify-center">
        <div className="flex w-full min-w-0 flex-wrap gap-2">
          <Button
            variant="neutral"
            className="h-10 min-w-[136px] flex-1 rounded-lg px-4 py-2 text-center text-sm font-semibold whitespace-nowrap"
            disabled={isAuthorBlockPending}
            onClick={handleModalClose}
          >
            {AUTHOR_BLOCK_CANCEL_ACTION}
          </Button>
          <Button
            variant="danger"
            className="h-10 min-w-[136px] flex-1 rounded-lg px-4 py-2 text-center text-sm font-semibold whitespace-nowrap"
            disabled={isAuthorBlockPending}
            onClick={handleBlockAuthorClick}
          >
            {AUTHOR_BLOCK_CONFIRM_ACTION}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
