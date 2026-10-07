'use client';

import { useQueryClient } from '@tanstack/react-query';

import {
  getUserFollowCountsQueryKey,
  getUserFollowingsQueryKey,
  useGetMe,
  useGetUserFollowings,
} from '@/entities/user';
import { useFollowUserApi, useUnfollowUserApi } from '@/shared/api/generated';

type Params = {
  userId: string;
  onError?: (nextFollowingState: boolean) => void;
  onRequireLogin: () => void;
  onSuccess?: (nextFollowingState: boolean) => void;
};

export const useUserFollow = ({ userId, onError, onRequireLogin, onSuccess }: Params) => {
  const queryClient = useQueryClient();
  const { data: me, isPending: isAuthPending } = useGetMe();
  const currentUserId = me?.id;
  const followingsQuery = useGetUserFollowings({
    enabled: Boolean(currentUserId),
    userId: currentUserId,
  });

  const handleSuccess = async (nextFollowingState: boolean) => {
    if (!currentUserId) return;
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: getUserFollowingsQueryKey(currentUserId) }),
      queryClient.invalidateQueries({ queryKey: getUserFollowCountsQueryKey(userId) }),
      queryClient.invalidateQueries({ queryKey: getUserFollowCountsQueryKey(currentUserId) }),
    ]);
    onSuccess?.(nextFollowingState);
  };

  const followMutation = useFollowUserApi({
    mutation: {
      onSuccess: () => handleSuccess(true),
      onError: () => onError?.(true),
    },
  });
  const unfollowMutation = useUnfollowUserApi({
    mutation: {
      onSuccess: () => handleSuccess(false),
      onError: () => onError?.(false),
    },
  });
  const isOwnUser = currentUserId === userId;
  const isFollowing = Boolean(followingsQuery.data?.some((user) => user.userId === userId));
  const isUpdating = followMutation.isPending || unfollowMutation.isPending || followingsQuery.isFetching;

  const toggleFollow = () => {
    if (isAuthPending || isOwnUser || isUpdating) return;
    if (!currentUserId) {
      onRequireLogin();
      return;
    }

    const mutation = isFollowing ? unfollowMutation : followMutation;
    mutation.mutate({ targetUserId: userId });
  };

  return { isAuthPending, isFollowing, isUpdating, isOwnUser, toggleFollow };
};
