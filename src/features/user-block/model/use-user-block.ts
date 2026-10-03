'use client';

import { useQueryClient } from '@tanstack/react-query';

import { getCommentsQueryKey } from '@/entities/comment';
import { getPostListQueryKey } from '@/entities/post-list';
import {
  getMyBannedUsersQueryKey,
  getUserFollowCountsQueryKey,
  getUserFollowingsQueryKey,
  useBanUser,
  useGetMe,
} from '@/entities/user';

type Params = {
  userId: string;
  onSuccess: () => void;
  onError: () => void;
};

export const useUserBlock = ({ userId, onSuccess, onError }: Params) => {
  const queryClient = useQueryClient();
  const { data: me } = useGetMe();
  const mutation = useBanUser({
    mutation: {
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: getMyBannedUsersQueryKey() }),
          queryClient.invalidateQueries({ queryKey: getPostListQueryKey() }),
          queryClient.invalidateQueries({ queryKey: getCommentsQueryKey() }),
          queryClient.invalidateQueries({ queryKey: getUserFollowCountsQueryKey(userId) }),
          ...(me
            ? [
                queryClient.invalidateQueries({ queryKey: getUserFollowingsQueryKey(me.id) }),
                queryClient.invalidateQueries({ queryKey: getUserFollowCountsQueryKey(me.id) }),
              ]
            : []),
        ]);
        onSuccess();
      },
      onError,
    },
  });

  const blockUser = () => {
    if (!me || me.id === userId || mutation.isPending) return;
    mutation.mutate({ targetUserId: userId });
  };

  return { blockUser, isPending: mutation.isPending };
};
