'use client';

import { useState } from 'react';

import { useGetUserFollowCounts, useGetUserFollowers, useGetUserFollowings } from '@/entities/user';
import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/button';
import { Modal, ModalHeader } from '@/shared/ui/modal';
import { UserFollowList } from '@/views/user-detail/ui/user-follow-list';

const USER_FOLLOW_TABS = ['followers', 'followings'] as const;

export type UserFollowTab = (typeof USER_FOLLOW_TABS)[number];

type Props = {
  overlayId: string;
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  initialTab: UserFollowTab;
};

export function UserFollowModal({ overlayId, isOpen, onClose, userId, initialTab }: Props) {
  const [activeTab, setActiveTab] = useState<UserFollowTab>(initialTab);
  const { data: counts } = useGetUserFollowCounts(userId);

  const followers = useGetUserFollowers({ userId, enabled: isOpen && activeTab === 'followers' });
  const followings = useGetUserFollowings({ userId, enabled: isOpen && activeTab === 'followings' });
  const { data: users = [], isPending, isError, refetch } = activeTab === 'followers' ? followers : followings;

  const label = activeTab === 'followers' ? '팔로워' : '팔로잉';

  return (
    <Modal
      id={overlayId}
      isOpen={isOpen}
      onClose={onClose}
      className="flex max-w-130 flex-col"
      role="dialog"
      aria-modal="true"
      aria-label="팔로우"
    >
      <ModalHeader title="팔로우" onClose={onClose} />
      <div className="bg-muted mx-6 mt-4 flex shrink-0 rounded-xl p-1" role="group" aria-label="팔로우 목록 선택">
        {USER_FOLLOW_TABS.map((tab) => (
          <Button
            key={tab}
            variant="ghost"
            aria-pressed={activeTab === tab}
            className={cn(
              'flex-1 rounded-lg',
              activeTab === tab ? 'bg-modal-surface hover:bg-modal-surface' : 'text-muted-foreground',
            )}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'followers' ? `팔로워 ${counts?.followerCount ?? 0}` : `팔로잉 ${counts?.followingCount ?? 0}`}
          </Button>
        ))}
      </div>
      <div className="h-100 min-h-0 overflow-y-auto px-6 py-5" aria-label={`${label} 목록`} aria-busy={isPending}>
        <UserFollowList
          users={users}
          isPending={isPending}
          isError={isError}
          label={label}
          onRetry={() => refetch()}
          onUserClick={onClose}
        />
      </div>
    </Modal>
  );
}
