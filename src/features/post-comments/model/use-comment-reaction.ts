'use client';

import { useQueryClient } from '@tanstack/react-query';

import type { CommentItem, CommentLikeStatus } from '@/entities/comment';
import { COMMENT_LIKE_STATUS, getCommentsQueryKey, useUpdateCommentLikeStatus } from '@/entities/comment';
import { useGetMe } from '@/entities/user';
import { toast } from '@/shared/ui/toast';

type Params = {
  comment: CommentItem;
  onRequireLogin: () => void;
};

const COMMENT_REACTION_FAILED_MESSAGE = '댓글 반응 업데이트에 실패했습니다.';

export const useCommentReaction = ({ comment, onRequireLogin }: Params) => {
  const queryClient = useQueryClient();
  const { data: me, isPending: isAuthPending } = useGetMe();
  const commentLikeMutation = useUpdateCommentLikeStatus();
  const isLoggedIn = !!me;

  const ensureLoggedIn = () => {
    if (isAuthPending) return false;
    if (isLoggedIn) return true;

    onRequireLogin();
    return false;
  };

  const invalidateCommentReactionQueries = async () => {
    await queryClient.invalidateQueries({ queryKey: getCommentsQueryKey() });
  };

  const handleCommentReaction = (targetLikeStatus: CommentLikeStatus) => {
    if (!ensureLoggedIn()) return;
    if (commentLikeMutation.isPending) return;

    const nextLikeStatus = getNextCommentLikeStatus({
      currentLikeStatus: comment.likeStatus,
      targetLikeStatus,
    });

    commentLikeMutation.mutate(
      {
        commentId: comment.id,
        data: {
          likeStatus: nextLikeStatus,
        },
      },
      {
        onError: () => {
          toast.error(COMMENT_REACTION_FAILED_MESSAGE);
        },
        onSuccess: invalidateCommentReactionQueries,
      },
    );
  };

  const handleLikeComment = () => {
    handleCommentReaction(COMMENT_LIKE_STATUS.LIKE);
  };

  const handleDislikeComment = () => {
    handleCommentReaction(COMMENT_LIKE_STATUS.DISLIKE);
  };

  return {
    handleDislikeComment,
    handleLikeComment,
    isPending: commentLikeMutation.isPending,
  };
};

const getNextCommentLikeStatus = ({
  currentLikeStatus,
  targetLikeStatus,
}: {
  currentLikeStatus: CommentLikeStatus;
  targetLikeStatus: CommentLikeStatus;
}) => {
  if (currentLikeStatus === targetLikeStatus) return COMMENT_LIKE_STATUS.NONE;

  return targetLikeStatus;
};
