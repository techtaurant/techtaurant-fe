import type { QueryClient } from '@tanstack/react-query';

import type { CustomFetchInit } from '@/shared/api/custom-fetch';
import {
  getGetUserProfileImagesApiQueryKey,
  getGetUserProfileImagesApiQueryOptions,
  useGetUserProfileImagesApi,
} from '@/shared/api/generated';

type Params = {
  options?: CustomFetchInit;
  userId?: string;
};

export const fetchUserProfileImage = async (queryClient: QueryClient, { userId, options }: Params) => {
  const response = await queryClient.fetchQuery(
    getGetUserProfileImagesApiQueryOptions(toUserProfileImageParams(userId), { request: options }),
  );
  return response.data?.[0];
};

const toUserProfileImageParams = (userId?: string) => {
  return {
    userIds: userId ? [userId] : [],
  };
};

export const getUserProfileImageQueryKey = (userId?: string) => {
  return getGetUserProfileImagesApiQueryKey(toUserProfileImageParams(userId));
};

export const useGetUserProfileImage = ({ options, userId }: Params) => {
  return useGetUserProfileImagesApi(toUserProfileImageParams(userId), {
    request: options,
    query: {
      enabled: Boolean(userId),
      queryKey: getUserProfileImageQueryKey(userId),
      select: (response) => response.data?.[0],
    },
  });
};
