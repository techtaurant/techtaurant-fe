'use client';

import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { getPostDetailQueryKey } from '@/entities/post-detail';
import { PostTagList } from '@/entities/post-list';
import { useGetMe, UserAvatar } from '@/entities/user';
import { startGoogleLogin } from '@/features/auth';
import { PostDetailOwnerMenu } from '@/features/post-detail-interactions';
import { useOpenUserBlockConfirmModal } from '@/features/user-block';
import { useUserFollow } from '@/features/user-follow';
import type { CategoryResponse, PostListTagResponse } from '@/shared/api/generated';
import { PostDetailResponseStatus } from '@/shared/api/generated';
import { cn } from '@/shared/lib/cn';
import { formatAbsoluteDate } from '@/shared/lib/format-date';
import { Badge } from '@/shared/ui/badge';
import { toast } from '@/shared/ui/toast';
import { PostDetailHeaderActions } from '@/views/post-detail/ui/post-detail-header-actions';

type Props = {
  authorId: string;
  authorName: string;
  category?: CategoryResponse;
  createdAt: string;
  postId: string;
  profileImageUrl: string;
  status: PostDetailResponseStatus;
  tags: PostListTagResponse[];
  title: string;
  updatedAt: string;
};

const FOLLOW_ERROR_MESSAGE = '팔로우에 실패했어요';
const UNFOLLOW_ERROR_MESSAGE = '팔로우 취소에 실패했어요';
const PRIVATE_BADGE_LABEL = '비공개';

export function PostDetailArticleHeader({
  authorId,
  authorName,
  category,
  createdAt,
  postId,
  profileImageUrl,
  status,
  tags,
  title,
  updatedAt,
}: Props) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data: me, isPending: isAuthPending } = useGetMe();
  const isLoggedIn = !!me;
  const {
    isFollowing: isFollowingAuthor,
    isUpdating: isFollowingUpdating,
    isOwnUser: isOwnAuthor,
    toggleFollow: toggleAuthorFollow,
  } = useUserFollow({
    userId: authorId,
    onError: (nextFollowingState) => {
      toast.error(nextFollowingState ? FOLLOW_ERROR_MESSAGE : UNFOLLOW_ERROR_MESSAGE);
    },
    onRequireLogin: startGoogleLogin,
    onSuccess: (nextFollowingState) => {
      toast.success(nextFollowingState ? `${authorName}님을 팔로우했어요` : `${authorName}님 팔로우를 해제했어요`);
    },
  });
  const openUserBlockConfirmModal = useOpenUserBlockConfirmModal({
    userId: authorId,
    userName: authorName,
    onSuccess: () => {
      queryClient.removeQueries({ exact: true, queryKey: getPostDetailQueryKey(postId) });
      router.replace('/posts');
    },
  });
  const shouldShowUpdatedAt = Date.parse(updatedAt) > Date.parse(createdAt);
  const isPrivate = status === PostDetailResponseStatus.PRIVATE;

  const handleBlockAuthorButtonClick = () => {
    if (isAuthPending) return;

    if (!isLoggedIn) {
      startGoogleLogin();
      return;
    }

    openUserBlockConfirmModal();
  };

  return (
    <header className="mb-8">
      <Link
        href="/posts"
        className="text-muted-foreground hover:text-foreground mb-6 flex w-fit items-center gap-1.5 text-sm font-medium transition-colors"
      >
        <ArrowLeft className="size-4" />
        목록
      </Link>
      {category && (
        <Link
          href={`/users/${authorId}?categoryId=${category.id}`}
          className="bg-muted text-muted-foreground hover:text-foreground mb-3 inline-flex max-w-full rounded-full px-3 py-1 text-sm font-medium wrap-anywhere transition-colors"
        >
          {category.path}
        </Link>
      )}
      <h1 className={cn('text-foreground mb-6 text-2xl/tight font-bold wrap-break-word', 'md:text-4xl')}>{title}</h1>
      <div className="mb-1 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Link href={`/users/${authorId}`}>
            <UserAvatar name={authorName} profileImageUrl={profileImageUrl} className="size-6 shrink-0" />
          </Link>
          <div className="text-muted-foreground flex min-w-0 flex-wrap items-center gap-2 text-sm">
            <Link href={`/users/${authorId}`} className="text-foreground truncate font-medium hover:underline">
              {authorName}
            </Link>
            <span>•</span>
            <time className="shrink-0" dateTime={createdAt}>
              {formatAbsoluteDate(createdAt)}
            </time>
            {shouldShowUpdatedAt && (
              <>
                <span>•</span>
                <time className="shrink-0" dateTime={updatedAt}>
                  수정 {formatAbsoluteDate(updatedAt)}
                </time>
              </>
            )}
            {isPrivate && <Badge>{PRIVATE_BADGE_LABEL}</Badge>}
          </div>
        </div>
        {isOwnAuthor ? (
          <PostDetailOwnerMenu isPrivate={isPrivate} postId={postId} />
        ) : (
          <PostDetailHeaderActions
            isAuthPending={isAuthPending}
            isFollowingAuthor={isFollowingAuthor}
            isFollowingUpdating={isFollowingUpdating}
            onRequestBlockAuthor={handleBlockAuthorButtonClick}
            onToggleAuthorFollow={toggleAuthorFollow}
          />
        )}
      </div>
      <PostTagList tags={tags} variant="detail" />
    </header>
  );
}
