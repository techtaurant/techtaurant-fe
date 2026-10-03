'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { overlay } from 'overlay-kit';

import { getPostDetailQueryKey } from '@/entities/post-detail';
import { UserBlockConfirmModal } from '@/features/user-block';

type Params = {
  authorId: string;
  authorName: string;
  postId: string;
};

export const useOpenPostDetailAuthorBlockConfirmModal = ({ authorId, authorName, postId }: Params) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const openPostDetailAuthorBlockConfirmModal = () => {
    return overlay.open(({ overlayId, isOpen, unmount }) => (
      <UserBlockConfirmModal
        userId={authorId}
        userName={authorName}
        id={overlayId}
        isOpen={isOpen}
        onClose={unmount}
        onSuccess={() => {
          queryClient.removeQueries({ exact: true, queryKey: getPostDetailQueryKey(postId) });
          router.replace('/posts');
        }}
      />
    ));
  };

  return openPostDetailAuthorBlockConfirmModal;
};
