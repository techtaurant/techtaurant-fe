'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { getPostDetailQueryKey, useDeletePost } from '@/entities/post-detail';
import { getPostListQueryKey } from '@/entities/post-list';

type Params = {
  onError: () => void;
  onSuccess: () => void;
  postId: string;
};

const POST_LIST_PATH = '/posts';

export const useDeletePostDetail = ({ onError, onSuccess, postId }: Params) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const deleteMutation = useDeletePost();

  const deletePost = () => {
    deleteMutation.mutate(
      { postId },
      {
        onError,
        onSuccess: async () => {
          queryClient.removeQueries({ queryKey: getPostDetailQueryKey(postId) });
          await queryClient.invalidateQueries({ queryKey: getPostListQueryKey() });
          onSuccess();
          router.replace(POST_LIST_PATH);
        },
      },
    );
  };

  return {
    deletePost,
    isPostDeleting: deleteMutation.isPending,
  };
};
