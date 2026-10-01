'use client';

import { overlay } from 'overlay-kit';

import { PostDetailDeleteConfirmModal } from '@/features/post-detail-interactions/ui/post-detail-delete-confirm-modal';

type Params = {
  postId: string;
};

export const useOpenPostDetailDeleteConfirmModal = ({ postId }: Params) => {
  const openPostDetailDeleteConfirmModal = () => {
    return overlay.open(({ overlayId, isOpen, unmount }) => (
      <PostDetailDeleteConfirmModal overlayId={overlayId} isOpen={isOpen} postId={postId} onClose={unmount} />
    ));
  };

  return openPostDetailDeleteConfirmModal;
};
