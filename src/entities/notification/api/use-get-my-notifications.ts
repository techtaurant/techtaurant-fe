import { useGetMyNotificationsApi } from '@/shared/api/generated';

const NOTIFICATION_LIST_SIZE = 20;

const notificationListParams = { size: NOTIFICATION_LIST_SIZE };

export const useGetMyNotifications = (enabled: boolean) => {
  return useGetMyNotificationsApi(notificationListParams, {
    query: {
      enabled,
      select: (response) => response.data?.content ?? [],
    },
  });
};
