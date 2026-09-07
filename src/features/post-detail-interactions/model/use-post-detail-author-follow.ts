'use client';

import { useQueryClient } from '@tanstack/react-query';

import {
  getUserFollowingsQueryKey,
  useFollowUser,
  useGetMe,
  useGetUserFollowings,
  useUnfollowUser,
} from '@/entities/user';

type Params = {
  authorId: string;
  onError?: (nextFollowingState: boolean) => void;
  onRequireLogin: () => void;
  onSuccess?: (nextFollowingState: boolean) => void;
};

export const usePostDetailAuthorFollow = ({ authorId, onError, onRequireLogin, onSuccess }: Params) => {
  const queryClient = useQueryClient();
  const { data: me, isPending: isAuthPending } = useGetMe();
  const followMutation = useFollowUser();
  const unfollowMutation = useUnfollowUser();
  const currentUserId = me?.id;
  const isLoggedIn = !!me;
  const followingsQuery = useGetUserFollowings({
    enabled: Boolean(currentUserId),
    userId: currentUserId,
  });

  const isOwnAuthor = Boolean(currentUserId && currentUserId === authorId);
  const isFollowingAuthor = Boolean(followingsQuery.data?.some((followingUser) => followingUser.userId === authorId));
  const isFollowingUpdating = followMutation.isPending || unfollowMutation.isPending || followingsQuery.isFetching;

  const invalidateFollowingQueries = async () => {
    if (!currentUserId) return;
    await queryClient.invalidateQueries({ queryKey: getUserFollowingsQueryKey(currentUserId) });
  };

  const toggleAuthorFollow = () => {
    if (isAuthPending) return;
    if (isOwnAuthor) return;

    if (!isLoggedIn || !currentUserId) {
      onRequireLogin();
      return;
    }

    const mutation = isFollowingAuthor ? unfollowMutation : followMutation;
    const nextFollowingState = !isFollowingAuthor;

    mutation.mutate(
      { targetUserId: authorId },
      {
        onSuccess: async () => {
          await invalidateFollowingQueries();
          onSuccess?.(nextFollowingState);
        },
        onError: () => {
          onError?.(nextFollowingState);
        },
      },
    );
  };

  return {
    isFollowingAuthor,
    isFollowingUpdating,
    isOwnAuthor,
    toggleAuthorFollow,
  };
};
