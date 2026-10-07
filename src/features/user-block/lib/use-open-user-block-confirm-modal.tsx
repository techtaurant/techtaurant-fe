'use client';

import { overlay } from 'overlay-kit';

import { UserBlockConfirmModal } from '@/features/user-block/ui/user-block-confirm-modal';

type Params = {
  userId: string;
  userName: string;
  onSuccess: () => void;
};

export const useOpenUserBlockConfirmModal = ({ userId, userName, onSuccess }: Params) => {
  const openUserBlockConfirmModal = () => {
    return overlay.open(({ overlayId, isOpen, unmount }) => (
      <UserBlockConfirmModal
        id={overlayId}
        isOpen={isOpen}
        onClose={unmount}
        userId={userId}
        userName={userName}
        onSuccess={onSuccess}
      />
    ));
  };

  return openUserBlockConfirmModal;
};
