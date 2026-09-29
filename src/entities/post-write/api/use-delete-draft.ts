import { useQueryClient } from '@tanstack/react-query';

import { getDraftDetailQueryKey } from '@/entities/post-write/api/use-get-draft-detail';
import { getDraftListQueryKey } from '@/entities/post-write/api/use-get-draft-list';
import { useDeletePostApi } from '@/shared/api/generated';

export const useDeleteDraft = () => {
  const queryClient = useQueryClient();

  return useDeletePostApi({
    mutation: {
      onSuccess: (_, { postId }) => {
        queryClient.removeQueries({ queryKey: getDraftDetailQueryKey(postId) });
        return queryClient.invalidateQueries({ queryKey: getDraftListQueryKey() });
      },
    },
  });
};
