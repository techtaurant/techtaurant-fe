'use client';

import { useUserBlock } from '@/features/user-block/model/use-user-block';
import { ConfirmModal } from '@/shared/ui/modal';
import { toast } from '@/shared/ui/toast';

type Props = {
  userId: string;
  userName: string;
  id: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export function UserBlockConfirmModal({ userId, userName, id, isOpen, onClose, onSuccess }: Props) {
  const { blockUser, isPending } = useUserBlock({
    userId,
    onSuccess: () => {
      toast.blocked(`${userName}님을 차단했어요`);
      onClose();
      onSuccess();
    },
    onError: () => toast.error(`${userName}님을 차단하지 못했어요`),
  });

  return (
    <ConfirmModal
      id={id}
      isOpen={isOpen}
      isConfirming={isPending}
      title="이 사용자를 차단할까요?"
      description="이 사용자를 차단한 계정 목록에 추가합니다."
      confirmLabel="차단하기"
      onConfirm={blockUser}
      onClose={onClose}
    />
  );
}
