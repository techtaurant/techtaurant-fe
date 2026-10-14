import type { QueryClient } from '@tanstack/react-query';

import type { CustomFetchInit } from '@/shared/api/custom-fetch';
import {
  getGetFollowCountsApiQueryKey,
  prefetchGetFollowCountsApiQuery,
  useGetFollowCountsApi,
} from '@/shared/api/generated';

export const getUserFollowCountsQueryKey = (userId: string) => {
  return getGetFollowCountsApiQueryKey(userId);
};

export const prefetchUserFollowCounts = (queryClient: QueryClient, userId: string, options?: CustomFetchInit) => {
  return prefetchGetFollowCountsApiQuery(queryClient, userId, { request: options });
};

export const useGetUserFollowCounts = (userId: string) => {
  return useGetFollowCountsApi(userId, {
    query: {
      queryKey: getUserFollowCountsQueryKey(userId),
      select: (response) => response.data,
    },
  });
};
