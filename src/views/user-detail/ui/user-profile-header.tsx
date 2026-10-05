'use client';

import { useRouter } from 'next/navigation';

import type { UserProfileImageResponse } from '@/entities/user';
import { useGetUserFollowCounts, UserProfileInfo } from '@/entities/user';
import { startGoogleLogin } from '@/features/auth';
import { UserBlockButton } from '@/features/user-block';
import { UserFollowButton } from '@/features/user-follow';

type Props = {
  userId: string;
  profile: UserProfileImageResponse;
};

export function UserProfileHeader({ userId, profile }: Props) {
  const router = useRouter();
  const { data: counts } = useGetUserFollowCounts(userId);

  return (
    <div className="mb-6 flex flex-col gap-4 px-1 md:flex-row md:items-center md:justify-between">
      <UserProfileInfo
        name={profile.authorName}
        profileImageUrl={profile.profileImageUrl}
        followerCount={counts?.followerCount ?? 0}
        followingCount={counts?.followingCount ?? 0}
      />
      <div className="flex items-center gap-3 md:shrink-0">
        <UserFollowButton userId={userId} onRequireLogin={startGoogleLogin} />
        <UserBlockButton
          userId={userId}
          userName={profile.authorName}
          onRequireLogin={startGoogleLogin}
          onSuccess={() => router.replace('/posts')}
        />
      </div>
    </div>
  );
}
