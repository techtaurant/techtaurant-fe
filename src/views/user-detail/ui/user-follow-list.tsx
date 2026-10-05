'use client';

import Link from 'next/link';

import { UserAvatar } from '@/entities/user';
import { startGoogleLogin } from '@/features/auth';
import { UserFollowButton } from '@/features/user-follow';
import type { UserFollowListItemResponse } from '@/shared/api/generated';
import { Button } from '@/shared/ui/button';

type Props = {
  users: UserFollowListItemResponse[];
  isPending: boolean;
  isError: boolean;
  label: string;
  onRetry: () => void;
  onUserClick: () => void;
};

export function UserFollowList({ users, isPending, isError, label, onRetry, onUserClick }: Props) {
  if (isPending) {
    return <p className="text-muted-foreground py-12 text-center text-sm">목록을 불러오는 중입니다.</p>;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 py-12">
        <p className="text-muted-foreground text-sm">목록을 불러오지 못했어요.</p>
        <Button onClick={onRetry}>다시 시도</Button>
      </div>
    );
  }

  if (users.length === 0) {
    return <p className="text-muted-foreground py-12 text-center text-sm">{label}가 없습니다.</p>;
  }

  return (
    <ul className="space-y-4">
      {users.map((user) => (
        <li key={user.userId} className="flex items-center justify-between gap-3">
          <Link
            href={`/users/${user.userId}`}
            onClick={onUserClick}
            className="flex min-w-0 items-center gap-3 hover:underline"
          >
            <UserAvatar name={user.name} profileImageUrl={user.profileImageUrl} className="h-8 w-8 shrink-0" />
            <span className="truncate font-semibold">{user.name}</span>
          </Link>
          <UserFollowButton
            userId={user.userId}
            onRequireLogin={startGoogleLogin}
            className="h-7 min-w-0 shrink-0 px-3 text-sm"
          />
        </li>
      ))}
    </ul>
  );
}
