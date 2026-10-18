'use client';

import { useQueryClient } from '@tanstack/react-query';

import { getPostDetailQueryKey, useUpdatePost } from '@/entities/post-detail';
import { getPostListQueryKey } from '@/entities/post-list';
import { UpdatePostRequestStatus } from '@/shared/api/generated';

type Params = {
  isPrivate: boolean;
  onError: () => void;
  onSuccess: () => void;
  postId: string;
};

export const usePostDetailVisibility = ({ isPrivate, onError, onSuccess, postId }: Params) => {
  const queryClient = useQueryClient();
  const updateMutation = useUpdatePost();

  const nextStatus = isPrivate ? UpdatePostRequestStatus.PUBLISHED : UpdatePostRequestStatus.PRIVATE;

  const toggleVisibility = () => {
    updateMutation.mutate(
      { postId, data: { status: nextStatus } },
      {
        onError,
        onSuccess: async () => {
          await Promise.all([
            queryClient.invalidateQueries({ queryKey: getPostDetailQueryKey(postId) }),
            queryClient.invalidateQueries({ queryKey: getPostListQueryKey() }),
          ]);
          onSuccess();
        },
      },
    );
  };

  return {
    isVisibilityUpdating: updateMutation.isPending,
    toggleVisibility,
  };
};
