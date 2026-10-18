import type { NotificationListItemResponse } from '@/shared/api/generated';
import { isUuid } from '@/shared/lib/is-uuid';

export const getNotificationDestination = (notification: NotificationListItemResponse) => {
  const getTargetId = (targetType: 'POST' | 'USER') => {
    const targetId = notification.arguments.find((argument) => argument.targetType === targetType)?.targetId;
    return targetId && isUuid(targetId) ? targetId : undefined;
  };

  switch (notification.type) {
    case 'POST_COMMENT':
    case 'COMMENT_REPLY':
    case 'COMMENT_LIKE': {
      const postId = getTargetId('POST');
      return postId ? `/posts/${postId}?target=comment` : null;
    }

    case 'FOLLOWER_POST':
    case 'POST_LIKE': {
      const postId = getTargetId('POST');
      return postId ? `/posts/${postId}` : null;
    }

    case 'FOLLOW': {
      const userId = getTargetId('USER');
      return userId ? `/users/${userId}` : null;
    }

    default: {
      return null;
    }
  }
};
