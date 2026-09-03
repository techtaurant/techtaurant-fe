import { getGetUserProfileImagesApiQueryKey, useGetUserProfileImagesApi } from '@/shared/api/generated';

type Params = {
  options?: RequestInit;
  userId?: string;
};

const toUserProfileImageParams = (userId?: string) => {
  return {
    userIds: userId ? [userId] : [],
  };
};

const getUserProfileImageQueryKey = (userId?: string) => {
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
