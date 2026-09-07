'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { PostTagList } from '@/entities/post-list';
import { useGetMe, UserAvatar } from '@/entities/user';
import { startGoogleLogin } from '@/features/auth';
import { usePostDetailAuthorFollow } from '@/features/post-detail-interactions';
import type { PostListTagResponse } from '@/shared/api/generated';
import { cn } from '@/shared/lib/cn';
import { formatAbsoluteDate } from '@/shared/lib/format-date';
import { toast } from '@/shared/ui/toast';
import { useOpenPostDetailAuthorBlockConfirmModal } from '@/views/post-detail/model/use-open-post-detail-author-block-confirm-modal';
import { PostDetailHeaderActions } from '@/views/post-detail/ui/post-detail-header-actions';

type Props = {
  authorId: string;
  authorName: string;
  categoryName?: string;
  createdAt: string;
  postId: string;
  profileImageUrl: string;
  tags: PostListTagResponse[];
  title: string;
  updatedAt: string;
};

const FOLLOW_ERROR_MESSAGE = '팔로우에 실패했어요';
const UNFOLLOW_ERROR_MESSAGE = '팔로우 취소에 실패했어요';

export function PostDetailArticleHeader({
  authorId,
  authorName,
  categoryName,
  createdAt,
  postId,
  profileImageUrl,
  tags,
  title,
  updatedAt,
}: Props) {
  const { data: me, isPending: isAuthPending } = useGetMe();
  const isLoggedIn = !!me;
  const { isFollowingAuthor, isFollowingUpdating, isOwnAuthor, toggleAuthorFollow } = usePostDetailAuthorFollow({
    authorId,
    onError: (nextFollowingState) => {
      toast.error(nextFollowingState ? FOLLOW_ERROR_MESSAGE : UNFOLLOW_ERROR_MESSAGE);
    },
    onRequireLogin: startGoogleLogin,
    onSuccess: (nextFollowingState) => {
      toast.success(nextFollowingState ? `${authorName}님을 팔로우했어요` : `${authorName}님 팔로우를 해제했어요`);
    },
  });
  const openPostDetailAuthorBlockConfirmModal = useOpenPostDetailAuthorBlockConfirmModal({
    authorId,
    authorName,
    postId,
  });
  const shouldShowUpdatedAt = Date.parse(updatedAt) > Date.parse(createdAt);

  const handleBlockAuthorButtonClick = () => {
    if (isAuthPending) return;

    if (!isLoggedIn) {
      startGoogleLogin();
      return;
    }

    openPostDetailAuthorBlockConfirmModal();
  };

  return (
    <header className="mb-8">
      <Link
        href="/posts"
        className="text-muted-foreground hover:text-foreground mb-6 flex w-fit items-center gap-1.5 text-sm font-medium transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        목록
      </Link>
      {/* TODO: 카테고리 클릭 시 작성자의 [내 글] 페이지로 이동하도록 연결합니다. */}
      {categoryName && (
        <span className="bg-muted text-muted-foreground mb-3 inline-flex max-w-full rounded-full px-3 py-1 text-sm font-medium">
          {categoryName}
        </span>
      )}
      <h1 className={cn('text-foreground mb-6 text-2xl leading-tight font-bold wrap-break-word', 'md:text-4xl')}>
        {title}
      </h1>
      <div className="mb-1 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <UserAvatar name={authorName} profileImageUrl={profileImageUrl} className="h-6 w-6 shrink-0" />
          <div className="text-muted-foreground flex min-w-0 flex-wrap items-center gap-2 text-sm">
            <span className="text-foreground truncate font-medium">{authorName}</span>
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
          </div>
        </div>
        <PostDetailHeaderActions
          isAuthPending={isAuthPending}
          isFollowingAuthor={isFollowingAuthor}
          isFollowingUpdating={isFollowingUpdating}
          isOwnAuthor={isOwnAuthor}
          onRequestBlockAuthor={handleBlockAuthorButtonClick}
          onToggleAuthorFollow={toggleAuthorFollow}
        />
      </div>
      <PostTagList tags={tags} variant="detail" />
    </header>
  );
}
