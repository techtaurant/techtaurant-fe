import Image from 'next/image';

import type { NotificationListItemResponse } from '@/shared/api/generated';
import { cn } from '@/shared/lib/cn';
import { formatDisplayTime } from '@/shared/lib/format-date';
import { DropdownItem } from '@/shared/ui/dropdown';
import { sanitizeNotificationPayload } from '@/widgets/header/lib/sanitize-notification-payload';

type Props = {
  notification: NotificationListItemResponse;
  onClick: (notification: NotificationListItemResponse) => void;
};

export function NotificationDropdownItem({ notification, onClick }: Props) {
  return (
    <DropdownItem
      onClick={() => onClick(notification)}
      className="group block w-full rounded-[18px] px-0 py-1 text-left leading-normal font-normal transition-colors hover:bg-transparent focus-visible:bg-transparent focus-visible:outline-none active:bg-transparent"
    >
      <div
        className={cn(
          'flex items-start gap-3 rounded-2xl px-3 py-2 transition-colors',
          'group-hover:bg-muted/50 group-focus-visible:bg-muted/60',
          !notification.isRead && 'bg-muted/25',
        )}
      >
        <div className="relative min-w-0 flex-1">
          {!notification.isRead && (
            <span className="absolute top-1.5 -left-3 block h-2.5 w-2.5 rounded-full bg-emerald-500" />
          )}
          <div className="flex max-h-18 items-start gap-2 overflow-hidden text-[12.5px] leading-normal">
            {notification.thumbnailUrl && (
              <div className="bg-muted relative h-10.5 w-10.5 shrink-0 overflow-hidden rounded-full">
                <Image src={notification.thumbnailUrl} alt="" fill sizes="42px" className="object-cover" />
              </div>
            )}
            <div
              className="line-clamp-3 min-w-0 flex-1"
              dangerouslySetInnerHTML={{ __html: sanitizeNotificationPayload(notification.payloadHtml) }}
            />
          </div>
          <time className="text-muted-foreground mt-2 block text-[11px] font-medium" dateTime={notification.createdAt}>
            {formatDisplayTime(notification.createdAt)}
          </time>
        </div>
      </div>
    </DropdownItem>
  );
}
