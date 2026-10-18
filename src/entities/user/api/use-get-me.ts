import type { CustomFetchInit } from '@/shared/api/custom-fetch';
import { getGetMeApiQueryKey, useGetMeApi } from '@/shared/api/generated';

export const getMeQueryKey = () => {
  return getGetMeApiQueryKey();
};

export const useGetMe = (options?: CustomFetchInit) => {
  return useGetMeApi({
    request: options,
    query: {
      select: (response) => response.data,
    },
  });
};
