'use client';

import { overlay } from 'overlay-kit';

import { UserFollowModal, type UserFollowTab } from '@/views/user-detail/ui/user-follow-modal';

export const useOpenUserFollowModal = (userId: string) => {
  return (initialTab: UserFollowTab) =>
    overlay.open(({ overlayId, isOpen, unmount }) => (
      <UserFollowModal
        overlayId={overlayId}
        isOpen={isOpen}
        onClose={unmount}
        userId={userId}
        initialTab={initialTab}
      />
    ));
};
