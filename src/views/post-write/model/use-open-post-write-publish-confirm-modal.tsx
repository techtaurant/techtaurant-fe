'use client';

import { overlay } from 'overlay-kit';

import type { PostDraft } from '@/views/post-write/model/post-draft';
import { PostWritePublishConfirmModal } from '@/views/post-write/ui/post-write-publish-confirm-modal';

export const useOpenPostWritePublishConfirmModal = () => {
  const openPostWritePublishConfirmModal = (draft: PostDraft) => {
    return overlay.open(({ overlayId, isOpen, unmount }) => (
      <PostWritePublishConfirmModal draft={draft} isOpen={isOpen} onClose={unmount} overlayId={overlayId} />
    ));
  };

  return openPostWritePublishConfirmModal;
};
