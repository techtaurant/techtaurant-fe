'use client';

import { useGetMyNotifications, useMarkNotificationsRead } from '@/entities/notification';
import type { NotificationListItemResponse } from '@/shared/api/generated';
import { cn } from '@/shared/lib/cn';
import { DropdownContent } from '@/shared/ui/dropdown';
import { useDropdownContext } from '@/shared/ui/dropdown/providers/dropdown-provider';
import { NotificationDropdownItem } from '@/widgets/header/ui/notification-dropdown-item';

type Props = {
  unreadCount: number;
};

export function NotificationDropdownContent({ unreadCount }: Props) {
  const { isOpen } = useDropdownContext();
  const { data: notifications = [], isError, isPending } = useGetMyNotifications(isOpen);
  const { isPending: isMarkingRead, mutate: markNotificationsRead } = useMarkNotificationsRead();

  const handleNotificationClick = (notification: NotificationListItemResponse) => {
    if (!notification.isRead) {
      markNotificationsRead({ data: { notificationIds: [notification.id] } });
    }

    // TODO: 알림 종류에 맞는 페이지로 router.push 수행
  };

  const handleMarkAllAsRead = () => {
    const notificationIds = notifications
      .filter((notification) => !notification.isRead)
      .map((notification) => notification.id);

    if (notificationIds.length === 0) return;

    markNotificationsRead({ data: { notificationIds } });
  };

  if (!isOpen) return null;

  return (
    <DropdownContent
      align="end"
      className="border-border/80 text-foreground w-84.5 max-w-[calc(100vw-1.5rem)] rounded-[28px] p-0 shadow-[0_24px_70px_rgba(15,23,42,0.16)]"
    >
      <div className="border-border/70 flex items-center justify-between border-b px-4 pt-4 pb-3">
        <div className="flex items-center gap-2">
          <p className="text-[15px] font-semibold tracking-[-0.01em]">알림</p>
          <span className="bg-primary text-primary-foreground inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-semibold">
            {unreadCount}
          </span>
        </div>
        <button
          type="button"
          disabled={unreadCount === 0 || isMarkingRead}
          onClick={handleMarkAllAsRead}
          className={cn(
            'text-muted-foreground rounded-full px-2 py-1 text-[11px] font-semibold transition-colors',
            'hover:bg-muted/70 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40',
          )}
        >
          모두 읽음
        </button>
      </div>
      <div className="max-h-93 overflow-y-auto px-2 pt-2 pb-3">
        {isPending && <p className="text-muted-foreground px-3 py-8 text-center text-sm">불러오는 중...</p>}
        {isError && <p className="text-muted-foreground px-4 py-12 text-center text-sm">알림을 불러오지 못했습니다.</p>}
        {!isPending && !isError && notifications.length === 0 && (
          <p className="text-muted-foreground px-4 py-12 text-center text-sm">새 알림이 없습니다.</p>
        )}
        <div className="divide-border/60 divide-y">
          {notifications.map((notification) => (
            <NotificationDropdownItem
              key={notification.id}
              notification={notification}
              isMarkingRead={isMarkingRead}
              onClick={handleNotificationClick}
            />
          ))}
        </div>
      </div>
    </DropdownContent>
  );
}
