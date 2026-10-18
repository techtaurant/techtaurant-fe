import { getGetDraftDetailApiQueryKey, useGetDraftDetailApi } from '@/shared/api/generated';

type Params = {
  postId?: string;
};

export const getDraftDetailQueryKey = (postId: string) => {
  return getGetDraftDetailApiQueryKey(postId);
};

export const useGetDraftDetail = ({ postId }: Params) => {
  return useGetDraftDetailApi(postId ?? '', {
    query: {
      enabled: !!postId,
      queryKey: getDraftDetailQueryKey(postId ?? ''),
      select: (response) => response.data,
    },
  });
};
