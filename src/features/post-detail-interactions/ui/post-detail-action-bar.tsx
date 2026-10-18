'use client';

import type { PostLikeStatus } from '@/entities/post-detail';
import { POST_LIKE_STATUS } from '@/entities/post-detail';
import { useGetMe } from '@/entities/user';
import { usePostDetailInteractions } from '@/features/post-detail-interactions/model/use-post-detail-interactions';
import { usePostDetailShare } from '@/features/post-detail-interactions/model/use-post-detail-share';
import { PostDetailPrimaryActions } from '@/features/post-detail-interactions/ui/post-detail-primary-actions';
import { PostDetailReadToggleButton } from '@/features/post-detail-interactions/ui/post-detail-read-toggle-button';
import { PostDetailShareButton } from '@/features/post-detail-interactions/ui/post-detail-share-button';

type Props = {
  authorId: string;
  commentCount: number;
  isRead?: boolean;
  likeCount: number;
  likeStatus?: PostLikeStatus;
  onRequireLogin: () => void;
  onCommentClick: () => void;
  postId: string;
  viewCount: number;
};

export function PostDetailActionBar({
  authorId,
  commentCount,
  isRead,
  likeCount,
  likeStatus = POST_LIKE_STATUS.NONE,
  onRequireLogin,
  onCommentClick,
  postId,
  viewCount,
}: Props) {
  const { data: me, isPending: isAuthPending } = useGetMe();
  const { isLikePending, toggleDislike, toggleLike } = usePostDetailInteractions({
    likeStatus,
    onRequireLogin,
    postId,
  });
  const { sharePostDetail } = usePostDetailShare();
  const isOwnPost = !!me && me.id === authorId;
  const isLiked = likeStatus === POST_LIKE_STATUS.LIKE;
  const isDisliked = likeStatus === POST_LIKE_STATUS.DISLIKE;

  return (
    <div className="border-border mb-3 flex items-center justify-between gap-2 border-t py-3 md:gap-3">
      <div className="scrollbar-hidden min-w-0 flex-1 overflow-x-auto">
        <PostDetailPrimaryActions
          commentCount={commentCount}
          isDisliked={isDisliked}
          isAuthPending={isAuthPending}
          isLikePending={isLikePending}
          isLiked={isLiked}
          likeCount={likeCount}
          viewCount={viewCount}
          onCommentClick={onCommentClick}
          onToggleDislike={toggleDislike}
          onToggleLike={toggleLike}
        />
      </div>

      <div className="flex shrink-0 items-center justify-end gap-1 md:gap-3">
        {!isOwnPost && (
          <PostDetailReadToggleButton isRead={isRead ?? false} onRequireLogin={onRequireLogin} postId={postId} />
        )}
        <PostDetailShareButton onShare={sharePostDetail} />
      </div>
    </div>
  );
}
