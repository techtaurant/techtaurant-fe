'use client';

import { Bell } from 'lucide-react';

import { useGetMyUnreadNotificationCount } from '@/entities/notification';
import { cn } from '@/shared/lib/cn';
import { DropdownProvider, DropdownTrigger } from '@/shared/ui/dropdown';
import { NotificationDropdownContent } from '@/widgets/header/ui/notification-dropdown-content';

export function NotificationDropdown() {
  const { data: unreadCount = 0 } = useGetMyUnreadNotificationCount();

  return (
    <DropdownProvider>
      <DropdownTrigger
        aria-label="알림"
        className={cn('border-border relative h-9 w-9 rounded-full border transition-colors', 'hover:bg-muted')}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="bg-primary text-primary-foreground absolute -top-1 -right-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </DropdownTrigger>
      <NotificationDropdownContent unreadCount={unreadCount} />
    </DropdownProvider>
  );
}
