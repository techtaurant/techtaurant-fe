import type { QueryClient } from '@tanstack/react-query';

import { type CustomFetchInit } from '@/shared/api/custom-fetch';
import {
  getGetPostDetailApiQueryKey,
  getGetPostDetailApiQueryOptions,
  useGetPostDetailApi,
} from '@/shared/api/generated';

type Params = {
  options?: CustomFetchInit;
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

export const fetchPostDetail = async (queryClient: QueryClient, { options, postId }: Params) => {
  try {
    await queryClient.fetchQuery(
      getGetPostDetailApiQueryOptions(postId, {
        request: options,
        query: {
          queryKey: getPostDetailQueryKey(postId),
        },
      }),
    );
  } catch (error) {
    // RSC의 401은 클라이언트에서 다시 fetch하며 토큰을 refresh할 수 있도록 조용히 삼킵니다.
    // 그 외 오류는 호출부로 전파합니다.
    if (!(error instanceof Error && error.cause === 401)) {
      throw error;
    }
  }
};
