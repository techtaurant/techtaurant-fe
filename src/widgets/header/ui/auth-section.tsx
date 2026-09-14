'use client';

import { useGetMe } from '@/entities/user';
import { LoginButton } from '@/features/auth/ui/login-button';
import { cn } from '@/shared/lib/cn';
import { HeaderAuthSkeleton } from '@/widgets/header/ui/header-auth-skeleton';
import { NotificationDropdown } from '@/widgets/header/ui/notification-dropdown';
import { PostWriteLink } from '@/widgets/header/ui/post-write-link';
import { UserMenu } from '@/widgets/header/ui/user-menu';

export function AuthSection() {
  const { data: me, isPending } = useGetMe();

  if (isPending) {
    return <HeaderAuthSkeleton />;
  }

  if (!me) {
    return <LoginButton />;
  }

  return (
    <div className={cn('flex items-center gap-4')}>
      <PostWriteLink />
      <NotificationDropdown />
      <UserMenu user={me} />
    </div>
  );
}
