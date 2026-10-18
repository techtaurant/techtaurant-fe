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
        className={cn(
          'border-border/70 bg-background text-muted-foreground relative h-9 w-9 rounded-full border transition-colors',
          'hover:border-border hover:bg-muted/60 hover:text-foreground',
        )}
      >
        <Bell className="h-4.25 w-4.25" strokeWidth={2.1} />
        {unreadCount > 0 && (
          <span className="bg-primary text-primary-foreground ring-background absolute -top-1 -right-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold ring-2">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </DropdownTrigger>
      <NotificationDropdownContent unreadCount={unreadCount} />
    </DropdownProvider>
  );
}
