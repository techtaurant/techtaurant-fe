import { useQueryClient } from '@tanstack/react-query';

import { getDraftListQueryKey } from '@/entities/post-write/api/use-get-draft-list';
import { useDeletePostApi } from '@/shared/api/generated';

export const useDeleteDraft = () => {
  const queryClient = useQueryClient();

  return useDeletePostApi({
    mutation: {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getDraftListQueryKey() }),
    },
  });
};
