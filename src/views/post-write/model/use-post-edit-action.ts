'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { getPostDetailQueryKey, useUpdatePost } from '@/entities/post-detail';
import { getPostListQueryKey } from '@/entities/post-list';
import { getDraftDetailQueryKey } from '@/entities/post-write';
import { CreatePostRequestStatus } from '@/shared/api/generated';
import { toast } from '@/shared/ui/toast';
import { buildCreatePostRequest } from '@/views/post-write/lib/build-create-post-request';
import type { PostDraft } from '@/views/post-write/model/post-draft';

const POST_DETAIL_PATH = '/posts';
const POST_EDIT_FAILED_MESSAGE = '수정하지 못했어요. 잠시 후 다시 시도해주세요.';

type EditPostParams = {
  draft: PostDraft;
  isPrivate: boolean;
  postId: string;
};

export const usePostEditAction = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const updatePostMutation = useUpdatePost();

  const isPostEditing = updatePostMutation.isPending;

  const editPost = ({ draft, isPrivate, postId }: EditPostParams) => {
    const visibility = isPrivate ? CreatePostRequestStatus.PRIVATE : CreatePostRequestStatus.PUBLISHED;

    updatePostMutation.mutate(
      { postId, data: buildCreatePostRequest(draft, visibility) },
      {
        onSuccess: async () => {
          await Promise.all([
            queryClient.invalidateQueries({ queryKey: getPostDetailQueryKey(postId) }),
            queryClient.invalidateQueries({ queryKey: getPostListQueryKey() }),
            queryClient.invalidateQueries({ queryKey: getDraftDetailQueryKey(postId) }),
          ]);
          router.replace(`${POST_DETAIL_PATH}/${postId}`);
        },
        onError: () => toast.error(POST_EDIT_FAILED_MESSAGE),
      },
    );
  };

  return { editPost, isPostEditing };
};
