'use client';

import { useQueryClient } from '@tanstack/react-query';

import { getCommentsQueryKey } from '@/entities/comment';
import { getPostListQueryKey } from '@/entities/post-list';
import { getMyBannedUsersQueryKey, getUserFollowingsQueryKey, useBanUser, useGetMe } from '@/entities/user';

type BlockCommentAuthorParams = {
  targetUserId: string;
  onError?: () => void;
  onSuccess?: () => void;
};

export const useCommentAuthorBlock = () => {
  const queryClient = useQueryClient();
  const { data: me } = useGetMe();
  const currentUserId = me?.id;
  const banUserMutation = useBanUser();

  const invalidateCommentAuthorBlockQueries = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: getMyBannedUsersQueryKey() }),
      queryClient.invalidateQueries({ queryKey: getCommentsQueryKey() }),
      queryClient.invalidateQueries({ queryKey: getPostListQueryKey() }),
      ...(currentUserId ? [queryClient.invalidateQueries({ queryKey: getUserFollowingsQueryKey(currentUserId) })] : []),
    ]);
  };

  const blockCommentAuthor = ({ targetUserId, onError, onSuccess }: BlockCommentAuthorParams) => {
    if (!currentUserId || currentUserId === targetUserId) return;

    banUserMutation.mutate(
      { targetUserId },
      {
        onError: () => {
          onError?.();
        },
        onSuccess: async () => {
          await invalidateCommentAuthorBlockQueries();
          onSuccess?.();
        },
      },
    );
  };

  return {
    blockCommentAuthor,
    isCommentAuthorBlocking: banUserMutation.isPending,
  };
};
