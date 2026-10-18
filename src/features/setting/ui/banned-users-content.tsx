'use client';

import { useQueryClient } from '@tanstack/react-query';
import { Ban } from 'lucide-react';

import { getCommentsQueryKey } from '@/entities/comment';
import { getPostListQueryKey } from '@/entities/post-list';
import { useDeleteMyBannedUser, useGetMyBannedUsers } from '@/entities/user';
import { BannedUserItem } from '@/features/setting/ui/banned-user-item';

const BANNED_USERS_LOADING_MESSAGE = '차단한 계정을 불러오는 중입니다.';
const EMPTY_BANNED_USERS_MESSAGE = '차단한 계정이 없어요';

export function BannedUsersContent() {
  const queryClient = useQueryClient();
  const { data: bannedUsers = [], isPending } = useGetMyBannedUsers();

  const deleteMyBannedUser = useDeleteMyBannedUser();

  const unbanningUserId = deleteMyBannedUser.isPending ? deleteMyBannedUser.variables?.targetUserId : null;

  const handleUnbanClick = (targetUserId: string) => {
    if (deleteMyBannedUser.isPending) return;
    deleteMyBannedUser.mutate(
      { targetUserId },
      {
        onSuccess: () =>
          Promise.all([
            queryClient.invalidateQueries({ queryKey: getCommentsQueryKey() }),
            queryClient.invalidateQueries({ queryKey: getPostListQueryKey() }),
          ]),
      },
    );
  };

  if (isPending) {
    return (
      <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
        {BANNED_USERS_LOADING_MESSAGE}
      </div>
    );
  }

  if (bannedUsers.length === 0) {
    return (
      <div className="text-muted-foreground flex h-full flex-col items-center justify-center gap-4">
        <div className="bg-muted rounded-xl p-3">
          <Ban className="h-7 w-7" />
        </div>
        <p className="text-sm font-medium">{EMPTY_BANNED_USERS_MESSAGE}</p>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {bannedUsers.map((user) => (
        <BannedUserItem
          key={user.userId}
          name={user.name}
          profileImageUrl={user.profileImageUrl ?? ''}
          isUnbanning={unbanningUserId === user.userId}
          onUnban={() => handleUnbanClick(user.userId)}
        />
      ))}
    </ul>
  );
}
