'use client';

import { useQueryClient } from '@tanstack/react-query';

import type { PostLikeStatus } from '@/entities/post-detail';
import { getPostDetailQueryKey, POST_LIKE_STATUS, useUpdatePostLikeStatus } from '@/entities/post-detail';
import { getPostListQueryKey } from '@/entities/post-list';
import { useGetMe } from '@/entities/user';

type Params = {
  postId: string;
  likeStatus: PostLikeStatus;
  onRequireLogin: () => void;
};

export const usePostDetailInteractions = ({ postId, likeStatus, onRequireLogin }: Params) => {
  const queryClient = useQueryClient();
  const { data: me, isPending: isAuthPending } = useGetMe();
  const likeMutation = useUpdatePostLikeStatus();
  const isLoggedIn = !!me;

  const ensureLoggedIn = () => {
    if (isAuthPending) return false;
    if (isLoggedIn) return true;

    onRequireLogin();
    return false;
  };

  const togglePostReaction = (targetLikeStatus: PostLikeStatus) => {
    if (!ensureLoggedIn()) return;

    const nextLikeStatus = getNextLikeStatus(likeStatus, targetLikeStatus);

    likeMutation.mutate(
      {
        postId,
        data: {
          likeStatus: nextLikeStatus,
        },
      },
      {
        onSuccess: async () => {
          await Promise.all([
            queryClient.invalidateQueries({ queryKey: getPostDetailQueryKey(postId) }),
            queryClient.invalidateQueries({ queryKey: getPostListQueryKey() }),
          ]);
        },
      },
    );
  };

  const toggleLike = () => {
    togglePostReaction(POST_LIKE_STATUS.LIKE);
  };

  const toggleDislike = () => {
    togglePostReaction(POST_LIKE_STATUS.DISLIKE);
  };

  return {
    isLikePending: likeMutation.isPending,
    toggleDislike,
    toggleLike,
  };
};

const getNextLikeStatus = (currentLikeStatus: PostLikeStatus, targetLikeStatus: PostLikeStatus) => {
  if (currentLikeStatus === targetLikeStatus) return POST_LIKE_STATUS.NONE;
  return targetLikeStatus;
};
