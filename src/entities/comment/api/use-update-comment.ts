import { useQueryClient } from '@tanstack/react-query';

import { getCommentsQueryKey } from '@/entities/comment/api/use-get-parent-comments';
import { useUpdateCommentApi } from '@/shared/api/generated';

export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useUpdateCommentApi({
    mutation: {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getCommentsQueryKey() }),
    },
  });
};
