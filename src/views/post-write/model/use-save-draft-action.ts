'use client';

import { useQueryClient } from '@tanstack/react-query';

import { getPostListQueryKey } from '@/entities/post-list';
import { getDraftDetailQueryKey, useSaveDraft } from '@/entities/post-write';
import { CreatePostRequestStatus } from '@/shared/api/generated';
import { toast } from '@/shared/ui/toast';
import { buildCreatePostRequest } from '@/views/post-write/lib/build-create-post-request';
import type { PostDraft } from '@/views/post-write/model/post-draft';
import { useDraftIdSearchParam } from '@/views/post-write/model/use-draft-id-search-param';

const DRAFT_SAVE_SUCCESS_MESSAGE = '임시저장했어요.';
const DRAFT_SAVE_FAILED_MESSAGE = '임시저장하지 못했어요. 잠시 후 다시 시도해주세요.';
const DRAFT_EMPTY_MESSAGE = '제목이나 본문을 입력해주세요.';

export const useSaveDraftAction = () => {
  const queryClient = useQueryClient();

  const { draftId, replaceDraftId } = useDraftIdSearchParam();
  const saveDraftMutation = useSaveDraft();

  const isDraftSaving = saveDraftMutation.isPending;

  const applyDraftSaveResult = async (savedDraftId?: string) => {
    if (savedDraftId && !draftId) {
      replaceDraftId(savedDraftId);
    }

    const invalidateQueries = [queryClient.invalidateQueries({ queryKey: getPostListQueryKey() })];

    if (savedDraftId) {
      invalidateQueries.push(queryClient.invalidateQueries({ queryKey: getDraftDetailQueryKey(savedDraftId) }));
    }

    await Promise.all(invalidateQueries);
  };

  const isDraftEmpty = (draft: PostDraft) => !draft.title.trim() && !draft.content.trim();

  const saveDraft = (draft: PostDraft, { onSuccess }: { onSuccess?: () => void } = {}) => {
    if (isDraftEmpty(draft)) {
      toast.error(DRAFT_EMPTY_MESSAGE);
      return;
    }

    saveDraftMutation.mutate(
      {
        data: buildCreatePostRequest(draft, CreatePostRequestStatus.DRAFT),
        draftId,
      },
      {
        onSuccess: async (savedDraftId) => {
          await applyDraftSaveResult(savedDraftId);
          toast.success(DRAFT_SAVE_SUCCESS_MESSAGE);
          onSuccess?.();
        },
        onError: () => toast.error(DRAFT_SAVE_FAILED_MESSAGE),
      },
    );
  };

  const saveDraftSilentlyOrThrow = async (draft: PostDraft) => {
    if (isDraftEmpty(draft)) return;

    const savedDraftId = await saveDraftMutation.mutateAsync({
      data: buildCreatePostRequest(draft, CreatePostRequestStatus.DRAFT),
      draftId,
    });

    await applyDraftSaveResult(savedDraftId);
  };

  return { isDraftSaving, saveDraft, saveDraftSilentlyOrThrow };
};
