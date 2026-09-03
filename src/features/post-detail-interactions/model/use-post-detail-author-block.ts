'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { getPostDetailQueryKey } from '@/entities/post-detail';
import { getPostListQueryKey } from '@/entities/post-list';
import { getMyBannedUsersQueryKey, getUserFollowingsQueryKey, useBanUser, useGetMe } from '@/entities/user';

type Params = {
  postId: string;
  authorId: string;
  onSuccess?: () => void;
  onError?: () => void;
};

export const usePostDetailAuthorBlock = ({ postId, authorId, onSuccess, onError }: Params) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: me } = useGetMe();
  const banMutation = useBanUser();

  const currentUserId = me?.id;

  const blockAuthor = () => {
    if (!currentUserId || authorId === currentUserId) return;

    banMutation.mutate(
      { targetUserId: authorId },
      {
        onSuccess: async () => {
          await Promise.all([
            queryClient.invalidateQueries({ queryKey: getMyBannedUsersQueryKey() }),
            queryClient.invalidateQueries({ queryKey: getUserFollowingsQueryKey(currentUserId) }),
            queryClient.invalidateQueries({ queryKey: getPostListQueryKey() }),
          ]);
          queryClient.removeQueries({ exact: true, queryKey: getPostDetailQueryKey(postId) });
          onSuccess?.();
          router.back();
        },
        onError: () => {
          onError?.();
        },
      },
    );
  };

  return {
    blockAuthor,
    isAuthorBlockPending: banMutation.isPending,
  };
};
