'use client';

import { useUserFollow } from '@/features/user-follow/model/use-user-follow';
import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/button';
import { toast } from '@/shared/ui/toast';

type Props = {
  userId: string;
  onRequireLogin: () => void;
  className?: string;
};

export function UserFollowButton({ userId, onRequireLogin, className }: Props) {
  const { isAuthPending, isFollowing, isUpdating, isOwnUser, toggleFollow } = useUserFollow({
    userId,
    onRequireLogin,
    onError: (nextFollowingState) => {
      toast.error(nextFollowingState ? '팔로우에 실패했어요' : '팔로우 취소에 실패했어요');
    },
    onSuccess: (nextFollowingState) => {
      toast.success(nextFollowingState ? '팔로우했어요' : '팔로우를 해제했어요');
    },
  });

  // 인증 판정 전에는 본인에게 팔로우 버튼이 노출되지 않도록 숨깁니다.
  if (isAuthPending || isOwnUser) return null;

  return (
    <Button
      variant="primarySurface"
      className={cn('h-10 min-w-30 rounded-md px-5 text-base font-semibold', className)}
      disabled={isUpdating}
      onClick={toggleFollow}
    >
      {isFollowing ? '팔로잉' : '팔로우'}
    </Button>
  );
}
