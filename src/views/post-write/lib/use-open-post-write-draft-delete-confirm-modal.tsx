'use client';

import { overlay } from 'overlay-kit';

import { PostWriteDraftDeleteConfirmModal } from '@/views/post-write/ui/post-write-draft-delete-confirm-modal';

export const useOpenPostWriteDraftDeleteConfirmModal = () => {
  const openPostWriteDraftDeleteConfirmModal = (draftId: string) => {
    return overlay.open(({ overlayId, isOpen, unmount }) => (
      <PostWriteDraftDeleteConfirmModal overlayId={overlayId} isOpen={isOpen} draftId={draftId} onClose={unmount} />
    ));
  };

  return openPostWriteDraftDeleteConfirmModal;
};
