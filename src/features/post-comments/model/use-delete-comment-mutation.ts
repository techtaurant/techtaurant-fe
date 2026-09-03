'use client';

import { useQueryClient } from '@tanstack/react-query';

import { getCommentsQueryKey, useDeleteComment } from '@/entities/comment';
import { getPostDetailQueryKey } from '@/entities/post-detail';
import { getPostListQueryKey } from '@/entities/post-list';

type Params = {
  postId: string;
};

type DeleteCommentParams = {
  commentId: string;
  onError?: () => void;
  onSuccess?: () => void;
};

export const useDeleteCommentMutation = ({ postId }: Params) => {
  const queryClient = useQueryClient();
  const deleteCommentMutation = useDeleteComment();

  const invalidateCommentDeleteQueries = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: getCommentsQueryKey() }),
      queryClient.invalidateQueries({ queryKey: getPostDetailQueryKey(postId) }),
      queryClient.invalidateQueries({ queryKey: getPostListQueryKey() }),
    ]);
  };

  const deleteComment = ({ commentId, onError, onSuccess }: DeleteCommentParams) => {
    deleteCommentMutation.mutate(
      {
        commentId,
      },
      {
        onError: () => {
          onError?.();
        },
        onSuccess: async () => {
          await invalidateCommentDeleteQueries();
          onSuccess?.();
        },
      },
    );
  };

  return {
    deleteComment,
    isCommentDeleting: deleteCommentMutation.isPending,
  };
};
