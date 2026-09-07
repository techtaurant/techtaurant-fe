'use client';

import { overlay } from 'overlay-kit';

import { PostDetailAuthorBlockConfirmModal } from '@/views/post-detail/ui/post-detail-author-block-confirm-modal';

type Params = {
  authorId: string;
  authorName: string;
  postId: string;
};

export const useOpenPostDetailAuthorBlockConfirmModal = ({ authorId, authorName, postId }: Params) => {
  const openPostDetailAuthorBlockConfirmModal = () => {
    return overlay.open(({ overlayId, isOpen, unmount }) => (
      <PostDetailAuthorBlockConfirmModal
        authorId={authorId}
        authorName={authorName}
        overlayId={overlayId}
        isOpen={isOpen}
        onClose={unmount}
        postId={postId}
      />
    ));
  };

  return openPostDetailAuthorBlockConfirmModal;
};
