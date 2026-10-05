import { getGetFollowersApiQueryKey, useGetFollowersApi } from '@/shared/api/generated';

type Params = {
  enabled: boolean;
  userId: string;
};

export const getUserFollowersQueryKey = (userId: string) => {
  return getGetFollowersApiQueryKey(userId);
};

export const useGetUserFollowers = ({ enabled, userId }: Params) => {
  return useGetFollowersApi(userId, {
    query: {
      enabled: enabled && Boolean(userId),
      select: (response) => response.data ?? [],
    },
  });
};
