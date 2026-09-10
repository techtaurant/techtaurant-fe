import { useQueryClient } from '@tanstack/react-query';

import {
  getGetMyNotificationsApiQueryKey,
  getGetMyUnreadNotificationCountApiQueryKey,
  useMarkNotificationsReadApi,
} from '@/shared/api/generated';
import { toast } from '@/shared/ui/toast';

export const useMarkNotificationsRead = () => {
  const queryClient = useQueryClient();

  return useMarkNotificationsReadApi({
    mutation: {
      onSuccess: () => {
        return Promise.all([
          queryClient.invalidateQueries({ queryKey: getGetMyNotificationsApiQueryKey() }),
          queryClient.invalidateQueries({ queryKey: getGetMyUnreadNotificationCountApiQueryKey() }),
        ]);
      },
      onError: () => {
        toast.error('알림을 읽음 처리하지 못했습니다.');
      },
    },
  });
};
