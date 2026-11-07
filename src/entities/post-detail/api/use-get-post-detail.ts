import type { QueryClient } from '@tanstack/react-query';

import { loadPostDetail } from '@/entities/post-detail/api/load-post-detail';
import { getGetPostDetailApiQueryKey, useGetPostDetailApi } from '@/shared/api/generated';

type Params = {
  cookieHeader: string;
  postId: string;
};

export const getPostDetailQueryKey = (postId: string) => {
  return getGetPostDetailApiQueryKey(postId);
};

export const useGetPostDetail = (postId: string) => {
  return useGetPostDetailApi(postId, {
    query: {
      queryKey: getPostDetailQueryKey(postId),
      select: (response) => response.data,
    },
  });
};

export const fetchPostDetail = async (queryClient: QueryClient, { cookieHeader, postId }: Params) => {
  try {
    await queryClient.fetchQuery({
      queryKey: getPostDetailQueryKey(postId),
      queryFn: () => loadPostDetail(postId, cookieHeader),
    });
  } catch (error) {
    // RSC의 401은 클라이언트에서 다시 fetch하며 토큰을 refresh할 수 있도록 조용히 삼킵니다.
    // 그 외 오류는 호출부로 전파합니다.
    if (!(error instanceof Error && error.cause === 401)) {
      throw error;
    }
  }
};
