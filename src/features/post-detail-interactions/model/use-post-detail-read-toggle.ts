'use client';

import { useQueryClient } from '@tanstack/react-query';

import { getPostDetailQueryKey, useUpdatePostReadStatus } from '@/entities/post-detail';
import { getPostListQueryKey } from '@/entities/post-list';
import { useGetMe } from '@/entities/user';

type Params = {
  postId: string;
  isRead: boolean;
  onError?: () => void;
  onRequireLogin: () => void;
  onSuccess?: (nextReadState: boolean) => void;
};

export const usePostDetailReadToggle = ({ postId, isRead, onError, onRequireLogin, onSuccess }: Params) => {
  const queryClient = useQueryClient();
  const { data: me, isPending: isAuthPending } = useGetMe();
  const readMutation = useUpdatePostReadStatus();
  const isLoggedIn = !!me;
  const isReadToggleDisabled = isAuthPending || readMutation.isPending;

  const toggleRead = () => {
    if (isAuthPending) return;

    if (!isLoggedIn) {
      onRequireLogin();
      return;
    }

    const nextReadState = !isRead;

    readMutation.mutate(
      {
        postId,
        data: {
          isRead: nextReadState,
        },
      },
      {
        onSuccess: async () => {
          await Promise.all([
            queryClient.invalidateQueries({ queryKey: getPostDetailQueryKey(postId) }),
            queryClient.invalidateQueries({ queryKey: getPostListQueryKey() }),
          ]);
          onSuccess?.(nextReadState);
        },
        onError: () => {
          onError?.();
        },
      },
    );
  };

  return {
    isReadToggleDisabled,
    toggleRead,
  };
};
