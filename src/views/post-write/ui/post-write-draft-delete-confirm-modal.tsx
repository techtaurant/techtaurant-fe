'use client';

import { useDeleteDraft } from '@/entities/post-write';
import { ConfirmModal } from '@/shared/ui/modal';
import { toast } from '@/shared/ui/toast';

type Props = {
  overlayId: string;
  isOpen: boolean;
  draftId: string;
  onClose: () => void;
};

const DRAFT_DELETE_CONFIRM_TITLE = '임시저장 글을 삭제할까요?';
const DRAFT_DELETE_CONFIRM_DESCRIPTION = '삭제한 글은 다시 복구할 수 없어요.';
const DRAFT_DELETE_CONFIRM_LABEL = '삭제하기';
const DRAFT_DELETE_SUCCESS_MESSAGE = '임시저장 글을 삭제했어요.';
const DRAFT_DELETE_FAILED_MESSAGE = '삭제하지 못했어요. 잠시 후 다시 시도해주세요.';

export function PostWriteDraftDeleteConfirmModal({ overlayId, isOpen, draftId, onClose }: Props) {
  const deleteDraft = useDeleteDraft();

  const handleConfirmButtonClick = () => {
    if (deleteDraft.isPending) return;

    deleteDraft.mutate(
      { postId: draftId },
      {
        onError: () => toast.error(DRAFT_DELETE_FAILED_MESSAGE),
        onSuccess: () => {
          toast.success(DRAFT_DELETE_SUCCESS_MESSAGE);
          onClose();
        },
      },
    );
  };

  return (
    <ConfirmModal
      id={overlayId}
      isOpen={isOpen}
      title={DRAFT_DELETE_CONFIRM_TITLE}
      description={DRAFT_DELETE_CONFIRM_DESCRIPTION}
      confirmLabel={DRAFT_DELETE_CONFIRM_LABEL}
      isConfirming={deleteDraft.isPending}
      onClose={onClose}
      onConfirm={handleConfirmButtonClick}
    />
  );
}
