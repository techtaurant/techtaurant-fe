import { useGetMyUnreadNotificationCountApi } from '@/shared/api/generated';

export const useGetMyUnreadNotificationCount = () => {
  return useGetMyUnreadNotificationCountApi({
    query: {
      select: (response) => response.data?.unreadCount ?? 0,
    },
  });
};
