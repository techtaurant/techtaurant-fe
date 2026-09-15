'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { getPostListQueryKey } from '@/entities/post-list';
import { getDraftDetailQueryKey, useSaveDraft } from '@/entities/post-write';
import { CreatePostRequestStatus } from '@/shared/api/generated';
import { toast } from '@/shared/ui/toast';
import { buildCreatePostRequest } from '@/views/post-write/lib/build-create-post-request';
import type { PostDraft } from '@/views/post-write/model/post-draft';
import { useDraftIdSearchParam } from '@/views/post-write/model/use-draft-id-search-param';

const PUBLISH_FAILED_MESSAGE = '발행하지 못했어요. 잠시 후 다시 시도해주세요.';

export const usePublishAction = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { draftId } = useDraftIdSearchParam();
  const publishMutation = useSaveDraft();

  const isPublishing = publishMutation.isPending;

  const applyPublishResult = async (publishedPostId?: string) => {
    const invalidateQueries = [queryClient.invalidateQueries({ queryKey: getPostListQueryKey() })];

    if (publishedPostId) {
      invalidateQueries.push(queryClient.invalidateQueries({ queryKey: getDraftDetailQueryKey(publishedPostId) }));
    }

    await Promise.all(invalidateQueries);

    if (!publishedPostId) return;

    router.push(`/posts/${publishedPostId}`);
  };

  const publish = (draft: PostDraft, { onSuccess }: { onSuccess?: () => void } = {}) => {
    publishMutation.mutate(
      {
        data: buildCreatePostRequest(draft, CreatePostRequestStatus.PUBLISHED),
        draftId,
      },
      {
        onSuccess: async (publishedPostId) => {
          await applyPublishResult(publishedPostId);
          onSuccess?.();
        },
        onError: () => toast.error(PUBLISH_FAILED_MESSAGE),
      },
    );
  };

  return { isPublishing, publish };
};
